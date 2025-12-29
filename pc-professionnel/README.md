# 🖥️ PC Professionnel - Site de Justification

Site web one-page professionnel pour expliquer la justification d'achat d'un PC fixe de développement.

## 📋 Contenu du projet

- **index.html** : Page HTML complète avec toutes les sections
- **styles.css** : Styles modernes, responsives et sobres
- **script.js** : Interactivité (slider, formulaire, smooth scroll)
- **netlify.toml** : Configuration Netlify
- **README.md** : Ce fichier d'instructions

## 🚀 Déploiement rapide sur Netlify

### Option 1 : Drag & Drop (Le plus simple)

1. **Créer un compte Netlify** (gratuit)
   - Aller sur [netlify.com](https://netlify.com)
   - Cliquer sur "Sign up" (ou utiliser votre compte GitHub)

2. **Déployer le site**
   - Une fois connecté, cliquer sur **"Add new site"** → **"Deploy manually"**
   - Glisser-déposer le dossier `pc-professionnel` complet dans la zone
   - Attendre 30 secondes ⏱️

3. **Votre site est en ligne !** 🎉
   - URL générée automatiquement : `https://random-name-123.netlify.app`
   - Vous pouvez personnaliser le nom dans **Site settings → Domain management → Custom domains**

### Option 2 : Via Git (Recommandé pour des mises à jour futures)

1. **Créer un dépôt GitHub**
   ```bash
   cd pc-professionnel
   git init
   git add .
   git commit -m "Initial commit - Site PC Professionnel"
   git branch -M main
   git remote add origin https://github.com/VOTRE-USERNAME/pc-professionnel.git
   git push -u origin main
   ```

2. **Connecter Netlify à GitHub**
   - Sur Netlify : **Add new site** → **Import an existing project**
   - Choisir **GitHub** et autoriser l'accès
   - Sélectionner le dépôt `pc-professionnel`
   - Build settings :
     - **Build command** : (laisser vide)
     - **Publish directory** : `.` (racine)
   - Cliquer sur **Deploy**

3. **Avantage** : Chaque push sur GitHub mettra automatiquement à jour le site

## 📧 Configuration des notifications email

Pour recevoir les soumissions du formulaire par email :

1. **Aller dans le dashboard Netlify**
   - Sélectionner votre site

2. **Activer les notifications**
   - **Settings** → **Forms** → **Form notifications**
   - Cliquer sur **Add notification** → **Email notification**
   - Choisir le formulaire : `participation-pc`
   - Entrer votre adresse email
   - Sauvegarder

3. **Test** : Remplir le formulaire sur le site
   - Vérifier que vous recevez l'email de notification
   - Les soumissions sont aussi visibles dans **Forms** du dashboard

## 🧪 Test en local (avant déploiement)

### Méthode 1 : Ouverture directe
```bash
# Ouvrir simplement index.html dans votre navigateur
open index.html  # macOS
xdg-open index.html  # Linux
start index.html  # Windows
```

⚠️ **Note** : Le formulaire Netlify Forms ne fonctionnera pas en local, seulement une fois déployé sur Netlify.

### Méthode 2 : Serveur local (recommandé)
```bash
# Avec Python 3
python3 -m http.server 8000

# Avec Node.js (si npx est installé)
npx serve .

# Avec PHP
php -S localhost:8000
```

Puis ouvrir : [http://localhost:8000](http://localhost:8000)

## 📱 Test responsive

Le site est optimisé mobile-first. Pour tester :

1. **Navigateur**
   - Ouvrir les DevTools (F12)
   - Toggle device toolbar (Ctrl+Shift+M ou Cmd+Shift+M)
   - Tester différentes résolutions : iPhone, iPad, Desktop

2. **Breakpoints utilisés**
   - Mobile : < 640px
   - Tablet : 640px - 768px
   - Desktop : > 768px

## 🎨 Personnalisation

### Changer les couleurs

Modifier les variables CSS dans `styles.css` :

```css
:root {
    --color-primary: #3B82F6;  /* Bleu principal */
    --color-primary-dark: #2563EB;  /* Bleu foncé */
    /* ... autres variables ... */
}
```

### Modifier le contenu

Éditer directement `index.html` pour changer :
- Les textes
- Les sections
- Les montants
- Les tableaux

### Ajouter une image de devis

1. Ajouter l'image dans le dossier : `devis.pdf` ou `devis.jpg`
2. Modifier le lien dans `index.html` (section Budget) :

```html
<a href="devis.pdf" class="btn-secondary" target="_blank">📄 Voir le devis détaillé</a>
```

## 🔒 Sécurité

Le site inclut des en-têtes de sécurité (configurés dans `netlify.toml`) :
- Protection XSS
- Protection contre le clickjacking
- Content Type sniffing désactivé

## 📊 Analytics (optionnel)

Pour suivre les visites, ajouter Google Analytics ou Netlify Analytics :

### Netlify Analytics (payant mais simple)
- Dans le dashboard : **Analytics** → **Enable Analytics**

### Google Analytics (gratuit)
- Créer une propriété sur [analytics.google.com](https://analytics.google.com)
- Copier le code de tracking
- Ajouter avant `</head>` dans `index.html`

## 🐛 Dépannage

### Le formulaire ne fonctionne pas
- ✅ Vérifier que l'attribut `data-netlify="true"` est présent dans `<form>`
- ✅ Vérifier que le champ `<input type="hidden" name="form-name" value="participation-pc" />` est présent
- ✅ Le site doit être déployé sur Netlify (ne fonctionne pas en local)

### Les styles ne s'appliquent pas
- ✅ Vérifier que `styles.css` et `script.js` sont bien dans le même dossier que `index.html`
- ✅ Vider le cache du navigateur (Ctrl+Shift+R ou Cmd+Shift+R)

### Le slider ne bouge pas
- ✅ Vérifier que `script.js` est bien chargé (regarder la console : F12)
- ✅ Vérifier qu'il n'y a pas d'erreurs JavaScript dans la console

## 📞 Partager le lien

Une fois déployé, copier l'URL et l'envoyer à vos parents via :
- 📱 WhatsApp
- 📧 Email
- 💬 SMS

### Exemple de message

```
Salut Papa/Maman,

J'ai créé un site pour vous expliquer pourquoi j'ai besoin d'un PC fixe pour mon travail de développeur.
Tout est expliqué de manière claire et transparente.

👉 https://votre-site.netlify.app

N'hésitez pas à me dire si vous avez des questions !
```

## 🎯 Checklist avant partage

- [ ] Site déployé sur Netlify
- [ ] Formulaire testé (soumission fonctionnelle)
- [ ] Notifications email configurées
- [ ] Responsive testé sur mobile/tablette/desktop
- [ ] Contenu relu (fautes d'orthographe, montants corrects)
- [ ] URL personnalisée (optionnel mais recommandé)

## 📝 Licence

Ce projet est à usage personnel. Libre d'utilisation et de modification pour vos besoins.

---

**Créé avec soin et professionnalisme** ✨
