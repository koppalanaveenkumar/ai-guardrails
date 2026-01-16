from gliner import GLiNER
from app.core.logging_config import logger
import time

class GlinerPiiService:
    def __init__(self):
        self.model = None
        self.model_name = "urchade/gliner_small-v2.1"
        self.labels = ["person", "organization", "location", "email", "phone number", "credit card", "password", "api key", "secret"]

    def load_model(self):
        """Lazy loading of the model to avoid memory spike on import"""
        if not self.model:
            logger.info(f"🧠 Loading GLiNER model: {self.model_name}...")
            start = time.time()
            try:
                self.model = GLiNER.from_pretrained(self.model_name)
                logger.info(f"✅ GLiNER loaded in {time.time() - start:.2f}s")
            except Exception as e:
                logger.error(f"❌ Failed to load GLiNER: {e}")
                # Fallback or re-raise depending on strictness. 
                # For now, we want to know if it fails.
                raise e

    def anonymize(self, text: str):
        """
        Detects and PII entities and replaces them.
        Returns: (sanitized_text, list_of_types_found)
        """
        if not self.model:
            self.load_model()

        if not text:
            return text, []

        entities = self.model.predict_entities(text, self.labels)
        
        # Sort entities by start index (descending) to replace without messing up indices
        entities.sort(key=lambda x: x['start'], reverse=True)
        
        sanitized_text = text
        detected_types = set()

        for entity in entities:
            start = entity['start']
            end = entity['end']
            label = entity['label']
            score = entity['score']
            
            # Threshold check (GLiNER is usually confident, but let's be safe)
            if score < 0.35: 
                continue

            detected_types.add(label)
            
            # Replace logic
            replacement = f"<{label.upper()}>"
            sanitized_text = sanitized_text[:start] + replacement + sanitized_text[end:]

        return sanitized_text, list(detected_types)

# Singleton instance
gliner_service = GlinerPiiService()
