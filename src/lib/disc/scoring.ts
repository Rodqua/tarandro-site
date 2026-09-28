import { DISC_QUESTIONS, TOTAL_QUESTIONS, type DiscDimension } from "./questions";
import { DIMENSION_ORDER, DISC_DIMENSIONS } from "./dimensions";
import { DISC_PROFILES, type DiscProfile } from "./profiles";

export type DiscScores = Record<DiscDimension, number>;

/** Une réponse = l'adjectif choisi comme « le plus » et comme « le moins » */
export interface DiscAnswer {
  most: DiscDimension | null;
  least: DiscDimension | null;
}

export type DiscAnswers = Record<number, DiscAnswer>;

export interface DiscGraph {
  id: "masque" | "moteur" | "synthese";
  title: string;
  subtitle: string;
  explanation: string;
  scores: DiscScores;
}

export interface DiscIntensity {
  dimension: DiscDimension;
  score: number;
  /** Libellé d'intensité : « très marquée », « modérée »… */
  level: string;
  comment: string;
}

export interface DiscResult {
  /** Nombre de fois où chaque dimension a été choisie comme « le plus » */
  rawMost: DiscScores;
  /** Nombre de fois où chaque dimension a été choisie comme « le moins » */
  rawLeast: DiscScores;
  masque: DiscScores;
  moteur: DiscScores;
  synthese: DiscScores;
  graphs: DiscGraph[];
  /** Dimensions triées par score de synthèse décroissant */
  ranking: DiscDimension[];
  primary: DiscDimension;
  secondary: DiscDimension | null;
  profile: DiscProfile;
  intensities: DiscIntensity[];
  /** Écart total entre le masque et le moteur, en points */
  adaptationGap: number;
  adaptationLabel: string;
  adaptationComment: string;
}

/**
 * Attente statistique : avec 28 groupes et 4 dimensions, une dimension est
 * choisie 7 fois en moyenne. On cale donc la ligne médiane (50) sur 7 choix,
 * et le plafond (100) sur 14 choix, soit le double de l'attendu.
 */
const EXPECTED = TOTAL_QUESTIONS / 4;
const FULL_SCALE = EXPECTED * 2;

const emptyScores = (): DiscScores => ({ D: 0, I: 0, S: 0, C: 0 });

const clamp = (value: number) => Math.max(0, Math.min(100, value));
const round = (value: number) => Math.round(value);

export function createEmptyAnswers(): DiscAnswers {
  const answers: DiscAnswers = {};
  for (const question of DISC_QUESTIONS) {
    answers[question.id] = { most: null, least: null };
  }
  return answers;
}

export function countCompleted(answers: DiscAnswers): number {
  return Object.values(answers).filter((a) => a.most !== null && a.least !== null).length;
}

function intensityLevel(score: number): string {
  if (score >= 75) return "très marquée";
  if (score >= 60) return "marquée";
  if (score >= 40) return "modérée";
  if (score >= 25) return "peu marquée";
  return "très peu marquée";
}

function intensityComment(dimension: DiscDimension, score: number): string {
  const info = DISC_DIMENSIONS[dimension];
  if (score >= 60) return info.high;
  if (score >= 40) {
    return `Vous mobilisez cette dimension quand la situation l'exige, sans qu'elle constitue votre réflexe premier. ${info.summary}`;
  }
  return info.low;
}

/**
 * Détermine le « pattern » DISC : dimension dominante, dimension secondaire
 * éventuelle, et profil correspondant.
 *
 * - une dimension est retenue comme secondaire si elle atteint la ligne
 *   médiane (50) et reste dans un écart de 25 points de la dominante ;
 * - si les quatre dimensions tiennent dans une fourchette de 15 points, le
 *   profil est considéré comme équilibré.
 */
function resolveProfile(synthese: DiscScores): {
  ranking: DiscDimension[];
  primary: DiscDimension;
  secondary: DiscDimension | null;
  profile: DiscProfile;
} {
  const ranking = [...DIMENSION_ORDER].sort((a, b) => synthese[b] - synthese[a]);
  const [first, second] = ranking;
  const spread = synthese[ranking[0]] - synthese[ranking[3]];

  if (spread <= 15) {
    return {
      ranking,
      primary: first,
      secondary: null,
      profile: DISC_PROFILES.BALANCED,
    };
  }

  const hasSecondary = synthese[second] >= 50 && synthese[first] - synthese[second] <= 25;
  const key = hasSecondary ? `${first}${second}` : first;

  return {
    ranking,
    primary: first,
    secondary: hasSecondary ? second : null,
    profile: DISC_PROFILES[key] ?? DISC_PROFILES[first],
  };
}

function adaptationText(gap: number): { label: string; comment: string } {
  if (gap >= 60) {
    return {
      label: "Adaptation forte",
      comment:
        "L'écart entre vos deux graphiques est important : le comportement que vous montrez au travail diffère nettement de votre fonctionnement naturel. Cette adaptation est une compétence, mais elle a un coût en énergie. Si elle dure, elle est une cause classique de fatigue professionnelle : il vaut la peine d'identifier quelle exigence de votre poste vous demande cet effort.",
    };
  }
  if (gap >= 30) {
    return {
      label: "Adaptation modérée",
      comment:
        "Vous ajustez votre comportement à votre contexte professionnel sans vous éloigner de votre fonctionnement naturel. C'est la situation la plus fréquente et la plus confortable : l'effort d'adaptation reste soutenable dans la durée.",
    };
  }
  return {
    label: "Adaptation faible",
    comment:
      "Vos deux graphiques sont très proches : vous vous comportez au travail comme vous fonctionnez naturellement. C'est le signe d'un poste aligné avec votre profil. Vérifiez seulement que cette absence d'ajustement ne traduit pas une faible souplesse face à des interlocuteurs de profils différents.",
  };
}

export function computeDiscResult(answers: DiscAnswers): DiscResult {
  const rawMost = emptyScores();
  const rawLeast = emptyScores();

  for (const question of DISC_QUESTIONS) {
    const answer = answers[question.id];
    if (!answer) continue;
    if (answer.most) rawMost[answer.most] += 1;
    if (answer.least) rawLeast[answer.least] += 1;
  }

  const masque = emptyScores();
  const moteur = emptyScores();
  const synthese = emptyScores();

  for (const dimension of DIMENSION_ORDER) {
    // « Le plus » : plus la dimension est choisie, plus le score monte.
    masque[dimension] = round(clamp((rawMost[dimension] / FULL_SCALE) * 100));
    // « Le moins » : plus la dimension est rejetée, plus le score descend.
    moteur[dimension] = round(clamp(((FULL_SCALE - rawLeast[dimension]) / FULL_SCALE) * 100));
    synthese[dimension] = round((masque[dimension] + moteur[dimension]) / 2);
  }

  const { ranking, primary, secondary, profile } = resolveProfile(synthese);

  const intensities: DiscIntensity[] = DIMENSION_ORDER.map((dimension) => ({
    dimension,
    score: synthese[dimension],
    level: intensityLevel(synthese[dimension]),
    comment: intensityComment(dimension, synthese[dimension]),
  }));

  const adaptationGap = DIMENSION_ORDER.reduce(
    (total, dimension) => total + Math.abs(masque[dimension] - moteur[dimension]),
    0,
  );
  const { label, comment } = adaptationText(adaptationGap);

  const graphs: DiscGraph[] = [
    {
      id: "masque",
      title: "Graphique 1 — Le masque",
      subtitle: "Comportement adapté, tel que vous le montrez au travail",
      explanation:
        "Construit à partir des adjectifs choisis comme « le plus ». Il décrit le comportement que vous pensez devoir adopter dans votre environnement professionnel : votre rôle perçu.",
      scores: masque,
    },
    {
      id: "moteur",
      title: "Graphique 2 — Le moteur",
      subtitle: "Comportement naturel, celui qui ressort sous pression",
      explanation:
        "Construit à partir des adjectifs rejetés comme « le moins ». Moins contrôlé que le premier, il décrit votre fonctionnement instinctif, celui qui apparaît en situation de fatigue ou de tension.",
      scores: moteur,
    },
    {
      id: "synthese",
      title: "Graphique 3 — La synthèse",
      subtitle: "Votre profil de référence",
      explanation:
        "Moyenne des deux graphiques précédents. C'est le graphique de référence pour identifier votre profil et les axes de développement qui en découlent.",
      scores: synthese,
    },
  ];

  return {
    rawMost,
    rawLeast,
    masque,
    moteur,
    synthese,
    graphs,
    ranking,
    primary,
    secondary,
    profile,
    intensities,
    adaptationGap,
    adaptationLabel: label,
    adaptationComment: comment,
  };
}
