# Images et Assets

## Structure des dossiers

```
public/
├── images/
│   ├── logo.svg                 # Logo principal Tarandro
│   ├── hero-bg.jpg              # Image de fond Hero section
│   ├── services/
│   │   ├── iso.jpg              # Image certification ISO
│   │   ├── has.jpg              # Image certification HAS
│   │   ├── psad.jpg             # Image PSAD
│   │   ├── bureautique.jpg      # Image formation bureautique
│   │   └── sst.jpg              # Image formation SST
│   ├── about/
│   │   └── team.jpg             # Photo de l'équipe
│   └── blog/
│       └── placeholder.jpg       # Image par défaut pour les articles
```

## Images à créer/obtenir

### Logo
- **logo.svg** : Logo principal Tarandro
  - Format : SVG (vectoriel)
  - Dimensions recommandées : 200x60px
  - Couleurs : Utiliser les couleurs du site (#0ea5e9, #d946ef)

### Hero Section
- **hero-bg.jpg** : Image de fond pour la section hero
  - Format : WebP (optimisé) ou JPG
  - Dimensions : 1920x1080px minimum
  - Style : Professionnel, business, qualité
  - Suggestions : Bureau moderne, équipe en réunion, documents qualité

### Services (5 images)
Chaque image doit être professionnelle et refléter le service :

1. **iso.jpg** - Certification ISO
   - Style : Documents certifiés, badge ISO, audit qualité
   - Dimensions : 800x600px

2. **has.jpg** - Certification HAS
   - Style : Établissement de santé, professionnels de santé
   - Dimensions : 800x600px

3. **psad.jpg** - PSAD
   - Style : Analyse de risques, amélioration continue
   - Dimensions : 800x600px

4. **bureautique.jpg** - Formation Bureautique
   - Style : Ordinateur, formation, Excel/Word
   - Dimensions : 800x600px

5. **sst.jpg** - Formation SST
   - Style : Formation secourisme, mannequin, formateur
   - Dimensions : 800x600px

### À propos
- **team.jpg** : Photo de l'équipe ou du fondateur
  - Dimensions : 1200x800px
  - Style : Professionnel, souriant, confiance

### Blog
- **placeholder.jpg** : Image par défaut pour les articles sans image
  - Dimensions : 1200x630px (format Open Graph)

## Sources d'images libres de droits

1. **Unsplash** : https://unsplash.com
   - Recherches suggérées : "business meeting", "quality control", "training", "medical", "office work"

2. **Pexels** : https://www.pexels.com
   - Recherches suggérées : "professional training", "certification", "healthcare", "office"

3. **Pixabay** : https://pixabay.com

## Optimisation des images

### Commandes pour optimiser
```bash
# Installer sharp pour l'optimisation
npm install sharp

# Script d'optimisation (à créer)
node scripts/optimize-images.js
```

### Formats recommandés
- **WebP** : Format moderne, compression optimale
- **AVIF** : Encore meilleur que WebP, support croissant
- **JPG** : Fallback pour compatibilité

### Tailles recommandées
- Hero : 1920x1080px (16:9)
- Services : 800x600px (4:3)
- Blog thumbnails : 1200x630px (Open Graph)
- Logo : SVG (scalable)

## Intégration dans Next.js

```tsx
import Image from 'next/image';

// Exemple d'utilisation
<Image
  src="/images/services/iso.jpg"
  alt="Certification ISO"
  width={800}
  height={600}
  quality={85}
  priority={false}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

## next.config.mjs - Configuration

Déjà configuré dans le projet pour optimiser automatiquement les images.

## TODO
- [ ] Créer ou obtenir le logo Tarandro (SVG)
- [ ] Sélectionner et optimiser l'image hero
- [ ] Obtenir 5 images pour les services
- [ ] Photo équipe/fondateur pour la page À propos
- [ ] Image placeholder pour le blog
- [ ] Créer favicons (16x16, 32x32, 180x180, 192x192, 512x512)
- [ ] Générer Open Graph images (1200x630px)
