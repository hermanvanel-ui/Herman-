# Guide de Déploiement

Ce guide vous aide à déployer le Trade Copier en production.

## ✅ Checklist Pré-Déploiement

### 1. Configuration de Base

- [ ] Python 3.9+ installé
- [ ] MetaTrader 5 installé et fonctionnel
- [ ] Compte Telegram configuré
- [ ] Fichier `.env` créé et rempli
- [ ] Dépendances installées (`pip install -r requirements.txt`)

### 2. Tests Préliminaires

```bash
# Vérifier la configuration
python scripts/check_setup.py

# Tester MT5
python scripts/test_mt5.py

# Si Telethon: authentifier
python scripts/telethon_auth.py

# Lancer tests unitaires
pytest tests/ -v
```

### 3. Test Dry-Run (OBLIGATOIRE)

**⚠️ NE JAMAIS passer directement en LIVE !**

```bash
# Dans .env
DRY_RUN=true

# Lancer
python run.py
```

**Tester pendant au moins 24h:**
- [ ] Telegram se connecte
- [ ] MT5 se connecte
- [ ] Signaux sont parsés correctement
- [ ] Aucune erreur critique dans les logs
- [ ] Dashboard accessible (http://localhost:8000)
- [ ] Pas de duplicates
- [ ] Tous les formats de signaux reconnus

### 4. Configuration Finale

```env
# .env - Vérifier ces paramètres

# Telegram
TELEGRAM_BOT_TOKEN=...     # OU Telethon credentials
TELEGRAM_CHANNEL_ID=...

# MT5
MT5_LOGIN=...
MT5_PASSWORD=...
MT5_SERVER=...

# Trading (CRITIQUE!)
DEFAULT_LOT_SIZE=0.01      # Commencer PETIT
RISK_PERCENTAGE=1.0        # Maximum 1-2%
MAX_SLIPPAGE=10
MAGIC_NUMBER=123456        # Unique pour ce bot

# Symbol mapping
SYMBOL_MAPPING={"GOLD":"XAUUSD","GU":"GBPUSD","EU":"EURUSD"}

# Mode
DRY_RUN=false              # ⚠️ Passer à false pour LIVE
DEBUG=false
```

## 🚀 Déploiement

### Option 1: Local (Machine Windows/Linux)

**Prérequis:**
- MT5 terminal ouvert sur la machine
- Connexion internet stable

**Lancement:**

```bash
# Activer environnement virtuel
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows

# Lancer
python run.py

# Ou avec make
make run
```

**Garder le terminal ouvert** - ne pas fermer !

### Option 2: Serveur Linux (VPS)

**Setup:**

```bash
# Se connecter au VPS
ssh user@your-vps-ip

# Installer Python
sudo apt update
sudo apt install python3.9 python3-pip python3-venv

# Clone projet
git clone <repo-url>
cd Herman-

# Setup
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Configurer
cp .env.example .env
nano .env  # Éditer config
```

**MT5 sur VPS:**

Option A: VPS Windows avec MT5 local
- Installer MT5 sur le VPS
- Suivre procédure normale

Option B: MT5 distant (EA Receiver)
- Installer EA receiver sur MT5 local
- Configurer communication réseau
- Voir `docs/mt5_remote.md` (à créer si besoin)

**Lancer en arrière-plan avec systemd:**

```bash
# Créer service
sudo nano /etc/systemd/system/telegram-mt5.service
```

```ini
[Unit]
Description=Telegram MT5 Trade Copier
After=network.target

[Service]
Type=simple
User=your_user
WorkingDirectory=/home/your_user/Herman-
Environment="PATH=/home/your_user/Herman-/venv/bin"
ExecStart=/home/your_user/Herman-/venv/bin/python run.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
# Activer et démarrer
sudo systemctl enable telegram-mt5
sudo systemctl start telegram-mt5

# Vérifier status
sudo systemctl status telegram-mt5

# Voir logs
sudo journalctl -u telegram-mt5 -f
```

### Option 3: Docker (Avancé)

**Créer Dockerfile:**

```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "run.py"]
```

**Build et run:**

```bash
# Build
docker build -t telegram-mt5 .

# Run
docker run -d \
  --name telegram-mt5 \
  --env-file .env \
  -p 8000:8000 \
  -v $(pwd)/data:/app/data \
  -v $(pwd)/logs:/app/logs \
  telegram-mt5

# Logs
docker logs -f telegram-mt5
```

**Note:** MT5 doit être accessible depuis le container.

## 📊 Monitoring Production

### 1. Dashboard Web

http://your-server:8000

Surveiller:
- ✅ Telegram Connected
- ✅ MT5 Connected
- Taux de réussite > 95%
- Pas d'erreurs critiques

### 2. Logs

```bash
# Temps réel
tail -f logs/app.log

# Erreurs seulement
grep ERROR logs/app.log | tail -20

# Stats journalières
grep "$(date +%Y-%m-%d)" logs/app.log | grep EXECUTED | wc -l
```

### 3. Database

```bash
# Stats
make db-stats

# Trades récents
make db-recent

# SQL direct
sqlite3 data/trades.db
> SELECT * FROM trades WHERE status='FAILED';
```

### 4. Alertes

**Setup alertes Telegram (recommandé):**

Ajouter dans `backend/main.py` pour envoyer notifications:

```python
async def send_alert(message: str):
    """Send alert to admin Telegram."""
    # Implémenter selon besoin
    pass
```

Alerter sur:
- Connexion perdue (Telegram ou MT5)
- Échecs consécutifs > 3
- Balance MT5 sous seuil
- Erreurs critiques

## 🔒 Sécurité Production

### 1. Secrets

```bash
# Ne JAMAIS commit .env
# Utiliser variables d'environnement ou vault

# Exemple: AWS Secrets Manager, Azure Key Vault, etc.
```

### 2. Accès

```bash
# Limiter accès dashboard
# Ajouter authentification dans main.py

# Nginx reverse proxy avec auth basic:
sudo apt install nginx apache2-utils

# Créer password
sudo htpasswd -c /etc/nginx/.htpasswd admin

# Config nginx
sudo nano /etc/nginx/sites-available/telegram-mt5
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        auth_basic "Restricted";
        auth_basic_user_file /etc/nginx/.htpasswd;
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### 3. Firewall

```bash
# UFW (Ubuntu)
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### 4. SSL/HTTPS

```bash
# Certbot (Let's Encrypt)
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 💾 Backup

### Automatique (Cron)

```bash
# Créer script backup
nano /home/user/backup_trades.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/home/user/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
cp /home/user/Herman-/data/trades.db $BACKUP_DIR/trades_$DATE.db

# Garder seulement 30 derniers
cd $BACKUP_DIR
ls -t trades_*.db | tail -n +31 | xargs rm -f
```

```bash
# Rendre exécutable
chmod +x /home/user/backup_trades.sh

# Cron (tous les jours à 2h)
crontab -e
# Ajouter:
0 2 * * * /home/user/backup_trades.sh
```

### Manuel

```bash
make backup
```

## 🔧 Dépannage Production

### Service ne démarre pas

```bash
# Vérifier logs systemd
sudo journalctl -u telegram-mt5 -n 50

# Tester manuellement
source venv/bin/activate
python run.py
```

### MT5 déconnecté

```bash
# Vérifier MT5 ouvert
# Vérifier credentials dans .env
# Tester:
python scripts/test_mt5.py
```

### Telegram déconnecté

```bash
# Bot: vérifier token valide
# Telethon: ré-authentifier
python scripts/telethon_auth.py
```

### Performance lente

```bash
# Vérifier ressources
htop

# Logs verbeux?
# Dans .env: LOG_LEVEL=WARNING (au lieu de INFO)

# Nettoyer vieux logs
find logs/ -name "*.log" -mtime +30 -delete
```

## 📈 Scaling

### Plusieurs Canaux

Modifier `backend/main.py` pour supporter plusieurs instances:

```python
channels = [
    {"id": "@channel1", "config": config1},
    {"id": "@channel2", "config": config2},
]

for channel in channels:
    copier = TradeCopier(channel["config"])
    await copier.start()
```

### Load Balancing

Pour haute disponibilité:
- Dupliquer setup sur 2+ serveurs
- Utiliser même database (PostgreSQL distant)
- Load balancer devant (nginx, HAProxy)

## 🆘 Support

En cas de problème:

1. Consulter logs: `tail -f logs/app.log`
2. Vérifier dashboard
3. Tester composants individuellement
4. Consulter CONTRIBUTING.md
5. Ouvrir issue GitHub

---

**⚠️ RAPPEL:** Trading = risque. Toujours commencer petit (0.01 lots), tester exhaustivement, et surveiller activement.
