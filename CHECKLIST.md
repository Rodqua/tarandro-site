# Checklist de Déploiement Tarandro.org

## 📋 Avant le Build

### Code & Configuration
- [ ] Le build passe sans erreurs : `npm run build`
- [ ] Aucune erreur TypeScript : `npm run lint`
- [ ] Toutes les dépendances sont installées
- [ ] `.env.local` ne contient que des variables de développement
- [ ] `.gitignore` est configuré correctement

### Contenu
- [ ] **Coordonnées réelles** ajoutées :
  - [ ] Téléphone dans Header et Contact
  - [ ] Email de contact
  - [ ] Adresse physique
- [ ] **Mentions légales** complétées avec :
  - [ ] Raison sociale
  - [ ] SIRET / RCS
  - [ ] Capital social
  - [ ] Directeur de publication
- [ ] **Images professionnelles** ajoutées :
  - [ ] Logo (si personnalisé)
  - [ ] Image hero
  - [ ] Images services (5)
  - [ ] Photo équipe/fondateur
- [ ] **Textes** revus et corrigés :
  - [ ] Fautes d'orthographe
  - [ ] Informations à jour
  - [ ] Cohérence des messages

## 🔐 Sécurité

### Credentials
- [ ] Mot de passe admin changé (pas admin/admin123)
- [ ] `NEXTAUTH_SECRET` généré avec `openssl rand -base64 32`
- [ ] Hash de mot de passe généré avec bcryptjs
- [ ] Identifiants admin notés dans un gestionnaire de mots de passe

### Variables d'environnement
- [ ] `.env.local` non commité dans Git
- [ ] `.env.example` à jour
- [ ] Variables sensibles seulement en production

## 🌐 Configuration Vercel

### Projet
- [ ] Repository GitHub créé et pushhé
- [ ] Projet importé sur Vercel
- [ ] Build settings correctes (détection automatique Next.js)

### Variables d'environnement Vercel
- [ ] `NEXTAUTH_URL` = `https://tarandro.org` (Production)
- [ ] `NEXTAUTH_SECRET` = [Votre secret]
- [ ] `ADMIN_USERNAME` = [Votre username]
- [ ] `ADMIN_PASSWORD_HASH` = [Votre hash]
- [ ] Variables SMTP si email activé :
  - [ ] `SMTP_HOST`
  - [ ] `SMTP_PORT`
  - [ ] `SMTP_USER`
  - [ ] `SMTP_PASS`
  - [ ] `SMTP_FROM`

### Domaine
- [ ] Domaine `tarandro.org` acheté
- [ ] DNS configurés (A record + CNAME)
- [ ] Domaine ajouté dans Vercel
- [ ] Certificat SSL actif (automatique)
- [ ] Redirection www → non-www configurée

## ✅ Tests Post-Déploiement

### Fonctionnel
- [ ] Page d'accueil charge correctement
- [ ] Toutes les pages services accessibles
- [ ] Blog accessible
- [ ] Formulaire de contact fonctionne
- [ ] Email de contact reçu (si SMTP configuré)
- [ ] Admin login accessible à `/admin/login`
- [ ] Connexion admin fonctionne
- [ ] Interface blog admin protégée
- [ ] Déconnexion admin fonctionne

### Responsive
- [ ] Test sur mobile (iPhone, Android)
- [ ] Test sur tablette (iPad)
- [ ] Test sur desktop (1920x1080)
- [ ] Menu mobile fonctionne
- [ ] Images responsive

### Navigateurs
- [ ] Chrome (desktop & mobile)
- [ ] Firefox
- [ ] Safari (desktop & mobile)
- [ ] Edge

### Performance
- [ ] PageSpeed Insights score > 90
- [ ] Temps de chargement < 3s
- [ ] Images optimisées (WebP)
- [ ] Pas d'erreurs console

### SEO
- [ ] `/sitemap.xml` accessible
- [ ] `/robots.txt` accessible
- [ ] Metadata présent sur toutes les pages
- [ ] Open Graph images générées
- [ ] Titles uniques pour chaque page
- [ ] Descriptions uniques
- [ ] URLs canoniques

## 📊 Post-Lancement

### Google Services
- [ ] Google Search Console configuré
- [ ] Sitemap soumis à Google
- [ ] Google Analytics installé (optionnel)
- [ ] Google Tag Manager (optionnel)

### Monitoring
- [ ] Vercel Analytics activé
- [ ] Uptime monitor configuré (optionnel)
- [ ] Email d'alertes configuré

### Marketing
- [ ] Site soumis à Google
- [ ] Profil Google Business créé (si applicable)
- [ ] LinkedIn page entreprise mise à jour
- [ ] Signature email avec lien site

## 📝 Documentation

- [ ] README.md à jour
- [ ] DEPLOYMENT.md créé
- [ ] Credentials sauvegardés de manière sécurisée
- [ ] Procédure de mise à jour documentée

## 🎯 Go / No-Go

### Critères bloquants (Go requis)
- [ ] Build production sans erreurs
- [ ] Domaine configuré et SSL actif
- [ ] Admin login fonctionne
- [ ] Contact form fonctionne
- [ ] Mentions légales complétées
- [ ] Mobile responsive

### Critères non-bloquants (peuvent être faits après)
- [ ] Google Analytics
- [ ] Images personnalisées
- [ ] Blog avec articles
- [ ] Email SMTP configuré

---

## 🚀 PRÊT POUR LE LANCEMENT

Date de lancement : ___/___/______

Signature : _____________________

---

**Après le lancement :**

1. Monitorer les premières 24h
2. Vérifier Google Search Console après 48h
3. Analyser les analytics après 1 semaine
4. Faire les ajustements SEO si nécessaire
