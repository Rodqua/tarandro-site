# Mode Maintenance - Guide d'utilisation

## 🔧 Comment activer le mode maintenance

### En production (Vercel)

1. Aller dans **Settings > Environment Variables**
2. Modifier la variable `MAINTENANCE_MODE` : 
   - Valeur : `true`
   - Environment : Production
3. Redéployer le site

Les visiteurs verront la page de maintenance.

### En local

Dans [.env.local](.env.local), changer :
```env
MAINTENANCE_MODE=true
```

Redémarrer le serveur : `npm run dev`

---

## 🔓 Comment accéder au site pendant la maintenance

Vous pouvez tester le site normalement même en mode maintenance grâce au **bypass token**.

### Méthode 1 : Via URL (recommandé)

Ajouter `?bypass=VOTRE_TOKEN` à n'importe quelle URL :

**Exemple :**
```
https://tarandro.org?bypass=dev-secret-bypass-2024
https://tarandro.org/services?bypass=dev-secret-bypass-2024
```

Un cookie sera créé et vous aurez accès à tout le site pendant 24h.

### Méthode 2 : Via cookie navigateur

1. Ouvrir les DevTools (F12)
2. Console > taper :
```javascript
document.cookie = "maintenance-bypass=dev-secret-bypass-2024; path=/; max-age=86400"
```
3. Rafraîchir la page

---

## 🔐 Tokens de bypass

### En développement
Token par défaut : `dev-secret-bypass-2024`

URL de test : http://localhost:3000?bypass=dev-secret-bypass-2024

### En production

**IMPORTANT** : Changer le token en production !

Dans Vercel Environment Variables :
```
MAINTENANCE_BYPASS_TOKEN=votre-token-secret-complexe-xyz789
```

Générer un token sécurisé :
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📋 Checklist mise en maintenance

### Avant la maintenance

- [ ] Prévenir les utilisateurs (email, réseaux sociaux)
- [ ] Générer un nouveau bypass token pour la production
- [ ] Tester la page de maintenance en local
- [ ] Vérifier que le bypass fonctionne

### Activer la maintenance

- [ ] Sur Vercel : `MAINTENANCE_MODE=true`
- [ ] Redéployer ou attendre la propagation
- [ ] Vérifier que les visiteurs voient la page de maintenance
- [ ] Tester l'accès avec le bypass token

### Pendant la maintenance

- [ ] Utiliser l'URL avec `?bypass=TOKEN` pour tester
- [ ] Effectuer les modifications/tests nécessaires
- [ ] Vérifier que tout fonctionne

### Après la maintenance

- [ ] Sur Vercel : `MAINTENANCE_MODE=false`
- [ ] Redéployer
- [ ] Vérifier que le site est accessible
- [ ] Supprimer le cookie de bypass (ou attendre expiration)
- [ ] Annoncer la fin de la maintenance

---

## 🎨 Personnaliser la page de maintenance

Modifier [src/app/maintenance/page.tsx](src/app/maintenance/page.tsx) :

- Changer le message
- Modifier les coordonnées de contact
- Ajuster les couleurs/style
- Ajouter une estimation de temps

---

## 🔍 Vérifications

### Tester le mode maintenance

```bash
# 1. Activer la maintenance
# Dans .env.local : MAINTENANCE_MODE=true

# 2. Démarrer le serveur
npm run dev

# 3. Accéder au site
# http://localhost:3000 -> Page de maintenance ✓

# 4. Tester le bypass
# http://localhost:3000?bypass=dev-secret-bypass-2024 -> Site normal ✓

# 5. Vérifier le cookie
# DevTools > Application > Cookies -> maintenance-bypass ✓
```

### Routes toujours accessibles

Même en mode maintenance, ces routes restent accessibles :
- `/maintenance` - La page de maintenance elle-même
- `/api/*` - Toutes les API routes
- `/_next/*` - Assets Next.js
- `/favicon.ico`, `/logo.svg`, `/icon.svg` - Fichiers statiques

---

## ⚠️ Cas particuliers

### Admin toujours accessible

L'admin (`/admin/login`) reste accessible même en maintenance pour permettre la gestion.

### SEO

La page de maintenance a `robots: noindex` pour éviter l'indexation.

### Performance

Le middleware est optimisé et n'impacte pas les performances du site.

---

## 🐛 Troubleshooting

**Le site reste en maintenance après désactivation**
- Vider le cache du navigateur
- Vérifier que `MAINTENANCE_MODE=false` dans Vercel
- Attendre quelques minutes pour la propagation

**Le bypass ne fonctionne pas**
- Vérifier que le token correspond exactement
- Vérifier les cookies du navigateur
- Essayer en navigation privée

**Les assets ne chargent pas en maintenance**
- Les routes `/_next/*` sont exclues automatiquement
- Vérifier que les fichiers statiques sont bien déployés

---

**Le mode maintenance est maintenant configuré ! 🎉**

Pour activer : `MAINTENANCE_MODE=true`  
Pour bypasser : `?bypass=dev-secret-bypass-2024`
