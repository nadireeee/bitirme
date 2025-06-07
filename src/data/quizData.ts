export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  category: string;
  chapter: string;
  points: number;
}

export interface QuizCategory {
  id: string;
  title: string;
  titleTR: string;
  description: string;
  descriptionTR: string;
  level: "beginner" | "intermediate" | "advanced";
  chapter: number;
  icon: string;
  color: string;
  estimatedTime: number; // minutes
  totalQuestions: number;
  passingScore: number; // percentage
}

export interface TestResult {
  quizId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number; // seconds
  completedAt: Date;
  answers: { questionId: string; selectedAnswer: number; isCorrect: boolean }[];
}

export const quizCategories: QuizCategory[] = [
  // Chapter 0: Introduction / Getting Started
  {
    id: "intro-basics",
    title: "Introduction to C++",
    titleTR: "C++'a Giriş",
    description: "Basic concepts of C++ programming",
    descriptionTR: "C++ programlamanın temel kavramları",
    level: "beginner",
    chapter: 0,
    icon: "school",
    color: "#10b981",
    estimatedTime: 15,
    totalQuestions: 10,
    passingScore: 70,
  },
  {
    id: "development-environment",
    title: "Development Environment",
    titleTR: "Geliştirme Ortamı",
    description: "IDE, compiler, and development tools",
    descriptionTR: "IDE, derleyici ve geliştirme araçları",
    level: "beginner",
    chapter: 0,
    icon: "build",
    color: "#10b981",
    estimatedTime: 12,
    totalQuestions: 8,
    passingScore: 70,
  },

  // Chapter 1: C++ Basics
  {
    id: "cpp-basics",
    title: "C++ Basics",
    titleTR: "C++ Temelleri",
    description: "Variables, statements, and basic syntax",
    descriptionTR: "Değişkenler, ifadeler ve temel sözdizimi",
    level: "beginner",
    chapter: 1,
    icon: "code",
    color: "#3b82f6",
    estimatedTime: 20,
    totalQuestions: 15,
    passingScore: 75,
  },
  {
    id: "iostream-operations",
    title: "Input/Output Operations",
    titleTR: "Giriş/Çıkış İşlemleri",
    description: "cout, cin, and basic I/O operations",
    descriptionTR: "cout, cin ve temel G/Ç işlemleri",
    level: "beginner",
    chapter: 1,
    icon: "swap-horizontal",
    color: "#3b82f6",
    estimatedTime: 18,
    totalQuestions: 12,
    passingScore: 75,
  },

  // Chapter 2: Functions and Files
  {
    id: "functions-basics",
    title: "Functions",
    titleTR: "Fonksiyonlar",
    description: "Function definitions, parameters, and return values",
    descriptionTR: "Fonksiyon tanımları, parametreler ve dönüş değerleri",
    level: "beginner",
    chapter: 2,
    icon: "git-branch",
    color: "#8b5cf6",
    estimatedTime: 25,
    totalQuestions: 18,
    passingScore: 75,
  },
  {
    id: "file-operations",
    title: "File I/O",
    titleTR: "Dosya G/Ç",
    description: "File input/output operations and file handling",
    descriptionTR: "Dosya giriş/çıkış işlemleri ve dosya yönetimi",
    level: "intermediate",
    chapter: 2,
    icon: "document",
    color: "#8b5cf6",
    estimatedTime: 22,
    totalQuestions: 14,
    passingScore: 80,
  },

  // Chapter 3: Arrays and Strings
  {
    id: "arrays",
    title: "Arrays",
    titleTR: "Diziler",
    description: "Array declaration, initialization, and manipulation",
    descriptionTR: "Dizi bildirimi, başlatma ve manipülasyon",
    level: "intermediate",
    chapter: 3,
    icon: "grid",
    color: "#f59e0b",
    estimatedTime: 30,
    totalQuestions: 20,
    passingScore: 80,
  },
  {
    id: "strings",
    title: "Strings",
    titleTR: "Strings",
    description: "C-style strings and std::string class",
    descriptionTR: "C-tarzı strings ve std::string sınıfı",
    level: "intermediate",
    chapter: 3,
    icon: "text",
    color: "#f59e0b",
    estimatedTime: 28,
    totalQuestions: 16,
    passingScore: 80,
  },

  // Chapter 4: Object-Oriented Programming
  {
    id: "oop-basics",
    title: "OOP Fundamentals",
    titleTR: "OOP Temelleri",
    description: "Classes, objects, and basic OOP concepts",
    descriptionTR: "Sınıflar, nesneler ve temel OOP kavramları",
    level: "intermediate",
    chapter: 4,
    icon: "cube",
    color: "#ef4444",
    estimatedTime: 35,
    totalQuestions: 25,
    passingScore: 85,
  },
  {
    id: "inheritance-polymorphism",
    title: "Inheritance & Polymorphism",
    titleTR: "Kalıtım ve Çok Biçimlilik",
    description: "Advanced OOP concepts and design patterns",
    descriptionTR: "Gelişmiş OOP kavramları ve tasarım desenleri",
    level: "advanced",
    chapter: 4,
    icon: "share",
    color: "#ef4444",
    estimatedTime: 40,
    totalQuestions: 30,
    passingScore: 85,
  },

  // Chapter 5: Advanced Topics
  {
    id: "templates",
    title: "Templates",
    titleTR: "Şablonlar",
    description: "Template programming and generic programming",
    descriptionTR: "Şablon programlama ve genel programlama",
    level: "advanced",
    chapter: 5,
    icon: "layers",
    color: "#06b6d4",
    estimatedTime: 45,
    totalQuestions: 28,
    passingScore: 90,
  },
  {
    id: "stl",
    title: "Standard Template Library",
    titleTR: "Standart Şablon Kütüphanesi",
    description: "STL containers, algorithms, and iterators",
    descriptionTR: "STL konteynerler, algoritmalar ve yineleyiciler",
    level: "advanced",
    chapter: 5,
    icon: "library",
    color: "#06b6d4",
    estimatedTime: 50,
    totalQuestions: 35,
    passingScore: 90,
  },

  // Chapter 6: Modern C++
  {
    id: "modern-cpp",
    title: "Modern C++ Features",
    titleTR: "Modern C++ Özellikleri",
    description: "C++11, C++14, C++17, and C++20 features",
    descriptionTR: "C++11, C++14, C++17 ve C++20 özellikleri",
    level: "advanced",
    chapter: 6,
    icon: "flash",
    color: "#8b5cf6",
    estimatedTime: 55,
    totalQuestions: 40,
    passingScore: 90,
  },
];

export const quizQuestions: QuizQuestion[] = [
  // Introduction to C++ Questions
  {
    id: "intro-1",
    question: "What does C++ stand for?",
    options: [
      "C Plus Plus",
      "Computer Plus Plus",
      "Code Plus Plus",
      "Compiled Plus Plus",
    ],
    correctAnswer: 0,
    explanation:
      'C++ is called "C Plus Plus" because it\'s an enhanced version of the C programming language.',
    difficulty: "beginner",
    category: "intro-basics",
    chapter: "Introduction to C++",
    points: 5,
  },
  {
    id: "intro-2",
    question: "C++ hangi programlama paradigmalarını destekler?",
    options: [
      "Sadece prosedürel programlama",
      "Sadece nesne yönelimli programlama",
      "Prosedürel, nesne yönelimli ve genel programlama",
      "Sadece fonksiyonel programlama",
    ],
    correctAnswer: 2,
    explanation:
      "C++ çok paradigmalı bir dil olup prosedürel, nesne yönelimli ve genel programlamayı destekler.",
    difficulty: "beginner",
    category: "intro-basics",
    chapter: "Introduction to C++",
    points: 5,
  },

  // C++ Basics Questions
  {
    id: "basics-1",
    question: "Which of the following is a valid variable declaration in C++?",
    options: ["int 2number;", "int number-2;", "int number2;", "int number 2;"],
    correctAnswer: 2,
    explanation:
      "Variable names in C++ must start with a letter or underscore, and can contain letters, digits, and underscores.",
    difficulty: "beginner",
    category: "cpp-basics",
    chapter: "C++ Basics",
    points: 10,
  },
  {
    id: "basics-2",
    question:
      "C++'da bir tamsayı değişkeni tanımlamak için hangi anahtar kelime kullanılır?",
    options: ["integer", "int", "number", "whole"],
    correctAnswer: 1,
    explanation:
      'C++\'da tamsayı değişkenler "int" anahtar kelimesi ile tanımlanır.',
    difficulty: "beginner",
    category: "cpp-basics",
    chapter: "C++ Basics",
    points: 10,
  },

  // Functions Questions
  {
    id: "functions-1",
    question:
      "What is the correct syntax for a function that returns an integer and takes no parameters?",
    options: [
      "int function();",
      "function int();",
      "return int function();",
      "int function{}:",
    ],
    correctAnswer: 0,
    explanation:
      "A function declaration in C++ follows the pattern: return_type function_name(parameters);",
    difficulty: "beginner",
    category: "functions-basics",
    chapter: "Functions",
    points: 15,
  },

  // Arrays Questions
  {
    id: "arrays-1",
    question: "How do you declare an array of 10 integers in C++?",
    options: [
      "int array[10];",
      "int[10] array;",
      "array int[10];",
      "int array(10);",
    ],
    correctAnswer: 0,
    explanation:
      "Arrays in C++ are declared with the syntax: type array_name[size];",
    difficulty: "intermediate",
    category: "arrays",
    chapter: "Arrays",
    points: 20,
  },

  // OOP Questions
  {
    id: "oop-1",
    question:
      "Which access specifier makes class members accessible only within the same class?",
    options: ["public", "protected", "private", "internal"],
    correctAnswer: 2,
    explanation:
      "Private members are only accessible within the same class where they are declared.",
    difficulty: "intermediate",
    category: "oop-basics",
    chapter: "OOP Fundamentals",
    points: 25,
  },

  // Advanced Questions
  {
    id: "templates-1",
    question: "What keyword is used to define a template in C++?",
    options: ["generic", "template", "typename", "class"],
    correctAnswer: 1,
    explanation: 'The "template" keyword is used to define templates in C++.',
    difficulty: "advanced",
    category: "templates",
    chapter: "Templates",
    points: 30,
  },

  // Modern C++ Questions
  {
    id: "modern-1",
    question: "Which C++11 feature allows automatic type deduction?",
    options: ["var", "auto", "type", "infer"],
    correctAnswer: 1,
    explanation:
      'The "auto" keyword in C++11 allows the compiler to automatically deduce the type of a variable.',
    difficulty: "advanced",
    category: "modern-cpp",
    chapter: "Modern C++ Features",
    points: 35,
  },
];

export const getQuestionsByCategory = (categoryId: string): QuizQuestion[] => {
  return quizQuestions.filter((question) => question.category === categoryId);
};

export const getCategoriesByLevel = (
  level: "beginner" | "intermediate" | "advanced",
): QuizCategory[] => {
  return quizCategories.filter((category) => category.level === level);
};

export const getCategoriesByChapter = (chapter: number): QuizCategory[] => {
  return quizCategories.filter((category) => category.chapter === chapter);
};
