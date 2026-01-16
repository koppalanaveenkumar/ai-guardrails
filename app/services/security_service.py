import re

from app.services.semantic_service import semantic_scanner
from better_profanity import profanity

class SecurityScanner:
    def __init__(self):
        # MVP: Simple Regex Patterns for common jailbreaks
        self.injection_patterns = [
            r"ignore all previous instructions",
            r"ignore previous instructions",
            r"ignore.*instructions",
            r"do anything now",
            r"dan mode",
            r"jailbreak",
            r"you are now",
            r"act as",
            r"simulate",
        ]
        # Initialize toxicity filter
        profanity.load_censor_words()

    def scan(self, text: str):
        """
        Checks for prompt injection and toxicity.
        Returns: (is_safe: bool, reason: str | None, score: float)
        """
        # 1. Fast Regex Check
        text_lower = text.lower()
        for pattern in self.injection_patterns:
            if re.search(pattern, text_lower):
                return False, "POTENTIAL_PROMPT_INJECTION (Regex)", 1.0
        
        # 2. Toxicity Check (Basic Profanity - Legacy)
        # NOTE: We are moving to ToxicityService, but keeping this as fast falback
        if profanity.contains_profanity(text):
             return False, "TOXIC_CONTENT_DETECTED", 1.0

        # 3. Semantic Check (Slower but Smarter)
        if semantic_scanner:
            is_safe, score, match = semantic_scanner.check_similarity(text)
            if not is_safe:
                return False, f"POTENTIAL_PROMPT_INJECTION (Semantic: {match})", score

        return True, None, 0.0

security_scanner = SecurityScanner()
