# AI Guardrails API

A lightweight, production-ready API Gateway for LLM Safety.
It detects Prompt Injection and Redacts PII before queries reach your LLM.

## 🚀 Quick Start

### 1. Local Setup
Prerequisites: Python 3.11+

```bash
# Create venv
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Install deps
pip install -r requirements.txt

# Download NLP Model (Required for PII)
python -m spacy download en_core_web_lg

python -m spacy download en_core_web_sm
```

### 2. Run Server
```bash
uvicorn app.main:app --reload
```
Server running at: `http://localhost:8000`
Docs at: `http://localhost:8000/api/v1/docs`

### 3. Verify MVP
Run the test script to see the guardrails in action:
```bash
python tests/verify_mvp.py
```

## 🐳 Docker Support
Build and run with a single command:
```bash
docker build -t ai-guardrails .
docker run -p 8000:8000 ai-guardrails
```

## 🛡️ Features
- **PII Redaction:** Automatically masks Phones, Emails, Credit Cards (using Microsoft Presidio).
- **Injection Detection:** Blocks "Ignore previous instructions" style attacks.
- **FastAPI Async:** ready for high concurrency.
