# AI Guardrails

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green.svg)](https://fastapi.tiangolo.com)

**Open-source LLM security platform** that stops prompt injection attacks, redacts PII, and logs everything—all in under 50ms.

The developer-friendly alternative to enterprise LLM security solutions.

---

## 🚀 Features
 
 - **🛡️ Prompt Injection Defense** - Semantic analysis detects jailbreak attempts that keyword filters miss.
 - **☣️ Toxicity Detection** - Detects toxic, abusive, or harmful content with high confidence scores.
 - **🔔 Real-Time Alerts** - Sends instant notifications to Slack/Discord when an attack is blocked.
 - **🔒 Real-Time PII Redaction** - Powered by **GLiNER** (Deep Learning) for state-of-the-art accuracy.
- **📊 Compliance-Ready Audit Logs** - Every request tracked for GDPR, HIPAA, SOC 2
- **⚡ Sub-50ms Latency** - Optimized pipeline adds negligible overhead
- **🔧 Topic Blocking** - Prevent discussions of competitors, politics, or custom blocklists
- **🌐 Universal Integration** - Works with OpenAI, Anthropic, Google, or any LLM

---

## 📖 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL
- Redis (optional, for rate limiting)

### Backend Setup

```bash
# Clone repository
git clone https://github.com/yourusername/ai-guardrails.git
cd ai-guardrails

# Install dependencies
cd ai-guardrails
pip install -r requirements.txt

# Set up environment
cp .env.example .env
# Edit .env with your DATABASE_URL, REDIS_URL, etc.

# Run server
uvicorn app.main:app --reload
```

Backend runs at: `http://localhost:8000`

### Frontend Setup

```bash
# Install dependencies
cd frontend
npm install

# Set up environment
cp .env.example .env
# Edit .env with VITE_API_URL

# Run development server
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🎯 Usage

### API Example

```python
import requests

response = requests.post(
    "http://localhost:8000/api/v1/guard/",
    headers={"x-api-key": "your_api_key"},
    json={
        "prompt": "My email is john@example.com and SSN is 123-45-6789",
        "config": {
            "detect_injection": True,
            "redact_pii": True,
            "block_topics": []
        }
    }
)

print(response.json())
# Output:
# {
#   "safe": True,
#   "sanitized_prompt": "My email is <EMAIL> and SSN is <SSN>",
#   "pii_detected": ["email", "ssn"],
#   "reason": null,
#   "score": 0.0
# }
```

### ☣️ Toxicity Detection

Enable `detect_toxicity: true` in config.

```json
{
  "safe": false,
  "reason": "TOXIC_CONTENT: insult (Conf: 0.99)",
  "score": 0.99
}
```

### 🔔 Real-Time Alerts

Add `WEBHOOK_URL=https://hooks.slack.com/...` to your `.env`.
When a threat is blocked, you'll get an instant notification:

> 🚨 **GUARDRAILS ALERT**
> **Reason:** TOXIC_CONTENT (Conf: 0.99)
> **Details:** PII: ['email']

### 🔒 Traefik Middleware

Easily integrate with Kubernetes/Traefik as a ForwardAuth middleware.
See [**examples/traefik**](examples/traefik) for a full Docker Compose example.

### Register & Get API Key

```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "secure_password"}'

# Response: {"api_key": "ag_live_..."}
```

---

## 🏗️ Architecture

```
User Input → AI Guardrails API → Sanitized Prompt → Your LLM → Safe Response
                ↓
         Audit Log (PostgreSQL)
```

### Tech Stack

**Backend:**
- FastAPI (async Python)
- PostgreSQL (audit logs)
- Redis (rate limiting)
- Sentence Transformers (semantic injection detection)
- GLiNER (Generalist LLM for high-accuracy PII redaction)

**Frontend:**
- React + Vite
- TailwindCSS
- Real-time analytics dashboard

**Monitoring:**
- Sentry (error tracking)
- Custom analytics

---

## 📊 Performance

| Metric | Value |
|--------|-------|
| **Throughput** | 1,000 req/sec (single instance) |
| **P50 Latency** | 35ms |
| **P95 Latency** | 48ms |
| **PII Accuracy** | 99.2% precision |
| **Injection Detection** | 97.8% recall |

---

## 🧪 Testing

```bash
# Run all tests
cd ai-guardrails
pytest

# Run with coverage
pytest --cov=app tests/

# Run specific test
pytest tests/test_guard.py -v
```

**Test Coverage:** 95% (12/12 tests passing)

---

## 🚢 Deployment

### Deploy to Render (Backend)

1. Create Web Service on [Render](https://render.com)
2. Connect GitHub repository
3. Set environment variables:
   - `DATABASE_URL` - Neon PostgreSQL
   - `REDIS_URL` - Redis Cloud
   - `SENTRY_DSN` - Sentry error tracking
4. Deploy!

**Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Deploy to Vercel (Frontend)

1. Import project on [Vercel](https://vercel.com)
2. Set `VITE_API_URL` to your Render backend URL
3. Deploy!

**See [deployment.md](deployment.md) for detailed instructions.**

---

## 📚 Documentation

- **[API Documentation](http://localhost:8000/docs)** - Auto-generated Swagger UI
- **[Backend Architecture](BACKEND_ARCHITECTURE.md)** - Technical deep-dive
- **[Deployment Guide](deployment.md)** - Production setup

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Code Style:**
- Python: Black formatter (line length: 100)
- JavaScript: Prettier
- Write tests for new features

---

## 🛣️ Roadmap

- ✅ **v1.0:** Prompt injection detection, PII redaction, audit logging
- ✅ **v2.0 (Live):** High-Accuracy GLiNER Engine, Traefik Middleware Support
- 🔮 **Future:** SSO, integrations, enterprise features

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

##  Contact

**Naveenkumar Koppala**
- Email: naveenkumarkoppala@gmail.com
- LinkedIn: [linkedin.com/in/naveenkumarkoppala](https://www.linkedin.com/in/naveenkumarkoppala)
- GitHub: [@koppalanaveenkumar](https://github.com/koppalanaveenkumar)

---

## ⭐ Show Your Support

If you find this project useful, please consider:
- Giving it a ⭐ on GitHub
- Sharing it with your network
- Contributing to the codebase

**Let's make AI safe, compliant, and trustworthy—together.** 🛡️
