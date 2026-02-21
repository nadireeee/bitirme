import {
  PrismaClient,
  QuizLevel,
  CourseLevel,
  UserRole,
  ExperienceLevel,
} from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 12);
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@codementor.ai" },
    update: {},
    create: {
      email: "admin@codementor.ai",
      username: "admin",
      password: hashedPassword,
      firstName: "Admin",
      lastName: "User",
      role: UserRole.ADMIN,
      profile: {
        create: {
          experienceLevel: ExperienceLevel.EXPERT,
          bio: "CodeMentor AI Platform Administrator",
        },
      },
    },
  });

  console.log("✅ Admin user created");

  // Create sample user
  const userPassword = await bcrypt.hash("user123", 12);
  const sampleUser = await prisma.user.upsert({
    where: { email: "user@codementor.ai" },
    update: {},
    create: {
      email: "user@codementor.ai",
      username: "testuser",
      password: userPassword,
      firstName: "Test",
      lastName: "User",
      role: UserRole.STUDENT,
      profile: {
        create: {
          experienceLevel: ExperienceLevel.BEGINNER,
          bio: "Learning C++ programming",
        },
      },
    },
  });

  console.log("✅ Sample user created");

  // Create achievements
  const achievements = [
    {
      key: "first_quiz",
      title: "First Step",
      titleTR: "İlk Adım",
      description: "Completed your first quiz!",
      descriptionTR: "İlk quizinizi tamamladınız!",
      icon: "trophy",
      color: "#10b981",
      points: 10,
    },
    {
      key: "perfect_score",
      title: "Perfect",
      titleTR: "Mükemmel",
      description: "Got a perfect score on a quiz!",
      descriptionTR: "Bir quizden tam puan aldınız!",
      icon: "star",
      color: "#f59e0b",
      points: 50,
    },
    {
      key: "quiz_master",
      title: "Quiz Master",
      titleTR: "Quiz Ustası",
      description: "Completed 10 quizzes!",
      descriptionTR: "10 quiz tamamladınız!",
      icon: "school",
      color: "#8b5cf6",
      points: 100,
    },
    {
      key: "high_achiever",
      title: "High Achiever",
      titleTR: "Yüksek Başarı",
      description: "Your average score is above 80!",
      descriptionTR: "Ortalama puanınız 80'in üzerinde!",
      icon: "trending-up",
      color: "#3b82f6",
      points: 75,
    },
    {
      key: "consistent_learner",
      title: "Consistent Learner",
      titleTR: "Düzenli Öğrenci",
      description: "Solved quizzes for 7 consecutive days!",
      descriptionTR: "7 gün üst üste quiz çözdünüz!",
      icon: "calendar",
      color: "#ef4444",
      points: 150,
    },
    {
      key: "expert_level",
      title: "Expert Level",
      titleTR: "Uzman Seviye",
      description: "Completed 3 advanced level quizzes!",
      descriptionTR: "3 ileri seviye quiz tamamladınız!",
      icon: "rocket",
      color: "#06b6d4",
      points: 200,
    },
    {
      key: "speed_demon",
      title: "Speed Demon",
      titleTR: "Hız Şeytanı",
      description: "Completed a quiz in record time!",
      descriptionTR: "Bir quizi rekor sürede tamamladınız!",
      icon: "flash",
      color: "#ec4899",
      points: 125,
    },
  ];

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { key: achievement.key },
      update: {},
      create: achievement,
    });
  }

  console.log("✅ Achievements created");

  // Create quiz categories
  const quizCategories = [
    {
      id: "intro-basics",
      title: "Introduction to C++",
      titleTR: "C++'a Giriş",
      description: "Basic concepts of C++ programming",
      descriptionTR: "C++ programlamanın temel kavramları",
      level: QuizLevel.BEGINNER,
      chapter: 0,
      icon: "school",
      color: "#10b981",
      estimatedTime: 15,
      totalQuestions: 5,
      passingScore: 70,
      order: 1,
    },
    {
      id: "development-environment",
      title: "Development Environment",
      titleTR: "Geliştirme Ortamı",
      description: "IDE, compiler, and development tools",
      descriptionTR: "IDE, derleyici ve geliştirme araçları",
      level: QuizLevel.BEGINNER,
      chapter: 0,
      icon: "build",
      color: "#10b981",
      estimatedTime: 12,
      totalQuestions: 4,
      passingScore: 70,
      order: 2,
    },
    {
      id: "cpp-basics",
      title: "C++ Basics",
      titleTR: "C++ Temelleri",
      description: "Variables, statements, and basic syntax",
      descriptionTR: "Değişkenler, ifadeler ve temel sözdizimi",
      level: QuizLevel.BEGINNER,
      chapter: 1,
      icon: "code",
      color: "#3b82f6",
      estimatedTime: 20,
      totalQuestions: 6,
      passingScore: 75,
      order: 3,
    },
    {
      id: "functions-basics",
      title: "Functions",
      titleTR: "Fonksiyonlar",
      description: "Function definitions, parameters, and return values",
      descriptionTR: "Fonksiyon tanımları, parametreler ve dönüş değerleri",
      level: QuizLevel.INTERMEDIATE,
      chapter: 2,
      icon: "git-branch",
      color: "#8b5cf6",
      estimatedTime: 25,
      totalQuestions: 5,
      passingScore: 75,
      order: 4,
    },
    {
      id: "oop-basics",
      title: "OOP Fundamentals",
      titleTR: "OOP Temelleri",
      description: "Classes, objects, and basic OOP concepts",
      descriptionTR: "Sınıflar, nesneler ve temel OOP kavramları",
      level: QuizLevel.INTERMEDIATE,
      chapter: 4,
      icon: "cube",
      color: "#ef4444",
      estimatedTime: 35,
      totalQuestions: 4,
      passingScore: 85,
      order: 5,
    },
    {
      id: "modern-cpp",
      title: "Modern C++ Features",
      titleTR: "Modern C++ Özellikleri",
      description: "C++11, C++14, C++17, and C++20 features",
      descriptionTR: "C++11, C++14, C++17 ve C++20 özellikleri",
      level: QuizLevel.ADVANCED,
      chapter: 6,
      icon: "flash",
      color: "#8b5cf6",
      estimatedTime: 55,
      totalQuestions: 5,
      passingScore: 90,
      order: 6,
    },
  ];

  for (const category of quizCategories) {
    await prisma.quizCategory.upsert({
      where: { id: category.id },
      update: {},
      create: category,
    });
  }

  console.log("✅ Quiz categories created");

  // Create quiz questions
  const quizQuestions = [
    // Introduction to C++ Questions
    {
      categoryId: "intro-basics",
      question: "What does C++ stand for?",
      questionTR: "C++ ne anlama gelir?",
      options: [
        "C Plus Plus",
        "Computer Plus Plus",
        "Code Plus Plus",
        "Compiled Plus Plus",
      ],
      optionsTR: [
        "C Plus Plus",
        "Bilgisayar Plus Plus",
        "Kod Plus Plus",
        "Derlenmiş Plus Plus",
      ],
      correctAnswer: 0,
      explanation:
        'C++ is called "C Plus Plus" because it\'s an enhanced version of the C programming language.',
      explanationTR:
        'C++ "C Plus Plus" olarak adlandırılır çünkü C programlama dilinin geliştirilmiş versiyonudur.',
      difficulty: QuizLevel.BEGINNER,
      chapter: "Introduction to C++",
      points: 10,
      order: 1,
    },
    {
      categoryId: "intro-basics",
      question: "Who developed C++?",
      questionTR: "C++'ı kim geliştirdi?",
      options: [
        "Dennis Ritchie",
        "Bjarne Stroustrup",
        "Linus Torvalds",
        "James Gosling",
      ],
      optionsTR: [
        "Dennis Ritchie",
        "Bjarne Stroustrup",
        "Linus Torvalds",
        "James Gosling",
      ],
      correctAnswer: 1,
      explanation:
        "C++ was developed by Bjarne Stroustrup at Bell Labs in the 1980s.",
      explanationTR:
        "C++ 1980'lerde Bjarne Stroustrup tarafından Bell Labs'ta geliştirilmiştir.",
      difficulty: QuizLevel.BEGINNER,
      chapter: "Introduction to C++",
      points: 10,
      order: 2,
    },
    {
      categoryId: "intro-basics",
      question: "Which programming paradigms does C++ support?",
      questionTR: "C++ hangi programlama paradigmalarını destekler?",
      options: [
        "Only procedural programming",
        "Only object-oriented programming",
        "Procedural, object-oriented, and generic programming",
        "Only functional programming",
      ],
      optionsTR: [
        "Sadece prosedürel programlama",
        "Sadece nesne yönelimli programlama",
        "Prosedürel, nesne yönelimli ve genel programlama",
        "Sadece fonksiyonel programlama",
      ],
      correctAnswer: 2,
      explanation:
        "C++ is a multi-paradigm language supporting procedural, object-oriented, and generic programming.",
      explanationTR:
        "C++ çok paradigmalı bir dil olup prosedürel, nesne yönelimli ve genel programlamayı destekler.",
      difficulty: QuizLevel.BEGINNER,
      chapter: "Introduction to C++",
      points: 15,
      order: 3,
    },

    // C++ Basics Questions
    {
      categoryId: "cpp-basics",
      question: "Which of the following is a valid variable declaration?",
      questionTR: "Aşağıdakilerden hangisi geçerli bir değişken bildirimidir?",
      options: [
        "int 2number;",
        "int number-2;",
        "int number2;",
        "int number 2;",
      ],
      optionsTR: [
        "int 2number;",
        "int number-2;",
        "int number2;",
        "int number 2;",
      ],
      correctAnswer: 2,
      explanation:
        "Variable names must start with a letter or underscore, and can contain letters, digits, and underscores.",
      explanationTR:
        "Değişken isimleri harf veya alt çizgi ile başlamalı, harf, rakam ve alt çizgi içerebilir.",
      difficulty: QuizLevel.BEGINNER,
      chapter: "C++ Basics",
      points: 10,
      order: 1,
    },
    {
      categoryId: "cpp-basics",
      question: "What keyword is used to declare an integer variable?",
      questionTR:
        "Tamsayı değişkeni bildirmek için hangi anahtar kelime kullanılır?",
      options: ["integer", "int", "number", "whole"],
      optionsTR: ["integer", "int", "number", "whole"],
      correctAnswer: 1,
      explanation:
        'The "int" keyword is used to declare integer variables in C++.',
      explanationTR:
        'C++\'da tamsayı değişkenler "int" anahtar kelimesi ile bildirilir.',
      difficulty: QuizLevel.BEGINNER,
      chapter: "C++ Basics",
      points: 10,
      order: 2,
    },
  ];

  for (const [index, question] of quizQuestions.entries()) {
    await prisma.quizQuestion.create({
      data: {
        ...question,
        id: `question-${index + 1}`,
      },
    });
  }

  console.log("✅ Quiz questions created");

  // Create forum categories
  const forumCategories = [
    {
      name: "General Discussion",
      nameTR: "Genel Tartışma",
      description: "General programming discussions",
      descriptionTR: "Genel programlama tartışmaları",
      color: "#3b82f6",
      icon: "chatbubbles",
      order: 1,
    },
    {
      name: "C++ Help",
      nameTR: "C++ Yardım",
      description: "Get help with C++ programming",
      descriptionTR: "C++ programlama ile ilgili yardım alın",
      color: "#10b981",
      icon: "help-circle",
      order: 2,
    },
    {
      name: "Project Showcase",
      nameTR: "Proje Galerisi",
      description: "Share your C++ projects",
      descriptionTR: "C++ projelerinizi paylaşın",
      color: "#f59e0b",
      icon: "code-slash",
      order: 3,
    },
  ];

  for (const category of forumCategories) {
    await prisma.forumCategory.create({
      data: category,
    });
  }

  console.log("✅ Forum categories created");

  // Create sample courses
  const courses = [
    {
      title: "C++ Fundamentals",
      titleTR: "C++ Temelleri",
      description: "Learn the basics of C++ programming",
      descriptionTR: "C++ programlamanın temellerini öğrenin",
      level: CourseLevel.BEGINNER,
      duration: 20,
      isPublished: true,
      isFree: true,
      order: 1,
      content: {
        chapters: [
          { title: "Introduction", titleTR: "Giriş" },
          {
            title: "Variables and Data Types",
            titleTR: "Değişkenler ve Veri Türleri",
          },
          { title: "Control Structures", titleTR: "Kontrol Yapıları" },
        ],
      },
    },
    {
      title: "Object-Oriented Programming in C++",
      titleTR: "C++'da Nesne Yönelimli Programlama",
      description: "Master OOP concepts in C++",
      descriptionTR: "C++'da OOP kavramlarında ustalaşın",
      level: CourseLevel.INTERMEDIATE,
      duration: 35,
      isPublished: true,
      isFree: false,
      price: 99.99,
      order: 2,
      content: {
        chapters: [
          { title: "Classes and Objects", titleTR: "Sınıflar ve Nesneler" },
          { title: "Inheritance", titleTR: "Kalıtım" },
          { title: "Polymorphism", titleTR: "Çok Biçimlilik" },
        ],
      },
    },
  ];

  for (const course of courses) {
    await prisma.course.create({
      data: course,
    });
  }

  console.log("✅ Sample courses created");

  console.log("🎉 Database seeded successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seeding failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
