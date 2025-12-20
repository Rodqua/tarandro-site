# Configuration Google Analytics API

## Vue d'ensemble

Votre dashboard admin est maintenant prêt à afficher les statistiques Google Analytics 4 en temps réel ! Vous aurez :

- **Trafic du site** : utilisateurs, sessions, pages vues, taux de rebond, durée moyenne, taux de conversion
- **Sources de trafic** : d'où viennent vos visiteurs (Google, direct, social, etc.)
- **Pages populaires** : les 10 pages les plus visitées
- **Événements trackés** : clics sur téléphone, email, formulaire, boutons

## Étapes de configuration (15-20 minutes)

### 1. Activer l'API Google Analytics Data

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Dans le menu, allez dans **APIs & Services > Library**
4. Recherchez "Google Analytics Data API"
5. Cliquez sur **Enable**

### 2. Créer un compte de service

1. Dans Google Cloud Console, allez dans **APIs & Services > Credentials**
2. Cliquez sur **Create Credentials > Service Account**
3. Donnez un nom : `tarandro-analytics`
4. Rôle : **Viewer** (ou laissez vide pour l'instant)
5. Cliquez sur **Done**

### 3. Télécharger la clé JSON

1. Dans la liste des comptes de service, cliquez sur celui que vous venez de créer
2. Allez dans l'onglet **Keys**
3. Cliquez sur **Add Key > Create new key**
4. Choisissez **JSON** comme type
5. La clé sera téléchargée automatiquement (gardez ce fichier en sécurité !)

### 4. Donner accès au compte de service dans Google Analytics

1. Allez sur [Google Analytics](https://analytics.google.com/)
2. Sélectionnez votre propriété (tarandro.org)
3. Cliquez sur **Admin** (roue dentée en bas à gauche)
4. Dans la colonne **Property**, cliquez sur **Property Access Management**
5. Cliquez sur le **+** pour ajouter un utilisateur
6. Collez l'email du compte de service (format : `tarandro-analytics@xxx.iam.gserviceaccount.com`)
   - Vous le trouvez dans le fichier JSON téléchargé (champ `client_email`)
7. Donnez le rôle **Viewer**
8. Décochez "Notify new users by email"
9. Cliquez sur **Add**

### 5. Obtenir votre Property ID

1. Dans Google Analytics, restez dans **Admin**
2. Dans la colonne **Property**, cliquez sur **Property Settings**
3. Copiez le **Property ID** (format : `123456789`)

### 6. Configurer les variables d'environnement sur Vercel

1. Allez sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Sélectionnez votre projet `tarandro-site`
3. Allez dans **Settings > Environment Variables**
4. Ajoutez ces 2 variables :

#### Variable 1 : GA4_PROPERTY_ID

- **Name** : `GA4_PROPERTY_ID`
- **Value** : votre Property ID (ex: `123456789`)
- **Environments** : cochez Production, Preview, et Development

#### Variable 2 : GA4_CREDENTIALS

- **Name** : `GA4_CREDENTIALS`
- **Value** : Le contenu COMPLET de votre fichier JSON téléchargé, **sur une seule ligne**
- **Environments** : cochez Production, Preview, et Development

⚠️ **IMPORTANT** : Le JSON doit être sur une seule ligne. Exemple :

```
{"type":"service_account","project_id":"xxx","private_key_id":"xxx","private_key":"-----BEGIN PRIVATE KEY-----\nXXX\n-----END PRIVATE KEY-----\n","client_email":"tarandro-analytics@xxx.iam.gserviceaccount.com","client_id":"xxx","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"xxx"}
```

💡 **Astuce** : Ouvrez le fichier JSON dans un éditeur de texte, sélectionnez tout, copiez et collez directement.

### 7. Redéployer

1. Dans Vercel, allez dans **Deployments**
2. Cliquez sur les **...** du dernier déploiement
3. Cliquez sur **Redeploy**
4. ✅ Les statistiques Google Analytics apparaîtront dans votre dashboard admin !

## Vérification

Une fois configuré, vous verrez dans votre dashboard admin :

- Un indicateur vert "Google Analytics connecté" en haut à droite
- 4 nouvelles sections avec les statistiques en temps réel :
  - **Trafic du site** : statistiques globales sur 30 jours
  - **Sources de trafic** : graphique des canaux d'acquisition
  - **Pages populaires** : top 10 des pages les plus visitées
  - **Événements trackés** : clics et conversions

## Événements trackés automatiquement

Le système track automatiquement :

- `page_view` : chaque page visitée
- `form_submit` : envoi du formulaire de contact
- `phone_click` : clic sur le numéro de téléphone
- `email_click` : clic sur l'adresse email
- `button_click` : clic sur les boutons CTA
- `scroll` : profondeur de scroll (25%, 50%, 75%, 90%)

## Dépannage

### Le dashboard n'affiche pas les stats GA4

- Vérifiez que les 2 variables d'environnement sont bien configurées sur Vercel
- Vérifiez que le Property ID est correct (sans espaces)
- Vérifiez que le JSON est sur une seule ligne
- Vérifiez que l'API Google Analytics Data est activée
- Attendez 5 minutes après le redéploiement

### Erreur "Permission denied"

- Vérifiez que le compte de service a bien le rôle **Viewer** dans Google Analytics
- Vérifiez que l'email du compte de service est correct

### Pas de données dans GA4

- Les événements peuvent prendre 24-48h avant d'apparaître dans GA4
- Utilisez le **DebugView** dans GA4 pour voir les événements en temps réel
- Vérifiez que Google Tag Manager est bien installé (GTM-TV8DZL37)

## Support

Si vous avez des questions ou des problèmes, référez-vous à :

- [Documentation Google Analytics Data API](https://developers.google.com/analytics/devguides/reporting/data/v1)
- [Documentation Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
