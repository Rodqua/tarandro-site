# Configuration Google Analytics API

Pour afficher les vraies statistiques Google Analytics dans le dashboard admin, suivez ces étapes :

## 1. Activer l'API Google Analytics

1. Allez sur https://console.cloud.google.com/
2. Sélectionnez votre projet (ou créez-en un nouveau)
3. Dans le menu, allez dans **APIs & Services** → **Library**
4. Cherchez **Google Analytics Data API**
5. Cliquez **Enable**

## 2. Créer des identifiants de service

1. Allez dans **APIs & Services** → **Credentials**
2. Cliquez **Create Credentials** → **Service Account**
3. Donnez un nom (ex: "tarandro-analytics")
4. Cliquez **Create and Continue**
5. Rôle: **Viewer**
6. Cliquez **Done**

## 3. Télécharger la clé JSON

1. Cliquez sur le service account que vous venez de créer
2. Allez dans l'onglet **Keys**
3. **Add Key** → **Create new key**
4. Choisissez **JSON**
5. La clé sera téléchargée automatiquement

## 4. Donner l'accès à Analytics

1. Ouvrez le fichier JSON téléchargé
2. Copiez la valeur du champ `client_email`
3. Allez sur https://analytics.google.com/
4. **Admin** → **Property Access Management**
5. Cliquez **+** puis **Add users**
6. Collez l'email du service account
7. Rôle: **Viewer**
8. Cliquez **Add**

## 5. Obtenir votre Property ID

1. Dans Google Analytics, allez dans **Admin**
2. Sélectionnez votre propriété
3. **Property Settings**
4. Copiez le **Property ID** (format: 123456789)

## 6. Configurer les variables d'environnement sur Vercel

Sur Vercel, ajoutez ces variables d'environnement :

```
GA4_PROPERTY_ID=votre-property-id
GA4_CREDENTIALS={"type":"service_account","project_id":"...","private_key_id":"...","private_key":"...","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}
```

**Important:** Pour `GA4_CREDENTIALS`, copiez tout le contenu du fichier JSON téléchargé sur une seule ligne.

## 7. Redéployer

Une fois les variables ajoutées, redéployez sur Vercel. Le dashboard affichera automatiquement les vraies statistiques !

## Statistiques disponibles

- Visiteurs uniques (jour/semaine/mois)
- Pages vues
- Taux de rebond
- Durée moyenne des sessions
- Sources de trafic (organic, direct, referral, social)
- Pages les plus visitées
- Événements personnalisés (clics, formulaires, etc.)
- Conversions

## Troubleshooting

**Erreur "Permission denied"**
→ Vérifiez que l'email du service account a bien été ajouté dans Google Analytics avec les droits Viewer

**Erreur "Property not found"**
→ Vérifiez le Property ID dans Google Analytics Admin

**Pas de données**
→ Attendez 24-48h après l'activation de GA4 pour avoir des données
