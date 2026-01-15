from presidio_analyzer import AnalyzerEngine, PatternRecognizer, Pattern, RecognizerRegistry
from presidio_anonymizer import AnonymizerEngine
from presidio_anonymizer.entities import OperatorConfig

class PIIAnalyzer:
    def __init__(self):
        # 1. Setup Registry
        registry = RecognizerRegistry()
        registry.load_predefined_recognizers()

        # 2. Add Custom "Weak" Phone Recognizer (to catch 555-0199 and other simple formats)
        # The default Presidio phone recognizer needs context or strict formatting.
        # We add a lenient regex for 'XXX-XXXX' or 'XXX-XXX-XXXX'
        # Matches: 555-0199 (7 digit) OR 555-555-0199 (10 digit)
        phone_pattern = Pattern(name="loose_phone_pattern", regex=r"\b(\d{3}[-.]?)?\d{3}[-.]?\d{4}\b", score=0.6)
        loose_phone_recognizer = PatternRecognizer(supported_entity="PHONE_NUMBER", patterns=[phone_pattern])
        registry.add_recognizer(loose_phone_recognizer)

        # 3. Initialize Engines
        self.analyzer = AnalyzerEngine(registry=registry)
        self.anonymizer = AnonymizerEngine()

    def analyze_and_anonymize(self, text: str):
        """
        Analyzes text for PII and anonymizes it.
        Returns: (anonymized_text, list_of_detected_pii_types)
        """
        if not text:
            return text, []

        # Analyze
        results = self.analyzer.analyze(text=text, language='en')
        
        # Anonymize
        anonymized_result = self.anonymizer.anonymize(
            text=text,
            analyzer_results=results
        )
        
        # Extract unique entity types found for reporting
        detected_entities = list(set([res.entity_type for res in results]))
        
        return anonymized_result.text, detected_entities

# Singleton instance
pii_analyzer = PIIAnalyzer()
