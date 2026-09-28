import type { DiscDimension } from "./questions";

export interface DiscDimensionInfo {
  letter: DiscDimension;
  name: string;
  /** Question à laquelle la dimension répond */
  question: string;
  color: string;
  softBg: string;
  textClass: string;
  keywords: string[];
  summary: string;
  high: string;
  low: string;
  motivations: string[];
  fears: string[];
  /** Ce dont la personne a besoin dans un environnement de travail */
  needs: string[];
}

/**
 * Palette validée (contraste >= 3:1 sur fond blanc, écart CVD suffisant entre
 * chaque paire). Les couleurs restent proches de la convention DISC
 * rouge / jaune / vert / bleu, mais chaque barre porte aussi sa lettre et sa
 * valeur : l'identité ne repose jamais sur la couleur seule.
 */
export const DISC_DIMENSIONS: Record<DiscDimension, DiscDimensionInfo> = {
  D: {
    letter: "D",
    name: "Dominance",
    question: "Comment je réagis aux problèmes et aux défis",
    color: "#DC2626",
    softBg: "#FEF2F2",
    textClass: "text-red-700",
    keywords: ["Résultat", "Décision", "Défi", "Contrôle"],
    summary:
      "Orientation vers l'action et le résultat. La personne va droit au but, tranche vite et cherche à garder la maîtrise de la situation.",
    high:
      "Vous allez à l'essentiel, décidez rapidement et acceptez le conflit s'il fait avancer le sujet. Vous supportez mal la lenteur, les détours et les réunions sans décision.",
    low:
      "Vous préférez la coopération à la confrontation, cherchez le consensus avant de trancher et laissez volontiers la place à d'autres pour arbitrer.",
    motivations: [
      "Obtenir des résultats visibles et mesurables",
      "Disposer d'autonomie et de pouvoir de décision",
      "Relever des défis nouveaux et ambitieux",
      "Aller vite, sans couches hiérarchiques inutiles",
    ],
    fears: ["Perdre le contrôle", "Être dominé ou dirigé de près", "Paraître faible ou inefficace"],
    needs: [
      "Des objectifs clairs plutôt que des consignes détaillées",
      "Une marge de manœuvre réelle",
      "Des interlocuteurs qui vont droit au but",
    ],
  },
  I: {
    letter: "I",
    name: "Influence",
    question: "Comment j'influence les autres",
    color: "#CA8A04",
    softBg: "#FEFCE8",
    textClass: "text-yellow-700",
    keywords: ["Relation", "Enthousiasme", "Persuasion", "Visibilité"],
    summary:
      "Orientation vers les personnes et l'interaction. La personne convainc par l'enthousiasme, crée du lien vite et fait circuler l'énergie d'un groupe.",
    high:
      "Vous parlez facilement, embarquez un auditoire et créez du lien en quelques minutes. Vous pouvez en revanche survoler les détails et vous disperser sur trop de sujets.",
    low:
      "Vous êtes plus réservé, vous vous appuyez sur les faits plutôt que sur l'émotion et vous préférez les échanges restreints aux grands groupes.",
    motivations: [
      "La reconnaissance et la visibilité sociale",
      "Travailler avec et devant des personnes",
      "La variété, la nouveauté, l'ambiance",
      "La liberté d'expression et d'improvisation",
    ],
    fears: ["Le rejet social", "L'isolement", "Être ignoré ou perdre son image"],
    needs: [
      "Des interactions fréquentes",
      "De la reconnaissance exprimée à voix haute",
      "De la souplesse dans le cadre",
    ],
  },
  S: {
    letter: "S",
    name: "Stabilité",
    question: "Comment je réagis au rythme et au changement",
    color: "#059669",
    softBg: "#ECFDF5",
    textClass: "text-emerald-700",
    keywords: ["Constance", "Écoute", "Coopération", "Fiabilité"],
    summary:
      "Orientation vers le rythme régulier et la cohésion. La personne tient ses engagements, écoute réellement et absorbe les tensions du groupe.",
    high:
      "Vous êtes constant, patient et disponible ; on peut compter sur vous. Vous acceptez en revanche difficilement les changements brusques et vous dites rarement non.",
    low:
      "Vous appréciez le changement, l'urgence et la variété. La routine vous pèse et vous passez vite d'un sujet à l'autre.",
    motivations: [
      "Un environnement prévisible et sûr",
      "Des relations de confiance durables",
      "Un travail utile aux autres",
      "Du temps pour bien faire",
    ],
    fears: [
      "Le changement imposé sans préparation",
      "Le conflit ouvert",
      "La perte de sécurité ou de repères",
    ],
    needs: [
      "Un préavis avant tout changement, et le « pourquoi »",
      "Un cadre stable et des règles connues",
      "De la reconnaissance sincère plutôt que démonstrative",
    ],
  },
  C: {
    letter: "C",
    name: "Conformité",
    question: "Comment je réagis aux règles et aux procédures",
    color: "#2563EB",
    softBg: "#EFF6FF",
    textClass: "text-blue-700",
    keywords: ["Précision", "Méthode", "Qualité", "Analyse"],
    summary:
      "Orientation vers l'exactitude et la méthode. La personne vérifie, structure, documente et cherche la solution juste plutôt que la solution rapide.",
    high:
      "Vous travaillez avec rigueur, anticipez les erreurs et argumentez sur des faits. Vous pouvez en revanche différer une décision par recherche de certitude.",
    low:
      "Vous êtes pragmatique, à l'aise avec l'approximation utile et vous préférez tester plutôt que documenter. Les procédures détaillées vous freinent.",
    motivations: [
      "La qualité et l'exactitude du travail rendu",
      "Des règles claires et des attentes explicites",
      "L'expertise reconnue dans son domaine",
      "Le temps de l'analyse avant l'action",
    ],
    fears: ["La critique de son travail", "L'erreur", "Devoir agir sans information suffisante"],
    needs: [
      "Des critères de qualité explicites",
      "L'accès aux données et aux procédures",
      "Des retours factuels, pas des jugements",
    ],
  },
};

export const DIMENSION_ORDER: DiscDimension[] = ["D", "I", "S", "C"];
