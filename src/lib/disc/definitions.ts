/**
 * Définition et exemple type de chaque adjectif du questionnaire.
 *
 * Objectif : lever l'ambiguïté de vocabulaire sans orienter la réponse. Les
 * définitions restent neutres (ni valorisantes ni dévalorisantes) et les
 * exemples sont tous situés dans un contexte professionnel courant.
 */
export interface DiscWordHelp {
  definition: string;
  example: string;
}

export const DISC_WORD_HELP: Record<string, DiscWordHelp> = {
  /* ---- Dominance ------------------------------------------------------- */
  décidé: {
    definition: "Qui tranche rapidement et s'y tient, sans avoir besoin de tout valider.",
    example: "Deux options se valent : vous en choisissez une et lancez le chantier le jour même.",
  },
  direct: {
    definition: "Qui dit les choses sans détour ni précaution oratoire.",
    example: "Vous annoncez d'emblée que le dossier n'est pas au niveau, avant d'expliquer pourquoi.",
  },
  combatif: {
    definition: "Qui ne lâche pas face à l'opposition et accepte l'affrontement.",
    example: "Votre budget est refusé : vous revenez défendre le dossier au comité suivant.",
  },
  audacieux: {
    definition: "Qui ose engager une action risquée quand l'enjeu le justifie.",
    example: "Vous répondez à un appel d'offres plus gros que tout ce que vous avez livré.",
  },
  compétitif: {
    definition: "Qui se motive en se comparant aux autres et en cherchant à devancer.",
    example: "Vous regardez le classement de l'équipe chaque semaine et visez la première place.",
  },
  fonceur: {
    definition: "Qui passe à l'action vite, quitte à ajuster en cours de route.",
    example: "Le cahier des charges n'est pas figé, vous démarrez quand même une première version.",
  },
  volontaire: {
    definition: "Qui s'impose un objectif et fournit l'effort pour l'atteindre.",
    example: "Vous vous engagez sur une échéance tenue et vous organisez votre semaine autour.",
  },
  ferme: {
    definition: "Qui maintient sa position sans se laisser fléchir par l'insistance.",
    example: "Un client redemande une remise déjà refusée : votre réponse ne change pas.",
  },
  entreprenant: {
    definition: "Qui lance des initiatives sans attendre qu'on les lui demande.",
    example: "Vous montez un nouveau format de réunion client sans que personne ne l'ait sollicité.",
  },
  résolu: {
    definition: "Qui poursuit sa décision sans revenir dessus au premier obstacle.",
    example: "La migration prend du retard : vous maintenez le cap plutôt que de tout annuler.",
  },
  tranchant: {
    definition: "Qui formule un avis net, sans nuance ni ménagement.",
    example: "En réunion, vous qualifiez une proposition d'inapplicable en une phrase.",
  },
  énergique: {
    definition: "Qui agit avec un rythme et une intensité élevés.",
    example: "Vous enchaînez cinq points d'équipe dans la matinée sans perdre en intensité.",
  },
  indépendant: {
    definition: "Qui avance seul et supporte mal d'être encadré de près.",
    example: "Vous préférez qu'on vous fixe un objectif plutôt qu'une méthode de travail.",
  },
  affirmé: {
    definition: "Qui exprime clairement sa position et l'assume devant le groupe.",
    example: "Vous êtes le seul d'un avis contraire et vous le dites quand même.",
  },
  autoritaire: {
    definition: "Qui impose une décision plutôt que de la faire discuter.",
    example: "Le délai est intenable : vous réattribuez les tâches sans passer par un vote.",
  },
  offensif: {
    definition: "Qui prend l'initiative de l'attaque plutôt que d'attendre.",
    example: "Un concurrent démarche vos clients : vous démarchez les siens la semaine suivante.",
  },
  pionnier: {
    definition: "Qui se porte volontaire pour défricher un terrain inconnu.",
    example: "Vous prenez en charge le premier déploiement d'un outil que personne ne maîtrise.",
  },
  impatient: {
    definition: "Qui supporte mal l'attente et les processus lents.",
    example: "Trois relances sans réponse : vous appelez directement le décideur.",
  },
  franc: {
    definition: "Qui dit ce qu'il pense, y compris quand c'est inconfortable.",
    example: "On vous demande votre avis sur un livrable faible : vous le donnez tel quel.",
  },
  conquérant: {
    definition: "Qui cherche à gagner du terrain, des parts, des responsabilités.",
    example: "Votre périmètre est stabilisé : vous proposez d'ouvrir une nouvelle région.",
  },
  décisif: {
    definition: "Qui conclut et fait avancer un sujet resté en suspens.",
    example: "Après vingt minutes de débat, vous arrêtez la discussion et actez un choix.",
  },
  meneur: {
    definition: "Qui prend naturellement la tête d'un groupe et donne la direction.",
    example: "Le chef de projet est absent : le groupe se tourne spontanément vers vous.",
  },
  intrépide: {
    definition: "Qui n'est pas arrêté par le risque ou l'appréhension.",
    example: "Vous acceptez de présenter un sujet sensible devant le comité de direction.",
  },
  radical: {
    definition: "Qui privilégie les solutions de rupture aux ajustements progressifs.",
    example: "Le process dysfonctionne : vous proposez de le supprimer plutôt que de le corriger.",
  },
  exigeant: {
    definition: "Qui attend un niveau élevé, de soi comme des autres.",
    example: "Vous renvoyez un livrable correct en demandant une version plus aboutie.",
  },
  provocateur: {
    definition: "Qui bouscule volontairement pour faire réagir et débloquer.",
    example: "Face à une équipe résignée, vous lancez une affirmation volontairement excessive.",
  },
  dominant: {
    definition: "Qui prend l'ascendant dans un échange ou un groupe.",
    example: "En réunion, c'est votre cadrage qui finit par structurer la discussion.",
  },
  ambitieux: {
    definition: "Qui vise des objectifs et des responsabilités plus élevés.",
    example: "Vous vous positionnez sur un poste avant même qu'il soit ouvert.",
  },

  /* ---- Influence ------------------------------------------------------- */
  enthousiaste: {
    definition: "Qui exprime ouvertement son envie et la transmet aux autres.",
    example: "Vous présentez un nouveau projet et l'équipe repart motivée de la réunion.",
  },
  sociable: {
    definition: "Qui va facilement vers les autres et entretient de nombreux contacts.",
    example: "En deux semaines dans un nouveau service, vous connaissez tout le monde.",
  },
  expressif: {
    definition: "Qui montre ce qu'il ressent, par le ton, le visage et les gestes.",
    example: "Votre satisfaction ou votre agacement se lisent avant même que vous parliez.",
  },
  optimiste: {
    definition: "Qui anticipe spontanément une issue favorable.",
    example: "Le projet démarre mal : vous estimez que ce sera rattrapé d'ici la fin du mois.",
  },
  persuasif: {
    definition: "Qui amène les autres à adhérer à son point de vue.",
    example: "Un service réticent finit par valider votre solution après un seul échange.",
  },
  démonstratif: {
    definition: "Qui manifeste ouvertement ses réactions et ses attachements.",
    example: "Vous félicitez un collègue à voix haute devant toute l'équipe.",
  },
  chaleureux: {
    definition: "Qui met les autres à l'aise par un contact cordial.",
    example: "Un nouvel arrivant intimidé se détend après quelques minutes avec vous.",
  },
  spontané: {
    definition: "Qui réagit dans l'instant, sans filtrer ni préparer.",
    example: "Une idée vous vient pendant la réunion, vous la posez aussitôt sur la table.",
  },
  communicatif: {
    definition: "Qui partage facilement l'information et fait circuler la parole.",
    example: "Vous tenez l'équipe informée au fil de l'eau plutôt qu'en point mensuel.",
  },
  jovial: {
    definition: "Qui entretient une humeur gaie dans les échanges.",
    example: "Vous détendez une réunion tendue par une remarque légère.",
  },
  charismatique: {
    definition: "Qui capte l'attention et suscite l'adhésion par sa seule présence.",
    example: "Vous prenez la parole et la salle cesse de consulter ses téléphones.",
  },
  convaincant: {
    definition: "Qui emporte l'accord parce que son propos est crédible et incarné.",
    example: "Votre argumentaire suffit à faire basculer un comité partagé.",
  },
  extraverti: {
    definition: "Qui puise son énergie dans le contact avec les autres.",
    example: "Après une journée entière de rendez-vous, vous êtes plus en forme qu'au départ.",
  },
  animé: {
    definition: "Qui parle et agit avec vivacité et mouvement.",
    example: "Vous présentez debout, en vous déplaçant, plutôt qu'assis derrière un écran.",
  },
  enjoué: {
    definition: "Qui aborde les situations avec entrain et bonne humeur.",
    example: "Le lundi matin, c'est vous qui relancez la dynamique du plateau.",
  },
  influent: {
    definition: "Dont l'avis pèse sur les décisions, même sans autorité formelle.",
    example: "On vient vous consulter avant d'arbitrer, alors que vous n'êtes pas décisionnaire.",
  },
  imaginatif: {
    definition: "Qui produit facilement des idées et des pistes nouvelles.",
    example: "Le budget est bloqué : vous proposez trois montages auxquels personne n'avait pensé.",
  },
  exubérant: {
    definition: "Qui s'exprime avec une intensité et un volume marqués.",
    example: "Votre annonce d'une bonne nouvelle s'entend de l'autre bout du plateau.",
  },
  populaire: {
    definition: "Qui est apprécié largement et spontanément dans le collectif.",
    example: "Votre nom revient dans toutes les équipes quand il faut désigner un référent.",
  },
  entraînant: {
    definition: "Qui met les autres en mouvement par sa propre dynamique.",
    example: "Vous lancez le chantier et trois collègues s'y joignent sans qu'on le leur demande.",
  },
  impulsif: {
    definition: "Qui agit sous l'impulsion du moment, avant d'avoir pesé.",
    example: "Vous répondez à un mail agaçant dans la minute plutôt que le lendemain.",
  },
  théâtral: {
    definition: "Qui met en scène son propos pour marquer les esprits.",
    example: "Vous ouvrez votre présentation par un chiffre choc et un long silence.",
  },
  sympathique: {
    definition: "Qui inspire spontanément de la bienveillance chez les autres.",
    example: "Un interlocuteur difficile devient coopératif après un premier échange avec vous.",
  },
  vivant: {
    definition: "Qui apporte du rythme et de la présence dans les échanges.",
    example: "Vos réunions se terminent à l'heure mais personne ne les trouve longues.",
  },
  insouciant: {
    definition: "Qui ne se charge pas d'inquiétude par anticipation.",
    example: "Un audit est annoncé dans trois semaines : vous n'y pensez pas avant la veille.",
  },
  séduisant: {
    definition: "Qui sait plaire et créer l'adhésion par la relation.",
    example: "Un prospect distant accepte un second rendez-vous après votre premier échange.",
  },
  spirituel: {
    definition: "Qui manie l'humour et le trait d'esprit dans la conversation.",
    example: "Vous désamorcez une objection par une formule qui fait rire l'assistance.",
  },
  bavard: {
    definition: "Qui parle beaucoup et prend volontiers du temps de parole.",
    example: "Votre point de cinq minutes en dure quinze, sans que vous l'ayez vu passer.",
  },

  /* ---- Stabilité ------------------------------------------------------- */
  patient: {
    definition: "Qui accepte d'attendre et de répéter sans s'irriter.",
    example: "Vous réexpliquez trois fois la même procédure à un nouvel arrivant.",
  },
  loyal: {
    definition: "Qui reste solidaire de son équipe, y compris en difficulté.",
    example: "Le service est critiqué en réunion : vous ne vous en désolidarisez pas.",
  },
  calme: {
    definition: "Qui garde son sang-froid quand la tension monte.",
    example: "Une panne bloque la production : votre voix ne change pas de ton.",
  },
  conciliant: {
    definition: "Qui cherche le terrain d'entente plutôt que le rapport de force.",
    example: "Deux collègues s'opposent sur un planning : vous proposez un compromis.",
  },
  serviable: {
    definition: "Qui rend service sans attendre de contrepartie.",
    example: "Vous finissez un dossier qui n'est pas le vôtre pour dépanner un collègue.",
  },
  posé: {
    definition: "Qui parle et agit sans précipitation.",
    example: "Vous prenez un temps de réflexion avant de répondre à une question piège.",
  },
  constant: {
    definition: "Qui produit le même niveau d'effort et de qualité dans la durée.",
    example: "Votre reporting est rendu le même jour depuis deux ans, sans relance.",
  },
  fidèle: {
    definition: "Qui s'attache durablement aux personnes et aux engagements.",
    example: "Vous suivez le même client depuis sept ans et connaissez toute son histoire.",
  },
  prévenant: {
    definition: "Qui anticipe le besoin de l'autre avant qu'il soit exprimé.",
    example: "Vous préparez le dossier de votre responsable avant qu'il ne le demande.",
  },
  discret: {
    definition: "Qui agit sans se mettre en avant ni faire de bruit.",
    example: "Votre contribution au projet n'apparaît nulle part et cela ne vous gêne pas.",
  },
  régulier: {
    definition: "Qui tient un rythme stable, sans à-coups.",
    example: "Vous traitez le même volume de dossiers chaque jour, semaine après semaine.",
  },
  modeste: {
    definition: "Qui minimise son mérite plutôt que de le revendiquer.",
    example: "Le résultat est salué : vous l'attribuez immédiatement à l'équipe.",
  },
  coopératif: {
    definition: "Qui travaille volontiers avec les autres et partage ses moyens.",
    example: "Vous ouvrez vos fichiers et votre méthode à un service concurrent du vôtre.",
  },
  tranquille: {
    definition: "Qui reste posé et peu réactif à l'agitation ambiante.",
    example: "Le plateau s'affole avant une échéance : votre journée se déroule normalement.",
  },
  attentionné: {
    definition: "Qui prête attention à l'état et au confort des autres.",
    example: "Vous remarquez qu'un collègue décroche et allez lui parler en fin de journée.",
  },
  fiable: {
    definition: "Sur qui on peut compter : ce qui est promis est livré.",
    example: "Vous annoncez jeudi 17h, c'est disponible jeudi 17h, sans relance.",
  },
  persévérant: {
    definition: "Qui continue sur la durée, malgré la lenteur des résultats.",
    example: "Vous relancez un prospect pendant dix-huit mois avant la première commande.",
  },
  accommodant: {
    definition: "Qui s'adapte aux contraintes des autres sans en faire un sujet.",
    example: "La réunion est déplacée pour la troisième fois : vous réorganisez votre journée.",
  },
  doux: {
    definition: "Qui agit avec ménagement, sans brusquer.",
    example: "Vous formulez une critique de manière à ce qu'elle soit entendue sans blesser.",
  },
  bienveillant: {
    definition: "Qui accorde par défaut une intention favorable aux autres.",
    example: "Face à une erreur, vous cherchez ce qui l'explique avant de chercher un responsable.",
  },
  paisible: {
    definition: "Qui recherche et installe un climat sans tension.",
    example: "Vous évitez d'alimenter un conflit naissant entre deux services.",
  },
  réservé: {
    definition: "Qui parle peu de soi et se livre progressivement.",
    example: "Vos collègues ignorent encore ce que vous faisiez dans votre poste précédent.",
  },
  dévoué: {
    definition: "Qui se rend disponible pour les autres, parfois au-delà du nécessaire.",
    example: "Vous restez le soir pour aider à boucler un dossier qui n'est pas le vôtre.",
  },
  aimable: {
    definition: "Qui entretient des rapports courtois et agréables.",
    example: "Vous prenez le temps d'un bonjour réel avec chaque personne du service.",
  },
  serein: {
    definition: "Qui reste stable intérieurement face à l'incertitude.",
    example: "Une réorganisation est annoncée : vous continuez à travailler sans vous alarmer.",
  },
  altruiste: {
    definition: "Qui fait passer l'intérêt des autres avant le sien.",
    example: "Vous cédez une mission valorisante à un collègue qui en a davantage besoin.",
  },
  compréhensif: {
    definition: "Qui accueille la difficulté de l'autre sans la juger.",
    example: "Un collaborateur rend un travail en retard : vous cherchez d'abord à comprendre.",
  },
  disponible: {
    definition: "Qui se rend accessible quand on a besoin de lui.",
    example: "Votre porte reste ouverte même en période de forte charge.",
  },

  /* ---- Conformité ------------------------------------------------------ */
  précis: {
    definition: "Qui donne l'information exacte, sans approximation.",
    example: "Vous annoncez « 14,2 % sur le trimestre », pas « environ 15 % ».",
  },
  méthodique: {
    definition: "Qui procède par étapes définies, toujours dans le même ordre.",
    example: "Vous suivez la même check-list à chaque mise en production.",
  },
  analytique: {
    definition: "Qui décompose un problème pour en comprendre les causes.",
    example: "Devant une baisse de résultats, vous isolez d'abord les variables une par une.",
  },
  prudent: {
    definition: "Qui évalue le risque avant de s'engager.",
    example: "Vous demandez un test sur un périmètre restreint avant le déploiement général.",
  },
  logique: {
    definition: "Qui raisonne par enchaînement de causes et de conséquences.",
    example: "Vous refusez une conclusion qui ne découle pas des données présentées.",
  },
  rigoureux: {
    definition: "Qui applique les règles et les contrôles sans les relâcher.",
    example: "Aucun document ne part sans la double vérification prévue par la procédure.",
  },
  exact: {
    definition: "Qui est juste dans le détail, sans écart ni erreur.",
    example: "Vos chiffres correspondent au centime près au grand livre.",
  },
  perfectionniste: {
    definition: "Qui vise le sans-faute et retravaille jusqu'à l'obtenir.",
    example: "Vous reprenez une présentation déjà validée pour en corriger la mise en page.",
  },
  factuel: {
    definition: "Qui s'en tient aux faits vérifiables, sans interprétation.",
    example: "Vous décrivez ce qui s'est passé et à quelle heure, sans commenter les intentions.",
  },
  organisé: {
    definition: "Qui structure son travail, ses fichiers et son temps.",
    example: "Vous retrouvez en dix secondes un document de l'année dernière.",
  },
  critique: {
    definition: "Qui examine et met à l'épreuve avant d'accepter.",
    example: "Vous relevez l'hypothèse fragile qui soutient tout le business plan.",
  },
  réfléchi: {
    definition: "Qui pèse avant de se prononcer ou d'agir.",
    example: "On vous demande votre avis : vous répondez le lendemain, argumenté.",
  },
  ordonné: {
    definition: "Qui maintient un rangement et un classement systématiques.",
    example: "Votre arborescence de dossiers est utilisable par n'importe quel collègue.",
  },
  objectif: {
    definition: "Qui juge sur les critères, indépendamment des personnes.",
    example: "Vous évaluez la proposition d'un ami et celle d'un rival à la même grille.",
  },
  minutieux: {
    definition: "Qui apporte un soin marqué au moindre détail.",
    example: "Vous relisez ligne à ligne un contrat de quarante pages avant signature.",
  },
  systématique: {
    definition: "Qui applique la même règle à tous les cas, sans exception.",
    example: "Chaque incident est tracé dans l'outil, même celui réglé en deux minutes.",
  },
  sceptique: {
    definition: "Qui ne prend pas une affirmation pour acquise sans preuve.",
    example: "Un fournisseur annonce 99 % de disponibilité : vous demandez les relevés.",
  },
  discipliné: {
    definition: "Qui se tient au cadre et à la routine qu'il s'est fixés.",
    example: "Votre créneau de traitement du courrier est respecté tous les matins.",
  },
  consciencieux: {
    definition: "Qui fait son travail complètement, y compris la part invisible.",
    example: "Vous documentez la procédure alors que personne ne vérifiera qu'elle existe.",
  },
  pointilleux: {
    definition: "Qui relève les écarts même mineurs.",
    example: "Vous signalez une incohérence de format dans un tableau par ailleurs juste.",
  },
  rationnel: {
    definition: "Qui décide sur la base du raisonnement plutôt que du ressenti.",
    example: "Le projet vous plaît mais les chiffres sont mauvais : vous ne le lancez pas.",
  },
  structuré: {
    definition: "Qui organise sa pensée et son propos selon un plan clair.",
    example: "Votre note tient en trois parties annoncées dès la première ligne.",
  },
  scrupuleux: {
    definition: "Qui veille à ne rien laisser passer d'irrégulier.",
    example: "Vous refusez une note de frais mal justifiée, même de faible montant.",
  },
  détaillé: {
    definition: "Qui entre dans le niveau de précision fin.",
    example: "Votre compte rendu reprend chaque décision, son porteur et son échéance.",
  },
  conformiste: {
    definition: "Qui se range aux règles et usages établis.",
    example: "Vous appliquez le modèle imposé même si le vôtre vous semblait meilleur.",
  },
  vérificateur: {
    definition: "Qui contrôle avant de valider, y compris le travail déjà relu.",
    example: "Vous recalculez le total d'un tableau transmis par un service fiable.",
  },
  circonspect: {
    definition: "Qui avance avec précaution tant que la situation n'est pas claire.",
    example: "Vous ne vous engagez pas sur un délai avant d'avoir vu le périmètre réel.",
  },
  nuancé: {
    definition: "Qui distingue les cas plutôt que de trancher en bloc.",
    example: "Vous répondez que la solution convient pour deux sites sur trois, et dites pourquoi.",
  },
};
