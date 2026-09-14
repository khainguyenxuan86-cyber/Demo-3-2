const questions = [
  // =========================
  // UNSCRAMBLE
  // =========================

    {
    id: "unscramble1",
    type: "unscramble",
    question: "Put the words in the correct order.",
    image: "images/livingroom.png",
    words: ["living", "There", "a", "is", "chair", "in", "the", "room"],
    answer: ["There", "is", "a", "chair", "in", "the", "living", "room"]
  },

  {
    id: "unscramble2",
    type: "unscramble",
    question: "Put the words in the correct order.",
    image: "images/livingroom.png",
    words: ["table.", "books", "are", "There", "five", "on", "the"],
    answer: ["There", "are", "five", "books", "on", "the", "table."]
  },

  {
    id: "unscramble3",
    type: "unscramble",
    question: "Put the words in the correct order.",
    image: "images/livingroom.png",
    words: ["bed.", "laptops", "are", "There", "two", "on", "the"],
    answer: ["There", "are", "two", "laptops", "on", "the", "bed."]
  },

    {
    id: "unscramble4",
    type: "unscramble",
    question: "Put the words in the correct order.",
    image: "images/livingroom.png",
    words: ["isn't", "There", "a", "shelf", "lamp", "on", "the"],
    answer: ["There", "isn't", "a", "lamp", "on", "the", "shelf"]
  },

    {
    id: "unscramble5",
    type: "unscramble",
    question: "Put the words in the correct order.",
    image: "images/livingroom.png",
    words: ["aren't", "There", "bathroom", "any", "tables", "in", "the"],
    answer: ["There", "aren't", "any", "tables", "in", "the", "bathroom"]
  },
  // =========================
  // WRITING
  // =========================
  // The checker does NOT require one exact sentence.
  // It checks the structure defined in "requirements".
   {
    id: "writing1",
    type: "writing",
    question: "Look at the picture and write one sentence.",
    image: "images/bedroom.png",
    template: "There is a/an + noun + in/on .......",
    requirements: {
      subjects: ["There"],
      verbs: ["is"],
      article: ["a"],
      preposition: ["in"],
      keywords: ["desk", "bedroom"],
      punctuation: ".",
      minWords: 6
    },
    sampleAnswer: "There is a desk in the bedroom."
  },

  {
    id: "writing2",
    type: "writing",
    question: "Look at the picture and write one sentence.",
    image: "images/bedroom.png",
    template: "There are + 'number' + plural noun + in/on .......",
    requirements: {
      subjects: ["There"],
      verbs: ["are"],
      preposition: ["on"],
      number: ["two", "2"],
      keywords: ["pens"],
      punctuation: ".",
      minWords: 6
    },
    sampleAnswer: "There are two pens on the desk."
  },

  {
    id: "writing3",
    type: "writing",
    question: "Look at the picture and write one sentence.",
    image: "images/bedroom.png",
    template: "There aren't any + plural noun + in/on .......",
    requirements: {
      subjects: ["There"],
      verbs: ["aren't", "are not"],
      preposition: ["on"],
      keywords: ["pictures", "any", "wall"],
      punctuation: ".",
      minWords: 6
    },
    sampleAnswer: "There aren't any pictures on the wall."
  },
];
