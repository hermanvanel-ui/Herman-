# Telegram → MetaTrader 5 Trade Copier

[![Python 3.9+](https://img.shields.io/badge/python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Un système robuste et sécurisé pour copier automatiquement les signaux de trading depuis un canal Telegram privé vers MetaTrader 5.

## 🎯 Fonctionnalités

### ✅ Implémenté
- ✅ **Monitoring Telegram** : Support Bot API + Telethon (fallback pour canaux privés)
- ✅ **Parsing Multi-formats** : Reconnaît 20+ formats de signaux différents
- ✅ **Exécution MT5** : Connexion directe via Python MetaTrader5
- ✅ **Anti-doublon** : Base SQLite avec hash pour éviter les trades dupliqués
- ✅ **Mode Dry-Run** : Test sans risque avant production
- ✅ **Panel UI** : Dashboard web temps réel avec WebSocket
- ✅ **Logs structurés** : Traçabilité complète
- ✅ **Gestion d'erreurs** : Reconnexion auto, rate limiting
- ✅ **Multi-actions** : OPEN, CLOSE, PARTIAL_CLOSE, MOVE_SL_TO_BE

### 📊 Panel UI Features
- Statut Telegram et MT5 en temps réel
- Derniers trades exécutés
- Positions ouvertes
- Statistiques (total signaux, exécutés, échecs, taux de réussite)
- Erreurs récentes
- Mise à jour automatique via WebSocket

## 🏗️ Architecture

```
telegram-mt5-copier/
├── backend/
│   ├── main.py              # FastAPI server + orchestration
│   ├── telegram_client.py   # Bot + Telethon monitor
│   ├── signal_parser.py     # Multi-format parser
│   ├── mt5_bridge.py        # MT5 execution bridge
│   ├── database.py          # SQLite anti-duplicate
│   ├── config.py            # Configuration management
│   └── models.py            # Data models (Pydantic)
├── frontend/
│   ├── index.html           # UI panel
│   └── static/
│       ├── styles.css       # Styling
│       └── app.js           # WebSocket + updates
├── tests/
│   ├── test_parser.py       # Parser unit tests
│   └── signals_samples.txt  # Test signals (20+ formats)
├── data/
│   └── trades.db            # SQLite database
├── logs/
│   └── app.log              # Application logs
├── .env                     # Configuration (credentials)
├── requirements.txt         # Python dependencies
└── run.py                   # Entry point
```

## 🚀 Installation

### Prérequis

1. **Python 3.9+**
2. **MetaTrader 5** installé sur la même machine (ou accessible)
3. **Compte Telegram** + accès au canal privé

### Étapes

1. **Clone le repo**
```bash
git clone <repo-url>
cd Herman-
```

2. **Créer environnement virtuel**
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows
```

3. **Installer dépendances**
```bash
pip install -r requirements.txt
```

4. **Configuration**

Copier `.env.example` vers `.env` et remplir:

```bash
cp .env.example .env
nano .env  # ou votre éditeur préféré
```

#### Configuration minimale (.env)

```env
# TELEGRAM - Option 1: Bot (recommandé)
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHANNEL_ID=@your_channel_or_chat_id
USE_TELEGRAM_BOT=true

# TELEGRAM - Option 2: Telethon (si bot impossible)
# TELEGRAM_API_ID=12345678
# TELEGRAM_API_HASH=abcdef1234567890abcdef1234567890
# TELEGRAM_PHONE=+33612345678
# USE_TELEGRAM_BOT=false

# MT5
MT5_LOGIN=12345678
MT5_PASSWORD=your_mt5_password
MT5_SERVER=YourBroker-Demo

# Trading
DEFAULT_LOT_SIZE=0.01
MAGIC_NUMBER=123456

# Symbol mapping (optionnel)
SYMBOL_MAPPING={"GOLD":"XAUUSD","GU":"GBPUSD","EU":"EURUSD"}

# Mode
DRY_RUN=true  # Mettre false pour LIVE
```

### Configuration Telegram

#### Option 1: Bot Telegram (Recommandé)

1. Créer un bot via [@BotFather](https://t.me/BotFather)
2. Récupérer le token
3. Ajouter le bot au canal comme **administrateur**
4. Mettre `USE_TELEGRAM_BOT=true`

#### Option 2: Telethon (Fallback)

Pour canaux privés où bot impossible:

1. Obtenir API ID/Hash: https://my.telegram.org/apps
2. Première authentification:
```bash
python scripts/telethon_auth.py
```
3. Suivre les instructions (code SMS + 2FA si activé)

### Configuration MT5

1. Ouvrir MetaTrader 5
2. Aller dans **Outils → Options → Expert Advisors**
3. Cocher:
   - ✅ Autoriser le trading automatique
   - ✅ Autoriser les imports DLL
   - ✅ Autoriser l'import de signaux extérieurs

## 📖 Utilisation

### 1. Mode Dry-Run (Test)

**TOUJOURS commencer en dry-run !**

```bash
# Dans .env
DRY_RUN=true

# Lancer
python run.py
```

Ouvrir: http://localhost:8000

Le système va:
- Se connecter à Telegram et MT5
- Parser les signaux
- **Simuler** les trades (sans les exécuter)
- Logger toutes les actions

### 2. Tests

```bash
# Tester le parser
pytest tests/test_parser.py -v

# Tester tous les formats
python -c "
from backend.signal_parser import SignalParser
parser = SignalParser()

with open('tests/signals_samples.txt', 'r') as f:
    for line in f:
        if line.strip() and not line.startswith('#'):
            signal = parser.parse(1, line)
            if signal:
                print(f'✅ {signal.action} {signal.symbol}')
"
```

### 3. Mode Production (LIVE)

⚠️ **ATTENTION: Argent réel !**

```bash
# Dans .env
DRY_RUN=false

# Vérifier config
cat .env

# Lancer
python run.py
```

### 4. Surveillance

- **Panel UI**: http://localhost:8000
- **Logs**: `tail -f logs/app.log`
- **Database**: `sqlite3 data/trades.db "SELECT * FROM trades ORDER BY timestamp DESC LIMIT 10;"`

## 📝 Formats de Signaux Supportés

Le parser reconnaît automatiquement:

```
# Standard
BUY XAUUSD @ 2054 SL 2046 TP 2070
SELL EURUSD @ 1.0900 SL 1.0930 TP 1.0870

# Sans prix d'entrée (market)
BUY BTCUSD SL 42000 TP 48000

# Plusieurs TPs
SELL EURUSD @ 1.0900 SL 1.0930 TP1 1.0870 TP2 1.0850 TP3 1.0820

# Range
XAUUSD BUY 2050-2052 SL 2044 TP 2060

# Shortcuts
GU BUY @ 1.2680 SL: 1.2650 TP: 1.2730

# Close
CLOSE XAUUSD
Close 50% EURUSD

# Move SL
Move SL to BE GBPUSD
XAUUSD move stop loss to entry

# Avec texte additionnel
🔥 SIGNAL ALERT 🔥
BUY EURUSD @ 1.0850
SL: 1.0820
TP: 1.0900
Good luck!
```

Voir `tests/signals_samples.txt` pour 20+ exemples.

## 🔧 Dépannage

### MT5 ne se connecte pas

1. Vérifier que MT5 est ouvert
2. Vérifier login/password/server
3. Tester manuellement:
```python
import MetaTrader5 as mt5
mt5.initialize()
mt5.login(login=12345678, password="pass", server="Demo")
print(mt5.account_info())
```

### Telegram ne reçoit pas de messages

**Bot mode:**
- Vérifier que le bot est admin du canal
- Tester: envoyer message dans le canal

**Telethon mode:**
- Vérifier authentification: `ls telegram_session.session`
- Re-authentifier si nécessaire

### Signal non parsé

1. Vérifier format dans `tests/signals_samples.txt`
2. Tester:
```python
from backend.signal_parser import SignalParser
parser = SignalParser()
signal = parser.parse(1, "VOTRE MESSAGE")
print(signal)
```

### Trades dupliqués

❌ Ne devrait JAMAIS arriver (anti-doublon par hash).

Si ça arrive:
```sql
sqlite3 data/trades.db
SELECT message_hash, COUNT(*) FROM trades GROUP BY message_hash HAVING COUNT(*) > 1;
```

Vérifier logs pour comprendre pourquoi.

## 🔒 Sécurité

### ✅ Implémenté

- ✅ Secrets dans `.env` (gitignore)
- ✅ Pas de logs de credentials
- ✅ Validation inputs (symbols, volumes)
- ✅ Anti-doublon strict
- ✅ Slippage max configurable
- ✅ Magic number pour isolation

### ⚠️ Recommandations

1. **Ne JAMAIS commit .env**
2. **Tester en dry-run d'abord**
3. **Commencer avec petits lots** (0.01)
4. **Monitorer régulièrement**
5. **Backup database**: `cp data/trades.db data/trades.db.backup`

## 📊 API Endpoints

### GET /api/status
Statut système (Telegram, MT5, stats)

### GET /api/trades?limit=100
Derniers trades

### GET /api/positions
Positions ouvertes MT5

### WebSocket /ws
Updates temps réel

## 🧪 Tests Unitaires

```bash
# Tous les tests
pytest tests/ -v

# Couverture
pytest tests/ --cov=backend --cov-report=html

# Test parser seulement
pytest tests/test_parser.py -v
```

## 📈 Monitoring Production

### Logs

```bash
# Temps réel
tail -f logs/app.log

# Erreurs seulement
grep ERROR logs/app.log

# Dernières 100 lignes
tail -100 logs/app.log
```

### Database

```bash
sqlite3 data/trades.db

# Stats
SELECT status, COUNT(*) FROM trades GROUP BY status;

# Derniers trades
SELECT timestamp, action, symbol, direction, status
FROM trades
ORDER BY timestamp DESC
LIMIT 10;

# Trades aujourd'hui
SELECT * FROM trades
WHERE DATE(timestamp) = DATE('now');
```

## 🔄 Mise à jour

```bash
git pull
pip install -r requirements.txt --upgrade
```

## 🛠️ Développement

### Ajouter un nouveau format de signal

1. Éditer `backend/signal_parser.py`
2. Ajouter pattern regex
3. Ajouter test dans `tests/test_parser.py`
4. Tester: `pytest tests/test_parser.py -v`

### Ajouter une action

1. Éditer `backend/models.py` → `SignalAction`
2. Implémenter dans `backend/signal_parser.py`
3. Ajouter handler dans `backend/main.py`
4. Ajouter test

## 📋 Checklist Production

Avant de passer en LIVE:

- [ ] Tests réussis en dry-run pendant 24h+
- [ ] Parser reconnaît tous les formats du canal
- [ ] MT5 connecté et stable
- [ ] Telegram reçoit les messages
- [ ] Anti-doublon vérifié (pas de duplicates)
- [ ] Logs propres (pas d'erreurs critiques)
- [ ] Backup .env et database
- [ ] Lots configurés correctement
- [ ] Magic number unique
- [ ] Slippage raisonnable (10-20 points)
- [ ] Monitoring en place

## 🆘 Support

### Logs utiles

```bash
# Dernière erreur
grep ERROR logs/app.log | tail -1

# Stats rapides
sqlite3 data/trades.db "SELECT COUNT(*) as total,
    SUM(CASE WHEN status='EXECUTED' THEN 1 ELSE 0 END) as executed,
    SUM(CASE WHEN status='FAILED' THEN 1 ELSE 0 END) as failed
FROM trades;"
```

### Redémarrage propre

```bash
# Arrêter (Ctrl+C)
# Vérifier que MT5 est toujours ouvert
# Relancer
python run.py
```

## 📄 Licence

MIT License - Voir LICENSE file

## 🙏 Contribution

PRs welcome! Voir CONTRIBUTING.md

---

**⚠️ DISCLAIMER**: Trading comporte des risques. Ce logiciel est fourni "AS IS" sans garantie. Testez exhaustivement en dry-run avant utilisation réelle. Les auteurs ne sont pas responsables des pertes.
