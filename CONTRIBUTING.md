# Contributing to AI Guardrails

Thank you for your interest in contributing to AI Guardrails! We welcome contributions from the community.

## 🤝 How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Python version, etc.)

### Suggesting Features

Feature requests are welcome! Please:
- Check existing issues first
- Describe the use case
- Explain why it would benefit users

### Submitting Code

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Write tests** for new functionality
5. **Run tests** to ensure nothing breaks
   ```bash
   pytest
   ```
6. **Commit with clear messages**
   ```bash
   git commit -m "Add feature: your feature description"
   ```
7. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
8. **Open a Pull Request**

## 📝 Code Style

### Python (Backend)
- **Formatter:** Black (line length: 100)
- **Linter:** Flake8
- **Type hints:** Required for all functions
- **Docstrings:** Google style

```python
def example_function(param: str) -> bool:
    """
    Brief description.

    Args:
        param: Description of parameter

    Returns:
        Description of return value
    """
    return True
```

### JavaScript (Frontend)
- **Formatter:** Prettier
- **Style:** ESLint (Airbnb config)
- **Components:** Functional components with hooks

## 🧪 Testing

### Backend Tests
```bash
cd ai-guardrails
pytest tests/ -v
```

### Coverage Requirements
- Minimum: 80% coverage
- New features must include tests
- Bug fixes should include regression tests

### Test Structure
```python
def test_feature_name():
    # Arrange
    input_data = "test"
    
    # Act
    result = function_to_test(input_data)
    
    # Assert
    assert result == expected_output
```

## 🏗️ Development Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL
- Redis

### Local Environment
```bash
# Backend
cd ai-guardrails
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
pip install -r requirements-dev.txt  # Development dependencies

# Frontend
cd frontend
npm install
```

### Running Locally
```bash
# Terminal 1: Backend
uvicorn app.main:app --reload

# Terminal 2: Frontend
npm run dev
```

## 📋 Pull Request Checklist

Before submitting a PR, ensure:
- [ ] Code follows style guidelines
- [ ] Tests pass (`pytest`)
- [ ] New features have tests
- [ ] Documentation updated (if needed)
- [ ] Commit messages are clear
- [ ] PR description explains changes

## 🎯 Areas for Contribution

### High Priority
- **New Guardrails:** Add detection for new attack vectors
- **Performance:** Optimize latency and throughput
- **Documentation:** Improve guides and examples

### Good First Issues
- **Bug fixes:** Check issues labeled `good-first-issue`
- **Tests:** Increase coverage
- **UI improvements:** Dashboard enhancements

### Advanced
- **ML Models:** Custom models for specific industries
- **Integrations:** Zapier, webhooks, etc.
- **Scalability:** Distributed processing

## 🔒 Security

If you discover a security vulnerability:
1. **DO NOT** open a public issue
2. Email: naveenkumarkoppala@gmail.com
3. Include details and reproduction steps
4. We'll respond within 48 hours

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 💬 Questions?

- **GitHub Discussions:** Ask questions
- **Discord:** [Join our community](https://discord.gg/your-invite)
- **Email:** naveenkumarkoppala@gmail.com

## 🙏 Recognition

Contributors will be:
- Listed in README.md
- Mentioned in release notes
- Invited to contributor calls (if interested)

Thank you for making AI Guardrails better! 🚀
