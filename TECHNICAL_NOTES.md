# Notes Techniques - Tarandro.org

## ⚠️ Build Warnings

### Pages Admin - Prerendering Errors

Lors du build local (`npm run build`), vous verrez des erreurs de prerendering pour les pages admin :
- `/admin`
- `/admin/blog`
- `/admin/login`

**C'est normal et attendu !**  

#### Pourquoi ?

Ces pages utilisent `useSession()` de NextAuth.js qui nécessite un contexte de session disponible uniquement côté client. Next.js essaie de pré-rendre toutes les pages lors du build, mais ces pages ne peuvent pas être pré-rendues car elles dépendent de l'authentification de l'utilisateur.

#### Est-ce un problème ?

**Non !** En production sur Vercel :
- Ces pages seront générées à la demande (server-side rendering)
- Le middleware protège correctement les routes
- L'authentification fonctionne normalement
- Les utilisateurs non authentifiés sont redirigés vers `/admin/login`

#### Solutions appliquées

1. `export const dynamic = 'force-dynamic'` dans les pages admin
2. Middleware qui protège les routes sensibles
3. SessionProvider dans le layout principal
4. Types NextAuth personnalisés

Le build continuera mais affichera ces warnings. **C'est l'approche recommandée pour les applications avec authentification.**

---

## 🔧 Configuration Next.js

### Output Mode

```javascript
output: 'standalone'
```

Génère une version optimisée et autonome pour le déploiement.

### Images

Formats supportés : AVIF, WebP  
Sizes adaptatives : 640px à 3840px

### SEO Headers

Tous les headers de sécurité et SEO sont configurés :
- X-DNS-Prefetch-Control
- Strict-Transport-Security
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy

---

## 📱 PWA

Le site est PWA-ready avec :
- Manifest généré (`/manifest.webmanifest`)
- Favicons dynamiques (icon.tsx, apple-icon.tsx)
- Open Graph images (opengraph-image.tsx)

---

## 🗄️ Base de données

**Actuellement** : Pas de base de données, données statiques en code

**Pour ajouter une BDD** :

### Option 1 : Vercel Postgres
```bash
npm install @vercel/postgres
```

### Option 2 : Prisma + PostgreSQL
```bash
npm install prisma @prisma/client
npx prisma init
```

### Option 3 : MongoDB
```bash
npm install mongodb mongoose
```

---

## 📧 Email Configuration

Le formulaire de contact est prêt mais l'envoi d'emails n'est pas configuré par défaut.

### Pour activer l'envoi d'emails :

1. Configurer les variables d'environnement SMTP
2. Décommenter le code dans `src/app/api/contact/route.ts`
3. Installer nodemailer si nécessaire :
```bash
npm install nodemailer
npm install --save-dev @types/nodemailer
```

### Services d'emailing recommandés :
- **SendGrid** : 100 emails/jour gratuits
- **Resend** : Modern, Next.js-friendly
- **Gmail SMTP** : Simple mais limité
- **Mailgun** : Fiable, bon pour production

---

## 🚀 Performance

### Lighthouse Scores Attendus

- Performance : 95+
- Accessibility : 100
- Best Practices : 100
- SEO : 100

### Optimisations Appliquées

- ✅ Images Next.js optimisées automatiquement
- ✅ Lazy loading des composants
- ✅ Tree shaking automatique
- ✅ CSS Tailwind purgé en production
- ✅ Compression gzip/brotli
- ✅ Headers de cache optimisés

---

## 🔐 Sécurité

### Credentials

**JAMAIS** commiter :
- `.env.local`
- `.env.production`
- Mots de passe en clair
- Clés API

### En production, utiliser :
- Variables d'environnement Vercel
- Secrets chiffrés
- Rotation régulière des credentials

---

## 📊 Analytics (À configurer)

### Google Analytics

```tsx
// src/app/layout.tsx
<Script
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
  strategy="afterInteractive"
/>
```

### Vercel Analytics (Recommandé)

Déjà intégré, activer dans le dashboard Vercel.

---

## 🐛 Debugging

### Logs de production

Vercel fournit des logs en temps réel dans le dashboard.

### Mode debug local

```bash
NODE_OPTIONS='--inspect' npm run dev
```

Puis ouvrir `chrome://inspect` dans Chrome.

---

## 🔄 Mise à jour

### Workflow recommandé

1. Développer en local sur une branche feature
2. Tester avec `npm run build && npm start`
3. Push sur GitHub
4. Vercel crée une preview deployment
5. Vérifier la preview
6. Merge dans main → déploiement automatique en production

### Rollback

En cas de problème en production :
```bash
vercel rollback
```

Ou via le dashboard Vercel > Deployments > Promote to Production sur une version précédente.

---

## 📝 Maintenance

### Mises à jour dépendances

```bash
# Vérifier les updates
npm outdated

# Mettre à jour (prudence)
npm update

# Mettre à jour Next.js specifically
npm install next@latest react@latest react-dom@latest
```

### Audit de sécurité

```bash
npm audit
npm audit fix
```

---

## 🎯 Roadmap Technique

### Court terme
- [ ] Intégrer une vraie BDD (Prisma + PostgreSQL)
- [ ] Activer l'envoi d'emails
- [ ] Ajouter Google Analytics
- [ ] Tests E2E (Playwright)

### Moyen terme
- [ ] Blog dynamique avec CMS (Contentful/Sanity)
- [ ] Espace client personnel
- [ ] Système de réservation en ligne
- [ ] Multi-langue (i18n)

### Long terme
- [ ] App mobile (React Native)
- [ ] Chatbot IA
- [ ] Tableau de bord analytics avancé

---

Mis à jour le : ${new Date().toLocaleDateString('fr-FR')}
