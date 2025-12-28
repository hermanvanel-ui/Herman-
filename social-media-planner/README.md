# 📅 Planning de Publication - Réseaux Sociaux

Application web locale pour générer automatiquement des plannings de publication optimisés pour Instagram, TikTok, X (Twitter) et Threads.

## 🎯 Fonctionnalités

✅ **Interface intuitive** avec drag & drop
✅ **Génération automatique** via IA (Claude Sonnet 4)
✅ **Planning sur 7 jours** avec posts et stories
✅ **Multi-plateformes** : Instagram, TikTok, X, Threads
✅ **Export CSV** compatible Metricool
✅ **Statistiques détaillées** par plateforme
✅ **Descriptions optimisées** adaptées à chaque réseau social
✅ **Aucune installation requise** - fonctionne hors ligne après génération

## 📦 Installation

**C'est simple : aucune installation nécessaire !**

1. Téléchargez le dossier `social-media-planner`
2. Double-cliquez sur `index.html`
3. L'application s'ouvre dans votre navigateur

**Pré-requis :**
- Navigateur web moderne (Chrome, Firefox, Safari, Edge)
- Clé API Anthropic Claude ([Obtenez-en une ici](https://console.anthropic.com/))

## 🚀 Utilisation

### Étape 1 : Sélectionner vos fichiers

- **Glissez-déposez** vos photos et vidéos dans la zone prévue
- Ou **cliquez** sur la zone pour ouvrir le sélecteur de fichiers
- Seuls les fichiers images (JPG, PNG, etc.) et vidéos (MP4, MOV, etc.) sont acceptés

### Étape 2 : Générer le planning

1. Cliquez sur le bouton **"🎯 Générer le Planning"**
2. Entrez votre **clé API Anthropic Claude** quand demandé
3. Attendez quelques secondes (génération via IA)
4. Le planning s'affiche automatiquement !

### Étape 3 : Consulter les résultats

Le planning généré comprend :

- **Statistiques** : nombre total de publications, posts, stories, répartition par plateforme
- **Tableau détaillé** avec :
  - Jour et heure de publication
  - Plateforme cible
  - Fichier à publier
  - Type (Post ou Story)
  - Description optimisée
  - Hashtags pertinents
  - Commentaire engageant

### Étape 4 : Exporter en CSV

1. Cliquez sur **"📥 Exporter en CSV"**
2. Le fichier `planning-reseaux-sociaux-AAAA-MM-JJ.csv` se télécharge
3. Importez-le dans votre outil de planification (Metricool, Buffer, etc.)

## 📊 Format de l'Export CSV

Le CSV généré contient les colonnes suivantes :

| Colonne | Description |
|---------|-------------|
| **Jour** | Jour de la semaine et date (ex: "Lundi 30/12") |
| **Heure** | Heure de publication (ex: "10:30") |
| **Plateforme** | Instagram, TikTok, X ou Threads |
| **Fichier** | Nom du fichier à publier |
| **Type** | Post ou Story |
| **Description** | Texte de la publication optimisé |
| **Hashtags** | Hashtags pertinents séparés par des espaces |
| **Commentaire** | Commentaire engageant pour l'interaction |

**Compatible avec :** Metricool, Buffer, Hootsuite, Later, et autres outils de planification acceptant le format CSV.

## 🎨 Caractéristiques du Planning

### Répartition
- **7 jours** de contenu
- **3-4 posts** par jour
- **2 stories lifestyle** par jour (11h et 17h)
- **4 plateformes** : Instagram, TikTok, X, Threads

### Horaires optimisés
- 09:00 - Réveil et premiers scrolls
- 10:30 - Pause matinée
- 14:00 - Début d'après-midi
- 15:30 - Pause café
- 19:00 - Fin de journée
- 20:30 - Prime time soirée

### Ton et style
- **Instagram** : Esthétique et léger (150-200 caractères, 15-20 hashtags)
- **TikTok** : Dynamique et accrocheur (80-120 caractères, 5-8 hashtags)
- **X** : Direct et conversationnel (200-240 caractères, 2-4 hashtags)
- **Threads** : Authentique et personnel (300-400 caractères, 3-5 hashtags)

### Règles intelligentes
- ✅ Un fichier **peut** être publié sur plusieurs plateformes **différentes**
- ❌ Un fichier **ne peut jamais** être publié 2× sur la **même plateforme**
- ✅ Descriptions cohérentes avec le type de média (photo/vidéo)
- ✅ Commentaires engageants pour maximiser l'interaction

## 🔧 Dépannage

### L'application ne s'ouvre pas
- Assurez-vous d'avoir un navigateur web moderne installé
- Essayez de faire clic droit > Ouvrir avec > [Votre navigateur]

### Les fichiers ne sont pas acceptés
- Vérifiez que vos fichiers sont bien des **images** (JPG, PNG, GIF) ou **vidéos** (MP4, MOV, AVI)
- Certains formats exotiques peuvent ne pas être reconnus

### Erreur "Clé API requise"
1. Obtenez une clé API sur [console.anthropic.com](https://console.anthropic.com/)
2. Créez un compte si nécessaire (gratuit avec crédits d'essai)
3. Copiez votre clé API (commence par `sk-ant-`)
4. Collez-la quand l'application la demande

### Erreur API Claude
- **Quota dépassé** : Vérifiez vos crédits sur console.anthropic.com
- **Clé invalide** : Régénérez votre clé API
- **Erreur réseau** : Vérifiez votre connexion Internet (requise pour la génération uniquement)

### Le planning est vide ou incomplet
- Vérifiez que vous avez sélectionné au moins 3-4 fichiers
- Réessayez la génération (l'IA peut parfois avoir des réponses variables)
- Consultez la console du navigateur (F12) pour plus de détails

### L'export CSV ne fonctionne pas
- Autorisez les téléchargements dans votre navigateur
- Vérifiez que vous avez bien généré un planning avant d'exporter
- Essayez avec un autre navigateur

## 💡 Conseils d'utilisation

### Pour de meilleurs résultats
1. **Variez vos contenus** : Mélangez photos et vidéos
2. **Nommez vos fichiers clairement** : `photo-plage.jpg`, `video-danse.mp4`
3. **Préparez 15-20 fichiers** pour une semaine complète
4. **Vérifiez le planning** avant de l'importer dans votre outil
5. **Adaptez si nécessaire** : Le planning est une base, personnalisez-le selon vos besoins

### Utilisation avec Metricool
1. Exportez le CSV depuis l'application
2. Ouvrez Metricool > Planning > Importer
3. Sélectionnez votre fichier CSV
4. Mappez les colonnes (normalement détecté automatiquement)
5. Importez vos médias correspondants
6. Validez et publiez !

## 🔒 Confidentialité et sécurité

- ✅ **Application 100% locale** : vos fichiers ne quittent jamais votre ordinateur
- ✅ **Aucune collecte de données** : aucune télémétrie, aucun tracking
- ✅ **Clé API non stockée** : saisie à chaque utilisation (jamais sauvegardée)
- ⚠️ **Connexion requise** : uniquement lors de la génération (appel API Claude)

## 🆘 Support

### Problèmes techniques
- Ouvrez la console du navigateur (F12) et consultez les erreurs
- Vérifiez que vous utilisez la dernière version du navigateur
- Essayez de vider le cache (Ctrl+Shift+R ou Cmd+Shift+R)

### Questions et suggestions
Pour toute question, amélioration ou bug à signaler :
- 📧 Email : support@example.com
- 💬 GitHub Issues : [Créer une issue](https://github.com/votre-repo)

## 📄 Licence

Ce projet est fourni tel quel, sans garantie. Libre d'utilisation pour un usage personnel et commercial.

---

**Développé avec ❤️ pour simplifier la gestion de contenu sur les réseaux sociaux**

🚀 **Bon planning et belles publications !**
