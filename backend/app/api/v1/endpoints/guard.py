from fastapi import APIRouter, HTTPException, Request, Depends, BackgroundTasks
from pydantic import BaseModel, Field
from typing import List, Optional
import time
from app.services.gliner_service import gliner_service
from app.services.security_service import security_scanner
from app.services.toxicity_service import toxicity_scanner
from app.services.notification_service import notification_service
from app.core.limiter import limiter
from app.core.security import get_api_key
from app.services.audit_service import log_request

router = APIRouter()

class GuardConfig(BaseModel):
    detect_injection: bool = True
    redact_pii: bool = True
    detect_toxicity: bool = False
    block_topics: Optional[List[str]] = None

class GuardRequest(BaseModel):
    prompt: str
    config: Optional[GuardConfig] = Field(default_factory=GuardConfig)

class GuardResponse(BaseModel):
    safe: bool
    score: float = 0.0
    sanitized_prompt: Optional[str] = None
    reason: Optional[str] = None
    pii_detected: Optional[List[str]] = []

@router.post("/", response_model=GuardResponse)
@limiter.limit("5/minute")
async def analyze_prompt(
    request: Request, 
    body: GuardRequest, 
    background_tasks: BackgroundTasks,
    api_key = Depends(get_api_key)
):
    start_time = time.time()
    
    # Default to safe
    is_safe = True
    sanitized_prompt = body.prompt
    pii_entities = []
    reason = None

    # Helper to log before return
    def log_result(safe, stop_reason, final_score):
        latency = (time.time() - start_time) * 1000
        key_id = api_key.id if hasattr(api_key, 'id') else None
        
        # Append score to reason for visibility in existing logs
        if stop_reason and final_score > 0:
            stop_reason = f"{stop_reason} (Conf: {final_score:.2f})"

        # 1. Database Audit Log
        background_tasks.add_task(
            log_request,
            model_name="guard-v2-composite",
            is_safe=safe,
            reason=stop_reason,
            latency_ms=latency,
            pii_detected=pii_entities,
            api_key_id=key_id
        )

        # 2. Webhook Notification (Only on Block)
        if not safe:
            background_tasks.add_task(
                notification_service.send_alert,
                reason=stop_reason,
                score=final_score,
                details=f"PII: {pii_entities}" if pii_entities else None
            )

    # 1. PII Redaction
    if body.config.redact_pii:
        sanitized_prompt, pii_entities = gliner_service.anonymize(body.prompt)
    
    # 2. Injection Detection
    if body.config.detect_injection:
        is_safe, reason, score = security_scanner.scan(sanitized_prompt)
        if not is_safe:
            log_result(safe=False, stop_reason=reason, final_score=score)
            return GuardResponse(safe=False, reason=reason, pii_detected=pii_entities, score=score)

    # 3. Toxicity Detection (New)
    if body.config.detect_toxicity:
        is_toxic, tox_score, flags = toxicity_scanner.scan(sanitized_prompt)
        if is_toxic:
            reason = f"TOXIC_CONTENT: {', '.join(flags)}"
            log_result(safe=False, stop_reason=reason, final_score=tox_score)
            return GuardResponse(safe=False, reason=reason, pii_detected=pii_entities, score=tox_score, sanitized_prompt=sanitized_prompt)

    # 4. Topic Blocking (Keyword Filter)
    if body.config.block_topics:
        prompt_lower = sanitized_prompt.lower()
        for topic in body.config.block_topics:
            if topic.lower() in prompt_lower:
                reason = f"BLOCKED_TOPIC: {topic}"
                log_result(safe=False, stop_reason=reason, final_score=1.0)
                return GuardResponse(
                    safe=False,
                    sanitized_prompt=None,
                    reason=reason,
                    pii_detected=pii_entities,
                    score=1.0
                )

    log_result(safe=True, stop_reason=None, final_score=0.0)
    return GuardResponse(
        safe=is_safe,
        sanitized_prompt=sanitized_prompt,
        pii_detected=pii_entities,
        reason=reason,
        score=0.0
    )
