const questions = [
  // =========================
  // MULTIPLE CHOICE
  // =========================
  {
    id: "mcq1",
    type: "multipleChoice",
    question: "What animal is this?",
    image: "images/cat.png",
    choices: ["Dog", "Cat", "Bird", "Fish"],
    answer: "Cat"
  },

  {
    id: "mcq2",
    type: "multipleChoice",
    question: "What animal is this?",
    image: "images/dog.png",
    choices: ["Dog", "Cat", "Bird", "Fish"],
    answer: "Dog"
  },

  {
    id: "mcq3",
    type: "multipleChoice",
    question: "What is the past tense of 'go'?",
    choices: ["Goed", "Went", "Gone", "Going"],
    answer: "Went"
  },

  // =========================
  // UNSCRAMBLE
  // =========================
  {
    id: "unscramble1",
    type: "unscramble",
    question: "Put the words in the correct order.",
    image: "images/football.png",
    words: ["football", "I", "every", "play", "Sunday"],
    answer: ["I", "play", "football", "every", "Sunday"]
  },

  {
    id: "unscramble2",
    type: "unscramble",
    question: "Put the words in the correct order.",
    words: ["likes", "She", "books", "reading"],
    answer: ["She", "likes", "reading", "books"]
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
    image: "images/pizza.png",
    template: "This is a/an + noun.",
    requirements: {
      subjects: ["this"],
      verbs: ["is"],
      keywords: ["pizza"],
      punctuation: ".",
      minWords: 4
    },
    sampleAnswer: "This is a pizza."
  },

  {
    id: "writing2",
    type: "writing",
    question: "Write one sentence about what you do after school.",
    template: "I + verb + after school.",
    requirements: {
      subjects: ["i"],
      verbs: ["do", "play", "watch", "read", "study", "go", "eat", "help", "practice"],
      keywords: ["after school"],
      punctuation: ".",
      minWords: 4
    },
    sampleAnswer: "I do my homework after school."
  }
];
