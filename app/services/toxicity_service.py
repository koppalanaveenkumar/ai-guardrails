from transformers import pipeline
from app.core.logging_config import logger
import time

class ToxicityService:
    def __init__(self):
        self.pipeline = None
        # This model is fine-tuned for toxicity detection and is relatively fast (RoBERTa based)
        self.model_name = "unitary/unbiased-toxic-roberta"

    def load_model(self):
        """Lazy load the model."""
        if not self.pipeline:
            logger.info(f"☣️ Loading Toxicity model: {self.model_name}...")
            start = time.time()
            try:
                # Returns a list of dicts: [{'label': 'toxicity', 'score': 0.99}, ...]
                self.pipeline = pipeline("text-classification", model=self.model_name, top_k=None)
                logger.info(f"✅ Toxicity model loaded in {time.time() - start:.2f}s")
            except Exception as e:
                logger.error(f"❌ Failed to load Toxicity model: {e}")
                raise e

    def scan(self, text: str, threshold: float = 0.7):
        """
        Scans text for toxic attributes.
        Returns: (is_toxic, score, list_of_flags)
        """
        if not self.pipeline:
            self.load_model()

        if not text:
            return False, 0.0, []

        # Run prediction
        # Output format: [[{'label': 'toxicity', 'score': 0.9}, {'label': 'severe_toxicity', ...}]]
        results = self.pipeline(text)
        
        # Flatten the list (pipeline returns a list of lists for single input)
        scores = results[0]
        
        flags = []
        max_score = 0.0

        # Categories to flag
        target_labels = ["toxicity", "severe_toxicity", "obscene", "threat", "insult", "identity_attack"]

        for item in scores:
            label = item['label']
            score = item['score']
            
            if label in target_labels:
                if score > max_score:
                    max_score = score
                
                if score > threshold:
                    flags.append(label)

        is_toxic = len(flags) > 0
        
        # Sort flags by severity/relevance if needed, but list is fine
        return is_toxic, max_score, flags

# Singleton
toxicity_scanner = ToxicityService()
