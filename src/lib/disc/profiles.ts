import type { DiscDimension } from "./questions";

export interface DiscProfile {
  key: string;
  name: string;
  subtitle: string;
  letters: DiscDimension[];
  /** Une phrase de synthèse */
  headline: string;
  description: string[];
  forces: string[];
  limites: string[];
  moteurs: string[];
  stress: string;
  communiquer: string[];
  aEviter: string[];
  environnement: string[];
  developpement: string[];
  roles: string[];
}

/**
 * Les « patterns classiques » du modèle DISC : 4 profils purs, 12 combinaisons
 * de deux dimensions, plus un profil équilibré. La clé correspond à la
 * dimension dominante suivie de la dimension secondaire (ex. « DI » =
 * Dominance haute, Influence en appui).
 */
export const DISC_PROFILES: Record<string, DiscProfile> = {
  D: {
    key: "D",
    name: "Le Réalisateur",
    subtitle: "Dominance marquée",
    letters: ["D"],
    headline:
      "Vous avancez vite, vous décidez seul si nécessaire et vous jugez une situation à son résultat.",
    description: [
      "Votre énergie est tournée vers l'action. Face à un problème, votre premier réflexe n'est pas d'analyser longuement ni de consulter : c'est de trancher pour débloquer la situation. Vous acceptez le risque d'erreur, parce qu'à vos yeux l'immobilisme coûte plus cher qu'une décision imparfaite que l'on corrigera en route.",
      "Ce fonctionnement vous rend précieux dans les contextes d'urgence, de redressement ou de lancement. Il a une contrepartie : votre rythme et votre franchise peuvent être vécus comme de la brusquerie. Ce que vous percevez comme de l'efficacité, un interlocuteur plus Stable ou plus Conforme le perçoit souvent comme une pression, voire un manque de considération.",
    ],
    forces: [
      "Décision rapide, même en information incomplète",
      "Capacité à porter une responsabilité seul",
      "Ne recule pas devant le conflit utile",
      "Orientation résultat très lisible pour l'équipe",
    ],
    limites: [
      "Impatience face aux processus et aux explications",
      "Écoute courte, peut couper la parole",
      "Tendance à décider sans associer les personnes concernées",
      "Sous-estime l'impact émotionnel de ses arbitrages",
    ],
    moteurs: ["Le défi", "L'autonomie", "Le résultat mesurable", "La compétition"],
    stress:
      "Sous tension, vous durcissez : ton plus sec, contrôle accru, décisions unilatérales. Le premier signal à surveiller est la disparition des questions dans votre équipe.",
    communiquer: [
      "Annoncez la conclusion d'abord, les détails ensuite",
      "Restez bref et factuel, proposez des options plutôt qu'une seule voie",
      "Parlez en termes de gain, de délai et de résultat",
    ],
    aEviter: [
      "Les longues mises en contexte avant d'arriver au sujet",
      "Le flou sur les responsabilités et les échéances",
      "Les décisions repoussées sans date",
    ],
    environnement: [
      "Objectifs clairs et marge de manœuvre réelle",
      "Peu de niveaux de validation",
      "Des sujets nouveaux à défricher",
    ],
    developpement: [
      "Reformuler avant de répondre : gagner 30 secondes d'écoute",
      "Expliciter le « pourquoi » d'une décision, pas seulement le « quoi »",
      "Distinguer l'urgent de l'important avant d'accélérer",
    ],
    roles: [
      "Direction générale, direction de site",
      "Gestion de crise, retournement d'activité",
      "Création d'activité, développement commercial grands comptes",
    ],
  },
  DI: {
    key: "DI",
    name: "Le Motivateur",
    subtitle: "Dominance dominante, Influence en appui",
    letters: ["D", "I"],
    headline:
      "Vous entraînez un groupe derrière un objectif ambitieux, en combinant fermeté et énergie communicative.",
    description: [
      "Vous décidez vite, comme un profil D pur, mais vous ne décidez pas dans le silence : vous embarquez. Votre conviction est contagieuse, vous savez mettre en mouvement des personnes qui n'étaient pas convaincues au départ, et vous tenez le cap une fois l'objectif annoncé.",
      "Le risque de ce profil est l'emballement. Votre capacité à convaincre peut vous faire prendre des engagements avant d'en avoir vérifié la faisabilité, et votre énergie peut épuiser une équipe plus posée. Vous avez besoin, à vos côtés, d'un profil analytique qui pose les chiffres sans se laisser impressionner.",
    ],
    forces: [
      "Leadership visible, capacité à fédérer vite",
      "Aisance à porter un discours devant un auditoire",
      "Prise de décision assumée publiquement",
      "Résistance aux objections",
    ],
    limites: [
      "Optimisme excessif sur les délais et les moyens",
      "Détails et suivi d'exécution délaissés",
      "Peut imposer son rythme sans s'en apercevoir",
      "Écoute sélective : entend surtout ce qui confirme le cap",
    ],
    moteurs: [
      "La reconnaissance du résultat",
      "L'influence",
      "Les projets visibles",
      "Le mouvement",
    ],
    stress:
      "Sous pression, vous montez en volume : plus d'annonces, plus de promesses, moins de vérifications. Le signal d'alerte est l'écart qui se creuse entre ce qui est annoncé et ce qui est livré.",
    communiquer: [
      "Allez vite, mais laissez de la place à l'échange",
      "Reconnaissez explicitement le résultat obtenu",
      "Challengez les chiffres, pas l'ambition",
    ],
    aEviter: [
      "Le pessimisme de principe",
      "Les process présentés sans finalité",
      "L'anonymat du travail fourni",
    ],
    environnement: [
      "Projets de transformation à animer",
      "Contact fréquent avec des interlocuteurs variés",
      "Liberté d'initiative",
    ],
    developpement: [
      "Chiffrer avant d'annoncer",
      "Déléguer le suivi d'exécution à un profil rigoureux, et respecter son avis",
      "Vérifier l'adhésion réelle, au-delà du silence approbateur",
    ],
    roles: [
      "Direction commerciale, direction de business unit",
      "Conduite du changement",
      "Entrepreneuriat, développement de réseau",
    ],
  },
  DS: {
    key: "DS",
    name: "Le Déterminé",
    subtitle: "Dominance dominante, Stabilité en appui",
    letters: ["D", "S"],
    headline:
      "Vous menez sans bruit : exigeant sur le résultat, régulier dans l'effort, peu sensible à la contradiction.",
    description: [
      "Cette combinaison est peu fréquente, car elle associe deux moteurs opposés : l'impulsion de la Dominance et la constance de la Stabilité. Le résultat est une force tranquille. Vous vous fixez un cap, vous ne le lâchez pas, et vous n'avez pas besoin d'être vu pour avancer.",
      "Votre point de vigilance est l'entêtement. Là où un profil D pur change d'avis dès que la situation change, vous pouvez persister longtemps dans une direction devenue inadaptée, simplement parce que vous vous y êtes engagé. Votre réserve peut aussi faire croire à un accord alors que vous avez déjà tranché intérieurement.",
    ],
    forces: [
      "Tenue de l'effort dans la durée",
      "Fermeté sans agressivité apparente",
      "Fiabilité sur les engagements pris",
      "Sang-froid dans les situations tendues",
    ],
    limites: [
      "Rigidité une fois la décision prise",
      "Communique peu ses intentions",
      "Difficulté à reconnaître un changement de contexte",
      "Peut accumuler les non-dits avant de trancher brutalement",
    ],
    moteurs: [
      "L'accomplissement concret",
      "La maîtrise de son domaine",
      "L'autonomie",
      "Le travail bien fini",
    ],
    stress:
      "Sous tension, vous vous fermez : moins d'échanges, plus de contrôle silencieux. Le signal d'alerte est la décision annoncée sans discussion préalable.",
    communiquer: [
      "Laissez-lui le temps d'exposer sa position jusqu'au bout",
      "Appuyez-vous sur des faits et un historique",
      "Annoncez les changements à l'avance, avec leur raison",
    ],
    aEviter: [
      "Les revirements permanents",
      "La pression sur le rythme",
      "Les remises en cause publiques",
    ],
    environnement: [
      "Périmètre clair dont il est pleinement responsable",
      "Objectifs stables dans le temps",
      "Peu d'interruptions",
    ],
    developpement: [
      "Réinterroger volontairement une décision à intervalle fixe",
      "Verbaliser ses désaccords tôt plutôt que tard",
      "Associer l'équipe en amont, pas au moment de l'annonce",
    ],
    roles: [
      "Direction technique, direction de production",
      "Responsable d'exploitation",
      "Pilotage de projets longs",
    ],
  },
  DC: {
    key: "DC",
    name: "Le Challenger",
    subtitle: "Dominance dominante, Conformité en appui",
    letters: ["D", "C"],
    headline:
      "Vous exigez à la fois la vitesse et la justesse : vous tranchez vite, mais sur des données solides.",
    description: [
      "Vous combinez l'orientation résultat de la Dominance et la rigueur de la Conformité. Cela vous rend redoutable en analyse critique : vous repérez immédiatement l'incohérence d'un raisonnement, la faille d'un dossier, l'engagement qui ne tiendra pas. Vos décisions sont rarement contestables sur le fond.",
      "La contrepartie est une exigence qui peut devenir dure. Vous jugez vite et vous le montrez. Les personnes qui travaillent avec vous perçoivent souvent la critique avant la reconnaissance, et peuvent finir par ne plus prendre d'initiative de peur d'être reprises.",
    ],
    forces: [
      "Esprit critique et détection rapide des failles",
      "Décisions documentées et défendables",
      "Très haut niveau d'exigence sur la qualité",
      "Indépendance de jugement",
    ],
    limites: [
      "Peu de patience avec l'approximation et l'improvisation",
      "Critique plus visible que la reconnaissance",
      "Difficulté à déléguer sans contrôler",
      "Relationnel considéré comme secondaire",
    ],
    moteurs: ["L'excellence", "La maîtrise technique", "Le résultat juste", "L'indépendance"],
    stress:
      "Sous pression, vous devenez cassant et vous reprenez la main sur tout. Le signal d'alerte est la baisse d'initiative autour de vous.",
    communiquer: [
      "Venez préparé : chiffres, sources, hypothèses",
      "Acceptez la contradiction argumentée, elle est constructive",
      "Séparez clairement les faits des opinions",
    ],
    aEviter: [
      "Les approximations",
      "Les arguments purement émotionnels",
      "Les engagements non tenus",
    ],
    environnement: [
      "Sujets complexes à fort enjeu technique",
      "Exigence de qualité reconnue",
      "Interlocuteurs compétents",
    ],
    developpement: [
      "Formuler un retour positif avant le point d'amélioration",
      "Accepter un livrable « suffisant » quand l'enjeu le permet",
      "Expliciter le niveau d'exigence attendu, au lieu de corriger après",
    ],
    roles: [
      "Direction qualité, audit, contrôle interne",
      "Direction de projets techniques",
      "Conseil, expertise, restructuration",
    ],
  },
  I: {
    key: "I",
    name: "Le Communicant",
    subtitle: "Influence marquée",
    letters: ["I"],
    headline:
      "Vous créez du lien et de l'élan : votre énergie relationnelle est votre principal levier d'action.",
    description: [
      "Vous fonctionnez à la relation. Un projet devient intéressant quand il y a des personnes autour, un dossier avance quand vous pouvez en parler, une difficulté se résout en allant voir quelqu'un. Vous êtes spontanément optimiste, ce qui permet à un groupe de repartir après un échec.",
      "Votre vigilance porte sur la tenue dans la durée : l'enthousiasme du lancement ne suffit pas à finir. Vous pouvez aussi surestimer l'accord obtenu — un échange chaleureux n'est pas un engagement écrit — et vous disperser entre plusieurs sujets attirants.",
    ],
    forces: [
      "Contact facile et sincère avec tous types d'interlocuteurs",
      "Capacité à convaincre et à réconcilier",
      "Optimisme mobilisateur",
      "Aisance à l'oral, même improvisée",
    ],
    limites: [
      "Suivi et détails négligés",
      "Difficulté à travailler seul et longtemps",
      "Engagements pris trop vite",
      "Sensibilité forte à la critique et au rejet",
    ],
    moteurs: ["La reconnaissance", "Le contact humain", "La variété", "L'ambiance"],
    stress:
      "Sous tension, vous parlez plus et structurez moins ; vous pouvez chercher des alliés plutôt que des solutions. Le signal d'alerte est la multiplication des chantiers ouverts et non terminés.",
    communiquer: [
      "Laissez de la place à l'échange avant d'entrer dans le fond",
      "Reconnaissez la contribution avant de corriger",
      "Formalisez par écrit ce qui a été décidé",
    ],
    aEviter: [
      "Les échanges purement transactionnels",
      "La critique publique",
      "Le travail isolé sur longue durée",
    ],
    environnement: [
      "Travail en équipe et en réseau",
      "Missions variées, contacts nombreux",
      "Reconnaissance exprimée régulièrement",
    ],
    developpement: [
      "Se doter d'un système de suivi simple et s'y tenir",
      "Terminer avant d'ouvrir un nouveau sujet",
      "Distinguer l'adhésion exprimée de l'engagement réel",
    ],
    roles: [
      "Commercial, développement, relation client",
      "Communication, marketing, événementiel",
      "Formation, animation, recrutement",
    ],
  },
  ID: {
    key: "ID",
    name: "Le Persuadeur",
    subtitle: "Influence dominante, Dominance en appui",
    letters: ["I", "D"],
    headline:
      "Vous obtenez l'accord des autres par la conviction, et vous savez conclure quand il faut décider.",
    description: [
      "Vous êtes d'abord dans la relation, mais vous ne vous arrêtez pas au consensus : quand une décision doit être prise, vous la prenez. Cette combinaison est typique des profils qui vendent, négocient et conduisent des projets impliquant de nombreux acteurs à convaincre.",
      "Votre vigilance : la séduction peut prendre le pas sur le fond. Vous avez tendance à investir l'énergie là où le retour relationnel est immédiat, et à délaisser les sujets ingrats. La rigueur du suivi ne viendra pas naturellement — il faut l'organiser.",
    ],
    forces: [
      "Capacité de négociation et de conclusion",
      "Aisance en environnement concurrentiel",
      "Grande énergie, résistance aux refus",
      "Sait créer des alliances rapidement",
    ],
    limites: [
      "Peut promettre au-delà du réalisable",
      "Faible appétence pour l'administratif et le détail",
      "Impatience quand l'interlocuteur ne suit pas",
      "Attention volatile d'un sujet à l'autre",
    ],
    moteurs: ["Gagner", "Être reconnu", "Convaincre", "La nouveauté"],
    stress:
      "Sous pression, vous forcez : plus d'insistance, plus de promesses, moins d'écoute. Le signal d'alerte est un interlocuteur qui dit oui pour clore l'échange.",
    communiquer: [
      "Soyez direct et dynamique",
      "Valorisez le résultat obtenu et la personne",
      "Cadrez par écrit les engagements réciproques",
    ],
    aEviter: [
      "Les procédures sans enjeu visible",
      "La lenteur",
      "Le manque de reconnaissance",
    ],
    environnement: [
      "Objectifs ambitieux et challenge commercial",
      "Autonomie de terrain",
      "Visibilité des résultats",
    ],
    developpement: [
      "Ne promettre que ce qui est validé en interne",
      "S'appuyer sur un binôme rigoureux pour le suivi",
      "Écouter l'objection jusqu'au bout avant de répondre",
    ],
    roles: [
      "Direction commerciale, négociation grands comptes",
      "Développement de partenariats, relations publiques",
      "Animation de réseau, franchise",
    ],
  },
  IS: {
    key: "IS",
    name: "Le Conseiller",
    subtitle: "Influence dominante, Stabilité en appui",
    letters: ["I", "S"],
    headline:
      "Vous créez un climat de confiance : chaleureux, disponible, attentif à ce que chacun se sente à sa place.",
    description: [
      "Vous associez la chaleur de l'Influence à la constance de la Stabilité. Les autres viennent vous parler, se confient et repartent rassurés. Vous êtes souvent le liant informel d'une équipe, celui ou celle qui perçoit une tension avant qu'elle ne s'exprime.",
      "Votre difficulté est le désaccord. Vous voulez à la fois être apprécié et préserver l'harmonie, ce qui vous conduit à accepter des choses que vous ne pensez pas, ou à différer un message difficile. À la longue, cela produit des situations que vous subissez.",
    ],
    forces: [
      "Grande qualité d'écoute et empathie réelle",
      "Crée la confiance durablement",
      "Apaise les tensions dans un groupe",
      "Fiable et accessible",
    ],
    limites: [
      "Évite le conflit et les messages difficiles",
      "Dit difficilement non",
      "Priorise selon les demandes reçues plutôt que selon les enjeux",
      "Prend personnellement les critiques",
    ],
    moteurs: ["Être utile", "L'harmonie relationnelle", "La reconnaissance sincère", "La confiance"],
    stress:
      "Sous tension, vous vous suradaptez : vous acceptez, vous absorbez, puis vous vous épuisez. Le signal d'alerte est une charge de travail qui augmente sans que vous l'ayez demandée.",
    communiquer: [
      "Prenez le temps du contact avant le sujet",
      "Demandez explicitement son avis, il ne s'imposera pas",
      "Formulez les désaccords sur les faits, jamais sur la personne",
    ],
    aEviter: [
      "L'agressivité",
      "Les changements annoncés sans explication",
      "L'indifférence",
    ],
    environnement: [
      "Équipe stable et bienveillante",
      "Mission au service des personnes",
      "Cadre clair et rythme soutenable",
    ],
    developpement: [
      "S'entraîner à formuler un désaccord simple, tôt",
      "Poser des limites explicites sur la charge",
      "Séparer la critique du travail de la critique de soi",
    ],
    roles: [
      "Ressources humaines, accompagnement, médiation",
      "Relation client, service, santé, social",
      "Formation, tutorat, intégration",
    ],
  },
  IC: {
    key: "IC",
    name: "L'Évaluateur",
    subtitle: "Influence dominante, Conformité en appui",
    letters: ["I", "C"],
    headline:
      "Vous convainquez avec des arguments solides : l'aisance relationnelle au service d'un raisonnement construit.",
    description: [
      "Combinaison peu fréquente et précieuse : vous savez vulgariser un sujet complexe sans le déformer. Vous préparez, vous vérifiez, puis vous portez le message avec conviction. On vous écoute parce que vous êtes à la fois crédible et accessible.",
      "La tension interne de ce profil est réelle : le besoin de plaire et le besoin d'avoir raison ne tirent pas toujours dans le même sens. Vous pouvez hésiter entre dire ce qui est juste et dire ce qui sera bien reçu, et vivre mal la critique publique d'un travail que vous savez rigoureux.",
    ],
    forces: [
      "Capacité à expliquer et à rendre lisible le complexe",
      "Argumentation préparée et documentée",
      "Bon niveau d'exigence sans rigidité",
      "Diplomatie dans les sujets sensibles",
    ],
    limites: [
      "Hésite entre l'exactitude et l'harmonie",
      "Sensible à la critique sur le fond comme sur la forme",
      "Peut sur-préparer avant d'oser trancher",
      "Difficulté à porter une décision impopulaire",
    ],
    moteurs: ["Être reconnu compétent", "Transmettre", "La qualité du raisonnement", "L'estime des pairs"],
    stress:
      "Sous tension, vous vous justifiez : vous ajoutez de l'argument là où il faudrait décider. Le signal d'alerte est l'allongement des échanges sans conclusion.",
    communiquer: [
      "Appuyez-vous sur les faits, mais soignez la forme",
      "Reconnaissez la qualité du travail fourni",
      "Donnez-lui le temps de préparer avant de le solliciter",
    ],
    aEviter: [
      "La remise en cause publique",
      "L'improvisation imposée",
      "Le désordre méthodologique",
    ],
    environnement: [
      "Sujets techniques à expliquer ou à transmettre",
      "Exigence de qualité et interlocuteurs compétents",
      "Temps de préparation respecté",
    ],
    developpement: [
      "Accepter de déplaire quand le fond l'exige",
      "Limiter la préparation par un délai fixé d'avance",
      "Distinguer désaccord professionnel et rejet personnel",
    ],
    roles: [
      "Formation, ingénierie pédagogique",
      "Conseil, avant-vente technique",
      "Communication technique, qualité, conformité",
    ],
  },
  S: {
    key: "S",
    name: "Le Soutien",
    subtitle: "Stabilité marquée",
    letters: ["S"],
    headline:
      "Vous êtes le point stable du collectif : régulier, fiable, attentif, difficile à déstabiliser.",
    description: [
      "Votre valeur se lit dans la durée. Vous tenez vos engagements, vous absorbez les tensions, vous rendez un travail constant sans avoir besoin qu'on vous relance. Dans une équipe, vous êtes souvent celui ou celle dont on mesure l'importance le jour où la personne n'est plus là.",
      "Votre point de vigilance est l'affirmation de vos propres besoins. Vous privilégiez l'harmonie, donc vous acceptez, vous encaissez, et vous ne dites que très tard que la situation ne vous convient pas. Le changement imposé sans préparation vous coûte plus qu'il n'y paraît de l'extérieur.",
    ],
    forces: [
      "Fiabilité et régularité exemplaires",
      "Écoute patiente et réelle",
      "Sang-froid dans la tension",
      "Loyauté envers l'équipe et l'organisation",
    ],
    limites: [
      "Résistance passive au changement",
      "Exprime tardivement ses désaccords",
      "Difficulté à prioriser face à des demandes multiples",
      "Peut s'effacer au détriment de ses propres besoins",
    ],
    moteurs: [
      "La sécurité",
      "L'utilité aux autres",
      "La confiance installée",
      "Le travail bien fait sans précipitation",
    ],
    stress:
      "Sous tension, vous vous taisez et vous continuez, jusqu'à la rupture. Le signal d'alerte est un retrait progressif plutôt qu'une plainte.",
    communiquer: [
      "Annoncez le changement à l'avance et expliquez le pourquoi",
      "Sollicitez son avis directement, il ne le donnera pas spontanément",
      "Restez calme : le ton compte autant que le contenu",
    ],
    aEviter: [
      "Les urgences permanentes",
      "Les réorganisations non expliquées",
      "L'agressivité et le conflit ouvert",
    ],
    environnement: [
      "Cadre stable, rôles clairs",
      "Équipe durable et relations de confiance",
      "Charge prévisible",
    ],
    developpement: [
      "Exprimer un besoin ou un désaccord dans la semaine, pas dans le trimestre",
      "Négocier les priorités au lieu de tout accepter",
      "Se préparer au changement en petites étapes choisies",
    ],
    roles: [
      "Administration, gestion, back-office",
      "Support, service client, soin, accompagnement",
      "Coordination d'équipe, qualité au quotidien",
    ],
  },
  SD: {
    key: "SD",
    name: "L'Agent de réalisation",
    subtitle: "Stabilité dominante, Dominance en appui",
    letters: ["S", "D"],
    headline: "Vous finissez ce que vous commencez : calme dans la forme, ferme sur le fond.",
    description: [
      "Vous avez la régularité de la Stabilité et, en réserve, la fermeté de la Dominance. Vous n'élevez pas la voix, mais vous ne cédez pas non plus. Vous êtes particulièrement efficace sur des chantiers qui demandent de la constance et de la résistance aux distractions.",
      "Votre vigilance porte sur la souplesse. Vous supportez mal qu'on modifie un plan en cours de route, et votre fermeté peut se transformer en résistance passive : vous continuez comme prévu sans discuter la nouvelle consigne.",
    ],
    forces: [
      "Va au bout des sujets, même ingrats",
      "Calme sous pression",
      "Fermeté sans agressivité",
      "Engagements tenus",
    ],
    limites: [
      "Résistance aux changements de cap",
      "Peut s'isoler dans sa manière de faire",
      "Exprime peu ses désaccords",
      "Difficulté à lâcher une tâche mal engagée",
    ],
    moteurs: [
      "Terminer",
      "La maîtrise de son périmètre",
      "La reconnaissance du travail accompli",
      "La stabilité",
    ],
    stress:
      "Sous tension, vous vous refermez et poursuivez votre plan initial. Le signal d'alerte est l'absence de question sur une nouvelle consigne.",
    communiquer: [
      "Expliquez le pourquoi du changement, pas seulement le quoi",
      "Laissez un délai d'appropriation",
      "Reconnaissez le travail déjà réalisé avant de le réorienter",
    ],
    aEviter: [
      "Les changements de priorité fréquents",
      "La pression sur le rythme",
      "Les décisions non expliquées",
    ],
    environnement: [
      "Périmètre identifié et durable",
      "Objectifs stables",
      "Autonomie d'exécution",
    ],
    developpement: [
      "Accepter de suspendre une tâche sans la vivre comme un échec",
      "Verbaliser le désaccord au lieu de le contourner",
      "Demander explicitement les arbitrages de priorité",
    ],
    roles: [
      "Responsable d'exploitation, chef d'atelier",
      "Gestion de projet d'infrastructure",
      "Qualité, métrologie, maintenance",
    ],
  },
  SI: {
    key: "SI",
    name: "L'Accompagnateur",
    subtitle: "Stabilité dominante, Influence en appui",
    letters: ["S", "I"],
    headline:
      "Vous prenez soin du collectif : présent, chaleureux, constant, très bon révélateur des autres.",
    description: [
      "Vous combinez la fiabilité de la Stabilité et la chaleur de l'Influence. Vous êtes la personne vers qui on va quand quelque chose ne va pas, et vous savez faire progresser quelqu'un sans le brusquer. Votre patience pédagogique est une compétence rare.",
      "Votre point de vigilance : la difficulté à trancher et à assumer un message dur. Vous privilégiez la relation à l'arbitrage, ce qui peut laisser des situations s'installer. En position d'encadrement, vous devez apprendre à porter une décision que tout le monde n'approuvera pas.",
    ],
    forces: [
      "Écoute et patience pédagogique",
      "Sait faire progresser et sécuriser les autres",
      "Cohésion d'équipe durable",
      "Loyauté et disponibilité",
    ],
    limites: [
      "Reporte les décisions difficiles",
      "Évite la confrontation",
      "Peut protéger les personnes au détriment du résultat",
      "Se charge de trop de demandes",
    ],
    moteurs: ["Le collectif", "Être utile", "La confiance", "La reconnaissance sincère"],
    stress:
      "Sous tension, vous cherchez l'apaisement plutôt que la solution. Le signal d'alerte est un problème connu de tous et traité par personne.",
    communiquer: [
      "Prenez le temps du lien avant le sujet",
      "Demandez son avis et attendez la réponse",
      "Traitez les désaccords en tête-à-tête",
    ],
    aEviter: [
      "Le conflit frontal",
      "Les injonctions sans explication",
      "L'instabilité du cadre",
    ],
    environnement: [
      "Équipe stable, climat respectueux",
      "Mission d'accompagnement des personnes",
      "Rythme soutenable",
    ],
    developpement: [
      "Fixer une date pour les décisions difficiles et s'y tenir",
      "Distinguer bienveillance et évitement",
      "Dire non avec une alternative plutôt que d'accepter par défaut",
    ],
    roles: [
      "Management de proximité, tutorat",
      "Ressources humaines, formation",
      "Santé, social, service client",
    ],
  },
  SC: {
    key: "SC",
    name: "Le Spécialiste",
    subtitle: "Stabilité dominante, Conformité en appui",
    letters: ["S", "C"],
    headline:
      "Vous construisez une expertise solide dans la durée : méthodique, fiable, discret, difficile à prendre en défaut.",
    description: [
      "Vous cherchez la maîtrise réelle plutôt que l'effet. Vous approfondissez, vous documentez, vous stabilisez vos manières de faire — et au bout de quelques années vous êtes la référence du sujet. Les organisations reposent largement sur ce type de profil, souvent sans le dire.",
      "Votre vigilance porte sur le changement et la visibilité. Vous avez besoin de comprendre avant d'adhérer, ce qui peut être lu comme une résistance. Et comme vous ne mettez pas votre travail en avant, votre contribution peut rester sous-évaluée.",
    ],
    forces: [
      "Expertise approfondie et fiable",
      "Méthode, traçabilité, constance",
      "Calme et absence d'esbroufe",
      "Anticipation des erreurs",
    ],
    limites: [
      "Adaptation lente aux changements de méthode",
      "Prudence qui peut freiner la décision",
      "Met peu son travail en valeur",
      "Difficulté à déléguer un travail exigeant",
    ],
    moteurs: [
      "La maîtrise",
      "La qualité",
      "La sécurité du cadre",
      "La reconnaissance de l'expertise",
    ],
    stress:
      "Sous tension, vous vous replongez dans la vérification et le détail pour reprendre le contrôle. Le signal d'alerte est un travail refait plusieurs fois.",
    communiquer: [
      "Donnez les informations complètes et le calendrier",
      "Justifiez les changements par les faits",
      "Laissez du temps entre la demande et la décision",
    ],
    aEviter: [
      "Le « faites-moi confiance » sans éléments",
      "Les urgences imposées",
      "La critique de la méthode en public",
    ],
    environnement: [
      "Domaine d'expertise stable",
      "Procédures claires et outils fiables",
      "Temps compatible avec le niveau de qualité attendu",
    ],
    developpement: [
      "Fixer un seuil de « suffisamment bon » avant de commencer",
      "Rendre visible sa contribution (synthèses, points réguliers)",
      "Tester un changement à petite échelle au lieu de l'évaluer longtemps",
    ],
    roles: [
      "Qualité, HSE, conformité réglementaire",
      "Comptabilité, gestion, juridique",
      "Technique, laboratoire, méthodes, informatique",
    ],
  },
  C: {
    key: "C",
    name: "L'Analyste",
    subtitle: "Conformité marquée",
    letters: ["C"],
    headline:
      "Vous cherchez la justesse : vous vérifiez, structurez et argumentez avant de vous engager.",
    description: [
      "Votre exigence porte sur la qualité du raisonnement et du livrable. Vous n'affirmez que ce que vous pouvez étayer, vous anticipez les objections, vous repérez les incohérences que les autres n'ont pas vues. Sur les sujets à fort enjeu, cette rigueur évite des erreurs coûteuses.",
      "Votre vigilance porte sur le temps et la relation. La recherche de certitude peut retarder une décision qui aurait pu être prise avec 80 % de l'information. Et votre expression très factuelle, sans enveloppe relationnelle, peut être reçue comme froide ou critique alors qu'elle est simplement précise.",
    ],
    forces: [
      "Rigueur, précision, fiabilité des analyses",
      "Anticipation des risques et des erreurs",
      "Argumentation solide et documentée",
      "Indépendance de jugement",
    ],
    limites: [
      "Décision différée par recherche de certitude",
      "Perfectionnisme coûteux en temps",
      "Communication perçue comme distante ou critique",
      "Difficulté avec l'improvisation et les consignes floues",
    ],
    moteurs: ["L'exactitude", "L'expertise", "Des règles claires", "La qualité reconnue"],
    stress:
      "Sous tension, vous vous retirez dans l'analyse et le détail, et vous vous protégez par la procédure. Le signal d'alerte est une décision qui n'arrive plus.",
    communiquer: [
      "Apportez des données, des sources et un cadre écrit",
      "Posez des questions précises et laissez le temps de répondre",
      "Critiquez le travail sur des faits, jamais la personne",
    ],
    aEviter: [
      "Les demandes floues",
      "La pression sur les délais sans arbitrage de qualité",
      "La familiarité excessive",
    ],
    environnement: [
      "Attentes explicites et critères de qualité définis",
      "Accès à l'information et aux procédures",
      "Temps d'analyse compatible avec l'exigence demandée",
    ],
    developpement: [
      "Se fixer un niveau d'information suffisant pour décider",
      "Ajouter une phrase de contexte relationnel aux messages factuels",
      "Distinguer les sujets qui méritent la perfection des autres",
    ],
    roles: [
      "Audit, contrôle, qualité, conformité",
      "Finance, analyse de données",
      "Ingénierie, recherche, méthodes",
    ],
  },
  CD: {
    key: "CD",
    name: "Le Concepteur exigeant",
    subtitle: "Conformité dominante, Dominance en appui",
    letters: ["C", "D"],
    headline:
      "Vous voulez la solution juste, et vous la faites appliquer : rigueur d'analyse, fermeté d'exécution.",
    description: [
      "Vous partez de l'analyse, mais vous ne vous arrêtez pas au diagnostic : vous tranchez et vous tenez la décision. C'est le profil typique de ceux qui refondent un système, un process, une organisation — et qui ne lâchent pas tant que le résultat n'est pas au niveau.",
      "Votre point de vigilance est l'impact humain. Vous raisonnez en logique de système, et les personnes peuvent avoir l'impression d'être des variables. Votre exigence, exprimée sans ménagement, décourage les profils plus sensibles.",
    ],
    forces: [
      "Analyse structurée suivie de décisions fermes",
      "Très haut niveau d'exigence tenu dans le temps",
      "Capacité à refondre un système en profondeur",
      "Résistance à la pression sociale",
    ],
    limites: [
      "Dureté perçue dans les relations",
      "Peu de place laissée à l'imprécision des autres",
      "Contrôle important, délégation difficile",
      "Peut négliger l'adhésion nécessaire au changement",
    ],
    moteurs: ["L'excellence du système", "La maîtrise", "La rationalité", "L'autonomie"],
    stress:
      "Sous tension, vous verrouillez : plus de procédures, plus de contrôle, moins d'échanges. Le signal d'alerte est une équipe qui exécute sans proposer.",
    communiquer: [
      "Venez avec un dossier solide et des hypothèses explicites",
      "Acceptez le débat sur le fond, il est attendu",
      "Formalisez les décisions et les critères de réussite",
    ],
    aEviter: [
      "Les arguments d'autorité",
      "Le travail bâclé",
      "Les changements de cap non justifiés",
    ],
    environnement: [
      "Sujets complexes à fort enjeu",
      "Mandat clair pour transformer",
      "Interlocuteurs compétents",
    ],
    developpement: [
      "Intégrer l'adhésion comme un livrable du projet, pas comme un supplément",
      "Doser le niveau d'exigence selon l'enjeu réel",
      "Reconnaître explicitement le travail conforme",
    ],
    roles: [
      "Direction qualité, direction des systèmes d'information",
      "Audit, conseil en organisation",
      "Ingénierie, architecture technique",
    ],
  },
  CI: {
    key: "CI",
    name: "Le Pédagogue rigoureux",
    subtitle: "Conformité dominante, Influence en appui",
    letters: ["C", "I"],
    headline:
      "Vous maîtrisez votre sujet et vous savez le transmettre : rigueur d'abord, aisance relationnelle ensuite.",
    description: [
      "Vous construisez d'abord la démonstration, puis vous la rendez accessible. Ce profil est fréquent chez les experts qui enseignent, auditent ou conseillent : la crédibilité vient du fond, l'adhésion vient de la forme, et vous savez faire les deux.",
      "Votre vigilance porte sur la confrontation et la charge de préparation. Vous voulez à la fois avoir raison et être bien reçu, ce qui peut vous amener à nuancer un message qui devrait être net, ou à préparer très au-delà du nécessaire.",
    ],
    forces: [
      "Rigueur associée à une réelle capacité de transmission",
      "Sait convaincre avec des faits",
      "Diplomatie sur les sujets sensibles",
      "Fiabilité des livrables",
    ],
    limites: [
      "Sur-préparation, difficulté à improviser",
      "Nuance excessive quand il faudrait être ferme",
      "Sensibilité à la critique du travail",
      "Peut éviter les arbitrages impopulaires",
    ],
    moteurs: ["La compétence reconnue", "Transmettre", "La qualité", "L'estime professionnelle"],
    stress:
      "Sous tension, vous ajoutez de la documentation et de l'explication au lieu de conclure. Le signal d'alerte est un dossier qui grossit sans se décider.",
    communiquer: [
      "Annoncez le cadre et l'objectif à l'avance",
      "Reconnaissez la qualité du travail avant de demander une inflexion",
      "Restez factuel, mais soignez la forme",
    ],
    aEviter: ["L'improvisation imposée", "La critique publique", "Les demandes sans cadre"],
    environnement: [
      "Expertise valorisée, sujets à expliquer",
      "Temps de préparation respecté",
      "Interlocuteurs exigeants et corrects",
    ],
    developpement: [
      "Limiter la préparation par une règle de temps",
      "Assumer un message net quand le fond l'exige",
      "Accepter de répondre « je vérifie » plutôt que de tout anticiper",
    ],
    roles: [
      "Formation, ingénierie pédagogique, audit",
      "Conseil, expertise technique, avant-vente",
      "Qualité, conformité, documentation",
    ],
  },
  CS: {
    key: "CS",
    name: "Le Méthodique",
    subtitle: "Conformité dominante, Stabilité en appui",
    letters: ["C", "S"],
    headline:
      "Vous produisez un travail exact et régulier : la qualité par la méthode, sans bruit et sans à-coups.",
    description: [
      "Vous associez l'exigence de la Conformité et la constance de la Stabilité : vous faites bien, et vous faites bien longtemps. Vos process sont documentés, vos délais tenus, vos erreurs rares. Dans les environnements réglementés, ce profil est un pilier.",
      "Votre vigilance porte sur la vitesse et l'affirmation. Vous avez besoin de conditions réunies pour avancer, ce qui vous rend inconfortable dans l'urgence et l'improvisation. Et vous exprimez rarement vos réserves autrement que par une lenteur qu'on interprète mal.",
    ],
    forces: [
      "Fiabilité et exactitude sur la durée",
      "Méthode documentée et transmissible",
      "Anticipation des risques",
      "Calme et discrétion",
    ],
    limites: [
      "Inconfort marqué face à l'urgence et à l'imprévu",
      "Perfectionnisme qui allonge les délais",
      "Réserves exprimées trop tard",
      "Faible prise de risque",
    ],
    moteurs: [
      "La qualité",
      "La sécurité du cadre",
      "La maîtrise du détail",
      "La reconnaissance du sérieux",
    ],
    stress:
      "Sous tension, vous multipliez les contrôles et vous vous protégez par la procédure. Le signal d'alerte est un délai qui s'allonge sans explication.",
    communiquer: [
      "Donnez le cadre, les critères et le délai dès le départ",
      "Prévenez des changements suffisamment tôt",
      "Demandez ses réserves explicitement",
    ],
    aEviter: [
      "Les demandes de dernière minute",
      "Le changement de règles en cours de route",
      "L'oral sans écrit",
    ],
    environnement: [
      "Cadre normé et outils stables",
      "Charge prévisible",
      "Exigence de qualité reconnue et financée en temps",
    ],
    developpement: [
      "Définir avec le demandeur le niveau de qualité attendu, puis s'y arrêter",
      "Signaler un risque de délai dès qu'il apparaît",
      "Expérimenter l'urgence sur des sujets à faible enjeu",
    ],
    roles: [
      "Qualité, conformité, HSE, réglementaire",
      "Comptabilité, paie, administration",
      "Méthodes, documentation, laboratoire",
    ],
  },
  BALANCED: {
    key: "BALANCED",
    name: "Le Profil équilibré",
    subtitle: "Aucune dimension nettement dominante",
    letters: ["D", "I", "S", "C"],
    headline:
      "Vos quatre dimensions sont proches : vous adaptez votre comportement à la situation plutôt qu'à une préférence marquée.",
    description: [
      "Un profil sans dimension dominante s'interprète différemment. Il signifie généralement une bonne capacité d'adaptation : vous pouvez être directif quand il faut décider, chaleureux quand il faut embarquer, patient quand il faut écouter, rigoureux quand il faut vérifier. Beaucoup de personnes expérimentées présentent ce type de résultat.",
      "Deux lectures sont possibles, et il faut les distinguer. Soit vous disposez réellement d'un large registre comportemental — c'est une force de management. Soit vous répondez à ce que la situation semble attendre plutôt qu'à ce que vous êtes, et le profil masque alors une préférence que l'entretien de restitution fera apparaître. Comparez vos deux graphiques : un écart important entre le masque et le moteur va dans le second sens.",
    ],
    forces: [
      "Large registre comportemental",
      "Lecture rapide des attentes d'un interlocuteur",
      "Capacité à faire le lien entre profils opposés",
      "Peu de rigidité",
    ],
    limites: [
      "Positionnement parfois difficile à lire par l'équipe",
      "Risque de suradaptation aux attentes perçues",
      "Moins d'expertise comportementale marquée sur un registre",
      "Peut hésiter sur la posture à adopter",
    ],
    moteurs: [
      "La variété des situations",
      "La progression",
      "La qualité de la relation de travail",
      "Le sens",
    ],
    stress:
      "Sous tension, la dimension réellement dominante réapparaît : observez laquelle prend le dessus, c'est une information précieuse.",
    communiquer: [
      "Demandez-lui explicitement ses préférences, elles ne se devinent pas",
      "Variez les registres selon les sujets",
      "Vérifiez l'accord réel plutôt que l'accord apparent",
    ],
    aEviter: [
      "Les cases figées",
      "Les interprétations hâtives du profil",
      "L'absence de cadre",
    ],
    environnement: [
      "Rôles transversaux et variés",
      "Autonomie sur la manière de faire",
      "Interlocuteurs de profils différents",
    ],
    developpement: [
      "Identifier la préférence réelle en observant les situations de tension",
      "Assumer une posture claire quand l'équipe attend un cap",
      "Approfondir un registre plutôt que rester généraliste partout",
    ],
    roles: [
      "Management d'équipe pluridisciplinaire",
      "Gestion de projet transverse",
      "Conseil, coordination, fonctions supports",
    ],
  },
};
