import re

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

    def detect_injection(self, text: str):
        """
        Checks for prompt injection attempts.
        Returns: (is_safe: bool, reason: str | None)
        """
        text_lower = text.lower()
        
        for pattern in self.injection_patterns:
            if re.search(pattern, text_lower):
                return False, "POTENTIAL_PROMPT_INJECTION"
        
        return True, None

security_scanner = SecurityScanner()
