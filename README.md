# Tarandro.org - Accompagnement Qualité & Formation Professionnelle

Site web professionnel développé avec Next.js 14, TypeScript et Tailwind CSS.

## 🚀 Fonctionnalités

- ✅ Site vitrine moderne et responsive
- ✅ 5 pages de services détaillées (ISO, HAS, PSAD, Bureautique, SST)
- ✅ Formulaire de contact fonctionnel avec API
- ✅ Blog avec gestion admin protégée
- ✅ Authentification NextAuth.js pour l'administration
- ✅ SEO optimisé (sitemap, robots.txt, metadata)
- ✅ Animations et design moderne (glassmorphism, gradients)
- ✅ Mentions légales et conformité RGPD
- ✅ PWA ready avec manifest et favicons

## 📋 Prérequis

- Node.js 18+ 
- npm ou yarn

## 🛠️ Installation

```bash
# Cloner le repository
git clone https://github.com/votre-username/tarandro.org.git
cd tarandro.org

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env.local

# Configurer les variables d'environnement (voir section ci-dessous)
```

## ⚙️ Configuration

Créer un fichier `.env.local` à la racine du projet :

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-generate-with-openssl
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=your-hashed-password

# Email Configuration (optionnel)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@tarandro.org
```

### Générer une clé secrète NextAuth

```bash
openssl rand -base64 32
```

### Générer un hash de mot de passe

```bash
node -e "console.log(require('bcryptjs').hashSync('votre-mot-de-passe', 10))"
```

## 🏃 Développement

```bash
# Lancer le serveur de développement
npm run dev

# Le site sera accessible sur http://localhost:3000
```

## 🔐 Accès Admin

En développement, accédez à l'interface d'administration :
- URL : `http://localhost:3000/admin/login`
- Identifiants par défaut : **admin / admin123**

⚠️ **Important** : Changez ces identifiants en production !

## 📦 Build Production

```bash
# Créer le build de production
npm run build

# Tester le build en local
npm start
```

## 🌐 Déploiement

Voir le fichier [DEPLOYMENT.md](./DEPLOYMENT.md) pour le guide complet de déploiement sur Vercel.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/votre-username/tarandro.org)

## 📁 Structure du projet

```
tarandro.org/
├── src/
│   ├── app/                    # Pages Next.js App Router
│   │   ├── page.tsx           # Page d'accueil
│   │   ├── layout.tsx         # Layout principal
│   │   ├── services/          # Pages services
│   │   ├── blog/              # Blog public
│   │   ├── admin/             # Interface admin
│   │   │   ├── login/         # Page de connexion
│   │   │   └── blog/          # Gestion du blog
│   │   └── api/               # API Routes
│   │       ├── auth/          # NextAuth
│   │       └── contact/       # Formulaire contact
│   ├── components/            # Composants React
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   └── ...
│   └── middleware.ts          # Protection routes admin
├── public/
│   ├── logo.svg              # Logo principal
│   ├── icon.svg              # Icône
│   └── images/               # Images du site
├── .env.local                # Variables d'environnement (local)
├── next.config.mjs           # Configuration Next.js
└── tailwind.config.ts        # Configuration Tailwind
```

## 🎨 Personnalisation

### Couleurs

Les couleurs principales sont définies dans `tailwind.config.ts` :
- Primary : #0ea5e9 (Cyan/Blue)
- Secondary : #d946ef (Magenta)

### Images

Placez vos images dans `public/images/` :
- Logo : `public/logo.svg`
- Services : `public/images/services/`
- Voir `public/images/README.md` pour plus de détails

### Contenu

Modifiez les pages dans `src/app/` pour adapter le contenu à vos besoins.

## 📧 Configuration Email

Pour activer l'envoi d'emails via le formulaire de contact, configurez les variables SMTP dans `.env.local` et décommentez le code d'envoi dans `src/app/api/contact/route.ts`.

Exemple avec Gmail :
1. Activer la validation en 2 étapes
2. Générer un mot de passe d'application
3. Utiliser ce mot de passe dans `SMTP_PASS`

## 🔍 SEO

Le site est optimisé pour le SEO :
- ✅ Metadata pour chaque page
- ✅ Sitemap.xml généré automatiquement
- ✅ Robots.txt configuré
- ✅ Open Graph et Twitter Cards
- ✅ URLs canoniques
- ✅ Structured data

Vérifiez votre SEO :
- [Google Search Console](https://search.google.com/search-console)
- [PageSpeed Insights](https://pagespeed.web.dev/)

## 📝 TODO Avant Production

Voir [CHECKLIST.md](./CHECKLIST.md) pour la checklist complète avant déploiement.

## 📞 Support

Pour toute question :
- Email : contact@tarandro.org

## 📄 Licence

© 2024 Tarandro. Tous droits réservés.

---

Développé avec ❤️ par Tarandro
