from fastapi import APIRouter, HTTPException, Request, Depends, BackgroundTasks
from pydantic import BaseModel, Field
from typing import List, Optional
import time
from app.services.pii_service import pii_analyzer
from app.services.security_service import security_scanner
from app.core.limiter import limiter
from app.core.security import get_api_key
from app.services.audit_service import log_request

router = APIRouter()

class GuardConfig(BaseModel):
    detect_injection: bool = True
    redact_pii: bool = True
    block_topics: Optional[List[str]] = None

class GuardRequest(BaseModel):
    prompt: str
    config: Optional[GuardConfig] = Field(default_factory=GuardConfig)

class GuardResponse(BaseModel):
    safe: bool
    sanitized_prompt: Optional[str] = None
    reason: Optional[str] = None
    pii_detected: Optional[List[str]] = []

@router.post("/", response_model=GuardResponse)
@limiter.limit("5/minute")
async def analyze_prompt(
    request: Request, 
    body: GuardRequest, 
    background_tasks: BackgroundTasks,
    api_key: str = Depends(get_api_key)
):
    start_time = time.time()
    
    # Default to safe
    is_safe = True
    # NOTE: slowapi requires 'request' in args. We use 'body' for the Pydantic model.
    sanitized_prompt = body.prompt
    pii_entities = []
    reason = None

    # Helper to log before return
    def log_result(safe, stop_reason):
        latency = (time.time() - start_time) * 1000
        background_tasks.add_task(
            log_request,
            api_key=api_key,
            is_safe=safe,
            reason=stop_reason,
            latency_ms=latency,
            config=body.config.dict()
        )

    # 1. PII Redaction
    if body.config.redact_pii:
        # We will implement pii_analyzer.analyze_and_anonymize
        sanitized_prompt, pii_entities = pii_analyzer.analyze_and_anonymize(body.prompt)
    
    # 2. Injection Detection
    if body.config.detect_injection:
        is_safe, failure_reason = security_scanner.detect_injection(sanitized_prompt)
        if not is_safe:
            reason = failure_reason
            log_result(False, reason)
            return GuardResponse(
                safe=False,
                sanitized_prompt=None, # Don't return prompt if injection detected
                reason=reason,
                pii_detected=pii_entities
            )

    # 3. Topic Blocking (Keyword Filter)
    if body.config.block_topics:
        prompt_lower = sanitized_prompt.lower()
        for topic in body.config.block_topics:
            if topic.lower() in prompt_lower:
                reason = f"BLOCKED_TOPIC: {topic}"
                log_result(False, reason)
                return GuardResponse(
                    safe=False,
                    sanitized_prompt=None,
                    reason=reason,
                    pii_detected=pii_entities
                )

    log_result(True, None)
    return GuardResponse(
        safe=is_safe,
        sanitized_prompt=sanitized_prompt,
        pii_detected=pii_entities,
        reason=reason
    )
