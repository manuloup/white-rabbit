export const questions = [
    // HTML
    {
        id: 1,
        category: "HTML",
        question: "Quelle balise sert a creer un lien ?",
        options: ["<a>", "<link>", "<href>", "<url>"],
        correct: 0,
        points: 10,
    },
    {
        id: 2,
        category: "HTML",
        question: "Quelle balise contient le contenu principal d'une page ?",
        options: ["<main>", "<section>", "<article>", "<content>"],
        correct: 0,
        points: 10,
    },
    {
        id: 3,
        category: "HTML",
        question: "Quelle balise cree un paragraphe ?",
        options: ["<p>", "<para>", "<text>", "<pg>"],
        correct: 0,
        points: 10,
    },
    {
        id: 4,
        category: "HTML",
        question: "Quel attribut rend un champ de formulaire obligatoire ?",
        options: ["required", "mandatory", "needed", "must"],
        correct: 0,
        points: 12,
    },
    {
        id: 5,
        category: "HTML",
        question: "Quelle balise charge un fichier JavaScript dans une page ?",
        options: ["<script>", "<js>", "<code>", "<javascript>"],
        correct: 0,
        points: 10,
    },

    // CSS
    {
        id: 6,
        category: "CSS",
        question: "Quelle propriete CSS controle la couleur du texte ?",
        options: ["color", "text-color", "font-color", "text"],
        correct: 0,
        points: 10,
    },
    {
        id: 7,
        category: "CSS",
        question: "Comment cibler une classe en CSS ?",
        options: [".classe", "#classe", "*classe", "@classe"],
        correct: 0,
        points: 10,
    },
    {
        id: 8,
        category: "CSS",
        question: "Quelle valeur de display active Flexbox ?",
        options: ["flex", "inline", "block", "grid"],
        correct: 0,
        points: 12,
    },
    {
        id: 9,
        category: "CSS",
        question: "Quelle propriete gere l'espace entre les elements flex ?",
        options: ["gap", "margin", "padding", "spacing"],
        correct: 0,
        points: 14,
    },
    {
        id: 10,
        category: "CSS",
        question: "Quelle unite CSS est relative a la largeur de la fenetre ?",
        options: ["vw", "px", "em", "rem"],
        correct: 0,
        points: 14,
    },

    // JavaScript
    {
        id: 11,
        category: "JS",
        question: "Quel mot-cle declare une constante ?",
        options: ["const", "let", "var", "define"],
        correct: 0,
        points: 12,
    },
    {
        id: 12,
        category: "JS",
        question: "Que retourne typeof [] ?",
        options: ["object", "array", "list", "undefined"],
        correct: 0,
        points: 16,
    },
    {
        id: 13,
        category: "JS",
        question: "Quelle methode ajoute un element a la fin d'un tableau ?",
        options: ["push()", "append()", "add()", "insert()"],
        correct: 0,
        points: 12,
    },
    {
        id: 14,
        category: "JS",
        question: "Quelle methode convertit du JSON en objet JavaScript ?",
        options: ["JSON.parse()", "JSON.stringify()", "JSON.convert()", "JSON.decode()"],
        correct: 0,
        points: 14,
    },
    {
        id: 15,
        category: "JS",
        question: "Quelle methode cree un nouveau tableau en gardant certains elements ?",
        options: ["filter()", "map()", "find()", "reduce()"],
        correct: 0,
        points: 14,
    },

    // React
    {
        id: 16,
        category: "REACT",
        question: "Quel hook gere une variable d'etat dans un composant ?",
        options: ["useState", "useEffect", "useMemo", "useRef"],
        correct: 0,
        points: 18,
    },
    {
        id: 17,
        category: "REACT",
        question: "A quoi sert useEffect() ?",
        options: ["Lancer du code apres le rendu", "Creer un state", "Ecrire du CSS", "Modifier le JSX"],
        correct: 0,
        points: 18,
    },
    {
        id: 18,
        category: "REACT",
        question: "Quelle prop est obligatoire dans un .map() pour chaque element ?",
        options: ["key", "id", "ref", "name"],
        correct: 0,
        points: 16,
    },
    {
        id: 19,
        category: "REACT",
        question: "Quel hook met en cache une valeur pour eviter de la recalculer a chaque rendu ?",
        options: ["useMemo", "useCallback", "useRef", "useState"],
        correct: 0,
        points: 20,
    },
    {
        id: 20,
        category: "REACT",
        question: "Comment un composant parent transmet des donnees a un enfant ?",
        options: ["Via les props", "Via le state", "Via le context", "Via un ref"],
        correct: 0,
        points: 16,
    },
];

// Cases speciales — cours expliques par les persos de Matrix
export const infoCells = {
    3: {
        type: "info",
        title: "MORPHEUS — DOM",
        content:
            "Tu vois ce code qui tombe ? Ce sont les elements de ta page. Le DOM est un arbre : chaque balise est un noeud. JavaScript peut lire, modifier ou supprimer n'importe quel noeud en temps reel. C'est ainsi que la realite de la page change.",
    },
    7: {
        type: "info",
        title: "TANK — LES HOOKS",
        content:
            "Je ne suis pas ne dans la Matrice, donc je connais le code par coeur. Les hooks React comme useState et useEffect permettent a un composant de avoir de la memoire et de reagir aux changements. Sans eux, ton composant est aveugle et muet.",
    },
    9: {
        type: "bonus",
        title: "RED PILL",
        content: "Tu as choisi de voir jusqu'ou va le terrier. +50 points.",
        points: 50,
    },
    13: {
        type: "info",
        title: "L'ORACLE — LES FONCTIONS",
        content:
            "Je ne te dis pas ce que tu veux entendre, je te dis ce que tu as besoin de savoir. Une fonction prend une entree, fait quelque chose, retourne un resultat. Compose-les bien et tu construis n'importe quoi.",
    },
    17: {
        type: "info",
        title: "NEO — LE STATE",
        content:
            "Je commence a voir le code. Le state, c'est la memoire vivante de ton composant. Chaque fois qu'il change, React re-affiche l'interface. Changer le state, c'est changer la realite affichee a l'utilisateur.",
    },
};

// Parcours 20 cases
export const pathCoordinates = [
    { x: 160, y: 360 },
    { x: 300, y: 360 },
    { x: 440, y: 320 },
    { x: 580, y: 300 },
    { x: 720, y: 340 },
    { x: 860, y: 390 },
    { x: 1000, y: 360 },
    { x: 1140, y: 320 },
    { x: 1280, y: 300 },
    { x: 1420, y: 340 },
    { x: 1560, y: 390 },
    { x: 1700, y: 370 },
    { x: 1840, y: 340 },
    { x: 1980, y: 300 },
    { x: 2120, y: 320 },
    { x: 2260, y: 350 },
    { x: 2400, y: 390 },
    { x: 2540, y: 370 },
    { x: 2680, y: 340 },
    { x: 2820, y: 320 },
];
