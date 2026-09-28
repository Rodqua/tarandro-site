/**
 * Questionnaire DISC en choix forcé (format "ipsatif" de Marston / Clarke).
 *
 * 28 groupes de 4 adjectifs. Dans chaque groupe l'utilisateur désigne :
 *  - l'adjectif qui lui RESSEMBLE LE PLUS  -> alimente le graphique "Masque"
 *  - l'adjectif qui lui RESSEMBLE LE MOINS -> alimente le graphique "Moteur"
 *
 * Chaque groupe contient exactement un adjectif par dimension (D, I, S, C),
 * ce qui garantit l'équilibre du questionnaire : 28 occurrences par dimension.
 */

import { DISC_WORD_HELP } from "./definitions";

export type DiscDimension = "D" | "I" | "S" | "C";

export interface DiscWord {
  /** Identifiant stable (utilisé pour la persistance des réponses) */
  id: string;
  label: string;
  dimension: DiscDimension;
  /** Définition neutre de l'adjectif, affichée à la demande */
  definition: string;
  /** Situation professionnelle illustrant l'adjectif */
  example: string;
}

export interface DiscQuestion {
  id: number;
  words: DiscWord[];
}

const RAW_GROUPS: [string, string, string, string][] = [
  ["décidé", "enthousiaste", "patient", "précis"],
  ["direct", "sociable", "loyal", "méthodique"],
  ["combatif", "expressif", "calme", "analytique"],
  ["audacieux", "optimiste", "conciliant", "prudent"],
  ["compétitif", "persuasif", "serviable", "logique"],
  ["fonceur", "démonstratif", "posé", "rigoureux"],
  ["volontaire", "chaleureux", "constant", "exact"],
  ["ferme", "spontané", "fidèle", "perfectionniste"],
  ["entreprenant", "communicatif", "prévenant", "factuel"],
  ["résolu", "jovial", "discret", "organisé"],
  ["tranchant", "charismatique", "régulier", "critique"],
  ["énergique", "convaincant", "modeste", "réfléchi"],
  ["indépendant", "extraverti", "coopératif", "ordonné"],
  ["affirmé", "animé", "tranquille", "objectif"],
  ["autoritaire", "enjoué", "attentionné", "minutieux"],
  ["offensif", "influent", "fiable", "systématique"],
  ["pionnier", "imaginatif", "persévérant", "sceptique"],
  ["impatient", "exubérant", "accommodant", "discipliné"],
  ["franc", "populaire", "doux", "consciencieux"],
  ["conquérant", "entraînant", "bienveillant", "pointilleux"],
  ["décisif", "impulsif", "paisible", "rationnel"],
  ["meneur", "théâtral", "réservé", "structuré"],
  ["intrépide", "sympathique", "dévoué", "scrupuleux"],
  ["radical", "vivant", "aimable", "détaillé"],
  ["exigeant", "insouciant", "serein", "conformiste"],
  ["provocateur", "séduisant", "altruiste", "vérificateur"],
  ["dominant", "spirituel", "compréhensif", "circonspect"],
  ["ambitieux", "bavard", "disponible", "nuancé"],
];

const ORDER: DiscDimension[] = ["D", "I", "S", "C"];

/**
 * Ordre d'affichage pseudo-aléatoire mais déterministe : on fait tourner les
 * quatre adjectifs d'un cran à chaque groupe pour que la dimension D ne soit
 * pas systématiquement en première position (biais de position).
 */
export const DISC_QUESTIONS: DiscQuestion[] = RAW_GROUPS.map((group, index) => {
  const words: DiscWord[] = group.map((label, position) => {
    const help = DISC_WORD_HELP[label];
    if (!help) {
      // Garde-fou : un adjectif sans définition serait affiché sans aide.
      throw new Error(`Définition manquante pour l'adjectif « ${label} »`);
    }
    return {
      id: `q${index + 1}-${ORDER[position]}`,
      label,
      dimension: ORDER[position],
      definition: help.definition,
      example: help.example,
    };
  });

  const offset = index % 4;
  const rotated = [...words.slice(offset), ...words.slice(0, offset)];

  return { id: index + 1, words: rotated };
});

export const TOTAL_QUESTIONS = DISC_QUESTIONS.length;
