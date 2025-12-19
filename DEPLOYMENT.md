# Déploiement sur Vercel

## 🚀 Guide de déploiement

### 1. Préparation

#### a) Vérifier que tout fonctionne localement

```bash
# Build de production
npm run build

# Tester le build
npm start
```

#### b) Créer un repository GitHub

```bash
git init
git add .
git commit -m "Initial commit - Tarandro website"
git branch -M main
git remote add origin https://github.com/votre-username/tarandro.org.git
git push -u origin main
```

### 2. Déploiement Vercel

#### a) Via l'interface web (Recommandé)

1. Aller sur [vercel.com](https://vercel.com)
2. Se connecter avec GitHub
3. Cliquer sur "Add New Project"
4. Importer votre repository GitHub
5. Configurer le projet :
   - **Framework Preset** : Next.js (détecté automatiquement)
   - **Root Directory** : ./
   - **Build Command** : `npm run build` (par défaut)
   - **Output Directory** : `.next` (par défaut)

#### b) Via Vercel CLI

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Déploiement production
vercel --prod
```

### 3. Configuration des variables d'environnement

Dans Vercel Dashboard > Settings > Environment Variables, ajouter :

#### Variables obligatoires

| Variable | Value | Environnement |
|----------|-------|---------------|
| `NEXTAUTH_URL` | `https://votre-domaine.com` | Production |
| `NEXTAUTH_URL` | `https://votre-preview.vercel.app` | Preview |
| `NEXTAUTH_SECRET` | Générer avec `openssl rand -base64 32` | All |
| `ADMIN_USERNAME` | `admin` (ou autre) | All |
| `ADMIN_PASSWORD_HASH` | Générer avec bcryptjs | All |

#### Variables optionnelles (Email)

| Variable | Value | Environnement |
|----------|-------|---------------|
| `SMTP_HOST` | `smtp.gmail.com` | Production |
| `SMTP_PORT` | `587` | Production |
| `SMTP_USER` | `votre-email@gmail.com` | Production |
| `SMTP_PASS` | Mot de passe d'application | Production |
| `SMTP_FROM` | `noreply@tarandro.org` | Production |

### 4. Générer les secrets

#### NEXTAUTH_SECRET

```bash
openssl rand -base64 32
# Exemple de sortie : K7gNU3sdo+OL0wNhqoVWhr3g6s1xYv72ol/pe/Unols=
```

#### ADMIN_PASSWORD_HASH

```bash
# Installer bcryptjs si nécessaire
npm install bcryptjs

# Générer le hash
node -e "console.log(require('bcryptjs').hashSync('VotreMotDePasseSecurisé123!', 10))"
# Exemple de sortie : $2a$10$YourHashedPasswordHere...
```

### 5. Configuration du domaine personnalisé

#### a) Ajouter le domaine dans Vercel

1. Aller dans Settings > Domains
2. Ajouter `tarandro.org` et `www.tarandro.org`
3. Suivre les instructions pour configurer les DNS

#### b) Configuration DNS (chez votre registrar)

Ajouter ces enregistrements DNS :

**Pour le domaine racine (tarandro.org) :**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

**Pour www (www.tarandro.org) :**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

#### c) Attendre la propagation DNS (peut prendre jusqu'à 24h)

Vérifier avec :
```bash
dig tarandro.org
dig www.tarandro.org
```

### 6. Configuration Post-Déploiement

#### a) Activer HTTPS

HTTPS est activé automatiquement par Vercel (Let's Encrypt).

#### b) Redirection www → non-www (ou inverse)

Dans `vercel.json` (créer à la racine) :

```json
{
  "redirects": [
    {
      "source": "/:path*",
      "has": [
        {
          "type": "host",
          "value": "www.tarandro.org"
        }
      ],
      "destination": "https://tarandro.org/:path*",
      "permanent": true
    }
  ]
}
```

#### c) Mettre à jour NEXTAUTH_URL

Une fois le domaine configuré, mettre à jour dans Vercel :
```
NEXTAUTH_URL=https://tarandro.org
```

### 7. Performance et Optimisation

#### a) Activer la compression (automatique sur Vercel)

#### b) Configurer les headers de sécurité

Dans `next.config.mjs`, ajouter :

```javascript
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};
```

### 8. Monitoring

#### a) Analytics Vercel (gratuit)

Activer dans Vercel Dashboard > Analytics

#### b) Google Search Console

1. Aller sur [search.google.com/search-console](https://search.google.com/search-console)
2. Ajouter la propriété `tarandro.org`
3. Vérifier via DNS ou HTML
4. Soumettre le sitemap : `https://tarandro.org/sitemap.xml`

#### c) Performance

Vérifier régulièrement sur :
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)

### 9. CI/CD - Déploiement automatique

Vercel détecte automatiquement les pushs sur GitHub :

- **Push sur `main`** → Déploiement en production
- **Pull Request** → Preview deployment
- **Push sur autre branche** → Preview deployment

### 10. Rollback

En cas de problème :

```bash
# Via CLI
vercel rollback

# Ou via l'interface Vercel > Deployments > Promote to Production
```

### 11. Checklist finale avant le go-live

- [ ] Build passe sans erreurs : `npm run build`
- [ ] Variables d'environnement configurées dans Vercel
- [ ] Domaine personnalisé configuré et vérifié
- [ ] HTTPS activé et certificat valide
- [ ] Identifiants admin changés (pas admin/admin123)
- [ ] Informations de contact réelles (téléphone, email, adresse)
- [ ] Images professionnelles ajoutées
- [ ] Google Search Console configuré
- [ ] Sitemap accessible : `/sitemap.xml`
- [ ] Robots.txt accessible : `/robots.txt`
- [ ] Mentions légales complétées avec vraies informations
- [ ] Test sur mobile, tablette, desktop
- [ ] Test sur Chrome, Firefox, Safari, Edge
- [ ] Formulaire de contact testé et fonctionnel
- [ ] Page admin accessible et protégée

## 🆘 Troubleshooting

### Erreur : NEXTAUTH_URL non défini

**Solution** : Ajouter `NEXTAUTH_URL` dans les variables d'environnement Vercel

### Erreur 500 sur /admin

**Solution** : Vérifier que `NEXTAUTH_SECRET` est défini

### Le domaine ne pointe pas

**Solution** : Attendre 24h pour la propagation DNS, vérifier les enregistrements

### Images ne s'affichent pas

**Solution** : Vérifier que les images sont bien dans `/public/` et non gitignorées

## 📞 Support Vercel

- Documentation : [vercel.com/docs](https://vercel.com/docs)
- Support : [vercel.com/support](https://vercel.com/support)
- Status : [www.vercel-status.com](https://www.vercel-status.com)

---

✨ Votre site est maintenant en ligne !
