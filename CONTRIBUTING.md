# Contributing to Telegram MT5 Trade Copier

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## Getting Started

1. Fork the repository
2. Clone your fork
3. Create a branch for your feature/fix
4. Make your changes
5. Test thoroughly
6. Submit a pull request

## Development Setup

```bash
# Clone
git clone <your-fork-url>
cd telegram-mt5-copier

# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Install dev dependencies
pip install pytest pytest-asyncio pytest-cov black flake8

# Setup environment
cp .env.example .env
# Edit .env with test credentials
```

## Code Style

We follow PEP 8 with some modifications:

- Line length: 100 characters (not 79)
- Use Black for formatting
- Use type hints where possible

```bash
# Format code
black backend/ tests/

# Check style
flake8 backend/ tests/ --max-line-length=100
```

## Testing

### Run Tests

```bash
# All tests
pytest tests/ -v

# Specific test
pytest tests/test_parser.py -v

# With coverage
pytest tests/ --cov=backend --cov-report=html
```

### Write Tests

When adding new features:

1. Add tests in `tests/`
2. Test both success and failure cases
3. Test edge cases
4. Ensure coverage > 80%

Example:

```python
def test_new_feature():
    """Test description."""
    # Setup
    parser = SignalParser()

    # Execute
    result = parser.parse(1, "BUY XAUUSD @ 2050")

    # Assert
    assert result is not None
    assert result.symbol == "XAUUSD"
```

## Adding New Features

### New Signal Format

1. **Update parser** (`backend/signal_parser.py`):
```python
def _parse_new_format(self, text: str) -> Optional[ParsedSignal]:
    # Implementation
    pass
```

2. **Add test** (`tests/test_parser.py`):
```python
def test_new_format(self):
    signal = self.parser.parse(1, "NEW FORMAT EXAMPLE")
    assert signal is not None
```

3. **Add example** (`tests/signals_samples.txt`):
```
# Format X: Description
NEW FORMAT EXAMPLE
```

### New Action Type

1. **Update models** (`backend/models.py`):
```python
class SignalAction(str, Enum):
    # ...
    NEW_ACTION = "NEW_ACTION"
```

2. **Update parser** (`backend/signal_parser.py`):
```python
def _detect_action(self, text: str) -> Optional[SignalAction]:
    if self.new_action_pattern.search(text):
        return SignalAction.NEW_ACTION
```

3. **Update handler** (`backend/main.py`):
```python
elif signal.action == SignalAction.NEW_ACTION:
    await self._execute_new_action(signal, record_id)
```

4. **Add tests**

## Pull Request Process

1. **Branch naming**:
   - Feature: `feature/description`
   - Bug fix: `fix/description`
   - Docs: `docs/description`

2. **Commit messages**:
   - Use present tense ("Add feature" not "Added feature")
   - First line: summary (50 chars max)
   - Blank line
   - Detailed description if needed

   Example:
   ```
   Add support for limit orders

   - Parse limit order syntax from signals
   - Add limit order execution to MT5 bridge
   - Add tests for limit order parsing
   ```

3. **Before submitting**:
   - [ ] Tests pass (`pytest tests/`)
   - [ ] Code is formatted (`black backend/ tests/`)
   - [ ] No linting errors (`flake8`)
   - [ ] Documentation updated (README, docstrings)
   - [ ] CHANGELOG.md updated

4. **PR description**:
   - What does this PR do?
   - Why is this change needed?
   - How has it been tested?
   - Screenshots (if UI changes)

## Code Review

All PRs require review before merging. Reviewers will check:

- Code quality and style
- Test coverage
- Documentation
- Performance impact
- Security implications
- Breaking changes

## Security

If you discover a security vulnerability:

1. **DO NOT** open a public issue
2. Email: [security contact]
3. Include:
   - Description of vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

## Documentation

Update documentation when:

- Adding new features
- Changing existing behavior
- Fixing bugs that weren't clear from docs

Documentation locations:

- `README.md`: User-facing documentation
- Code docstrings: Developer documentation
- `docs/`: Additional documentation (if needed)

## Testing Checklist

Before submitting PR:

- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] Dry-run mode tested
- [ ] Parser handles new formats
- [ ] Error cases handled
- [ ] Logs are meaningful
- [ ] No secrets in code
- [ ] Database migrations (if needed)

## Questions?

- Open a discussion in Issues
- Tag with `question` label

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🎉
