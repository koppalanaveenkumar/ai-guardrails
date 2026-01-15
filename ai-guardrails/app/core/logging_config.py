import logging
import sys

def setup_logging():
    """
    Configure logging for the application.
    """
    logger = logging.getLogger("ai_guardrails")
    logger.setLevel(logging.INFO)

    # Console Handler
    handler = logging.StreamHandler(sys.stdout)
    handler.setLevel(logging.INFO)

    # Format
    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )
    handler.setFormatter(formatter)

    if not logger.handlers:
        logger.addHandler(handler)
    
    return logger

logger = setup_logging()
