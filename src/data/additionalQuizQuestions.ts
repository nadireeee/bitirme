import { QuizQuestion } from "./quizData";

export const additionalQuizQuestions: QuizQuestion[] = [
  // More Introduction to C++ Questions
  {
    id: "intro-3",
    question: "C++ dilinin geliştiricisi kimdir?",
    options: [
      "Dennis Ritchie",
      "Bjarne Stroustrup",
      "Linus Torvalds",
      "James Gosling",
    ],
    correctAnswer: 1,
    explanation:
      "C++ dili 1980'lerde Bjarne Stroustrup tarafından Bell Labs'ta geliştirilmiştir.",
    difficulty: "beginner",
    category: "intro-basics",
    chapter: "Introduction to C++",
    points: 5,
  },
  {
    id: "intro-4",
    question: "Which of the following is NOT a characteristic of C++?",
    options: [
      "Object-oriented programming",
      "Low-level memory management",
      "Automatic garbage collection",
      "Template programming",
    ],
    correctAnswer: 2,
    explanation:
      "C++ does not have automatic garbage collection like Java or C#. Memory management is manual.",
    difficulty: "beginner",
    category: "intro-basics",
    chapter: "Introduction to C++",
    points: 10,
  },
  {
    id: "intro-5",
    question:
      "C++ programının çalıştırılabilir dosyaya dönüştürülme süreci nedir?",
    options: [
      "Sadece derleme",
      "Sadece bağlama",
      "Derleme ve bağlama",
      "Sadece yorumlama",
    ],
    correctAnswer: 2,
    explanation:
      "C++ programları önce derleyici ile nesne koduna derlenir, sonra bağlayıcı ile çalıştırılabilir dosyaya dönüştürülür.",
    difficulty: "beginner",
    category: "development-environment",
    chapter: "Development Environment",
    points: 10,
  },

  // More C++ Basics Questions
  {
    id: "basics-3",
    question:
      "What is the correct way to declare and initialize an integer variable with value 42?",
    options: [
      "int x = 42;",
      "integer x = 42;",
      "int x(42);",
      "Both A and C are correct",
    ],
    correctAnswer: 3,
    explanation:
      "Both int x = 42; (copy initialization) and int x(42); (direct initialization) are valid ways to declare and initialize an integer.",
    difficulty: "beginner",
    category: "cpp-basics",
    chapter: "C++ Basics",
    points: 10,
  },
  {
    id: "basics-4",
    question: "C++'da hangi sembol tek satır yorum için kullanılır?",
    options: ["/* */", "//", "#", "--"],
    correctAnswer: 1,
    explanation:
      "C++'da tek satır yorumlar // sembolleri ile başlar ve satır sonuna kadar devam eder.",
    difficulty: "beginner",
    category: "cpp-basics",
    chapter: "C++ Basics",
    points: 5,
  },
  {
    id: "basics-5",
    question:
      "Which header file is required for input/output operations in C++?",
    options: ["<stdio.h>", "<iostream>", "<input.h>", "<output.h>"],
    correctAnswer: 1,
    explanation:
      "The <iostream> header file contains declarations for cin, cout, and other I/O stream objects.",
    difficulty: "beginner",
    category: "iostream-operations",
    chapter: "Input/Output Operations",
    points: 10,
  },
  {
    id: "iostream-1",
    question: "cout nesnesinin hangi namespace'e ait olduğunu belirtiniz:",
    options: ["global", "std", "iostream", "cpp"],
    correctAnswer: 1,
    explanation:
      "cout nesnesi std namespace'ine aittir ve std::cout şeklinde kullanılır.",
    difficulty: "beginner",
    category: "iostream-operations",
    chapter: "Input/Output Operations",
    points: 10,
  },

  // More Functions Questions
  {
    id: "functions-2",
    question: "What is function overloading in C++?",
    options: [
      "Using the same function name with different parameters",
      "Using different function names with same parameters",
      "Using virtual functions",
      "Using static functions",
    ],
    correctAnswer: 0,
    explanation:
      "Function overloading allows multiple functions with the same name but different parameter lists.",
    difficulty: "intermediate",
    category: "functions-basics",
    chapter: "Functions",
    points: 15,
  },
  {
    id: "functions-3",
    question:
      "C++'da fonksiyon parametrelerine varsayılan değer atanabilir mi?",
    options: [
      "Hayır, mümkün değil",
      "Evet, tüm parametrelere atanabilir",
      "Evet, sadece sağdan başlayarak atanabilir",
      "Sadece ilk parametreye atanabilir",
    ],
    correctAnswer: 2,
    explanation:
      "Varsayılan parametreler sadece sağdan başlayarak (en sondaki parametrelerden başlayarak) atanabilir.",
    difficulty: "intermediate",
    category: "functions-basics",
    chapter: "Functions",
    points: 20,
  },
  {
    id: "functions-4",
    question: 'What does the "inline" keyword suggest to the compiler?',
    options: [
      "To make the function virtual",
      "To expand the function code at the call site",
      "To make the function static",
      "To make the function const",
    ],
    correctAnswer: 1,
    explanation:
      "The inline keyword suggests to the compiler to expand the function code at the call site instead of making a function call.",
    difficulty: "intermediate",
    category: "functions-basics",
    chapter: "Functions",
    points: 20,
  },

  // More Arrays Questions
  {
    id: "arrays-2",
    question: "C++'da dizi elemanlarına nasıl erişilir?",
    options: [
      "Nokta (.) operatörü ile",
      "Ok (->) operatörü ile",
      "Köşeli parantez [] operatörü ile",
      "Yıldız (*) operatörü ile",
    ],
    correctAnswer: 2,
    explanation:
      "Dizi elemanlarına köşeli parantez [] operatörü ile erişilir. Örnek: array[0]",
    difficulty: "beginner",
    category: "arrays",
    chapter: "Arrays",
    points: 15,
  },
  {
    id: "arrays-3",
    question: "What is the index of the first element in a C++ array?",
    options: ["1", "0", "-1", "It depends on declaration"],
    correctAnswer: 1,
    explanation:
      "Arrays in C++ are zero-indexed, meaning the first element is at index 0.",
    difficulty: "beginner",
    category: "arrays",
    chapter: "Arrays",
    points: 10,
  },
  {
    id: "arrays-4",
    question: "Çok boyutlu dizi nasıl tanımlanır?",
    options: [
      "int array[5,3];",
      "int array[5][3];",
      "int array(5)(3);",
      "int array{5,3};",
    ],
    correctAnswer: 1,
    explanation:
      "Çok boyutlu diziler int array[satır][sütun]; şeklinde tanımlanır.",
    difficulty: "intermediate",
    category: "arrays",
    chapter: "Arrays",
    points: 20,
  },

  // More Strings Questions
  {
    id: "strings-1",
    question: "std::string ile C-style string arasındaki fark nedir?",
    options: [
      "Hiçbir fark yoktur",
      "std::string daha güvenli ve kolaydır",
      "C-style string daha güvenlidir",
      "Sadece performans farkı vardır",
    ],
    correctAnswer: 1,
    explanation:
      "std::string sınıfı otomatik bellek yönetimi ve birçok kullanışlı fonksiyon sağlar, bu da onu daha güvenli ve kullanımı kolay hale getirir.",
    difficulty: "intermediate",
    category: "strings",
    chapter: "Strings",
    points: 20,
  },
  {
    id: "strings-2",
    question: "How do you get the length of a std::string?",
    options: [
      "string.length()",
      "string.size()",
      "Both A and B",
      "string.count()",
    ],
    correctAnswer: 2,
    explanation:
      "Both length() and size() methods return the number of characters in a std::string.",
    difficulty: "intermediate",
    category: "strings",
    chapter: "Strings",
    points: 15,
  },

  // More OOP Questions
  {
    id: "oop-2",
    question: "Constructor nedir ve ne zaman çağrılır?",
    options: [
      "Nesne yokedilirken çağrılan fonksiyon",
      "Nesne oluşturulurken çağrılan özel fonksiyon",
      "Nesne kopyalanırken çağrılan fonksiyon",
      "Static fonksiyon",
    ],
    correctAnswer: 1,
    explanation:
      "Constructor, nesne oluşturulurken otomatik olarak çağrılan özel bir üye fonksiyondur ve nesneyi başlatmak için kullanılır.",
    difficulty: "intermediate",
    category: "oop-basics",
    chapter: "OOP Fundamentals",
    points: 25,
  },
  {
    id: "oop-3",
    question: "What is encapsulation in OOP?",
    options: [
      "Creating multiple objects",
      "Hiding internal implementation details",
      "Inheriting from another class",
      "Overriding methods",
    ],
    correctAnswer: 1,
    explanation:
      "Encapsulation is the principle of hiding internal implementation details and exposing only necessary interfaces.",
    difficulty: "intermediate",
    category: "oop-basics",
    chapter: "OOP Fundamentals",
    points: 25,
  },
  {
    id: "inheritance-1",
    question: "Kalıtımın (inheritance) amacı nedir?",
    options: [
      "Kod tekrarını önlemek",
      "Mevcut sınıfların özelliklerini yeniden kullanmak",
      "Kod organizasyonunu sağlamak",
      "Hepsi doğru",
    ],
    correctAnswer: 3,
    explanation:
      "Kalıtım kod tekrarını önler, mevcut sınıfların özelliklerini yeniden kullanır ve kod organizasyonunu sağlar.",
    difficulty: "intermediate",
    category: "inheritance-polymorphism",
    chapter: "Inheritance & Polymorphism",
    points: 30,
  },
  {
    id: "inheritance-2",
    question: "What is polymorphism in C++?",
    options: [
      "Having multiple constructors",
      "Using the same interface for different types",
      "Creating multiple objects",
      "Using multiple inheritance",
    ],
    correctAnswer: 1,
    explanation:
      "Polymorphism allows using the same interface to work with different types, achieved through virtual functions.",
    difficulty: "advanced",
    category: "inheritance-polymorphism",
    chapter: "Inheritance & Polymorphism",
    points: 35,
  },

  // Advanced Template Questions
  {
    id: "templates-2",
    question: "Template specialization nedir?",
    options: [
      "Template'in belirli türler için özelleştirilmesi",
      "Template'in genel hale getirilmesi",
      "Template'in silinmesi",
      "Template'in kopyalanması",
    ],
    correctAnswer: 0,
    explanation:
      "Template specialization, genel template'in belirli veri türleri için özel implementasyonlar sağlamasıdır.",
    difficulty: "advanced",
    category: "templates",
    chapter: "Templates",
    points: 35,
  },
  {
    id: "templates-3",
    question:
      "What is the difference between class template and function template?",
    options: [
      "No difference",
      "Class templates create template classes, function templates create template functions",
      "Class templates are faster",
      "Function templates are more flexible",
    ],
    correctAnswer: 1,
    explanation:
      "Class templates allow creating template classes while function templates allow creating template functions.",
    difficulty: "advanced",
    category: "templates",
    chapter: "Templates",
    points: 30,
  },

  // STL Questions
  {
    id: "stl-1",
    question: "STL'in ana bileşenleri nelerdir?",
    options: [
      "Sadece konteynerler",
      "Konteynerler, algoritmalar ve iteratörler",
      "Sadece algoritmalar",
      "Sadece iteratörler",
    ],
    correctAnswer: 1,
    explanation:
      "STL üç ana bileşenden oluşur: konteynerler (containers), algoritmalar (algorithms) ve iteratörler (iterators).",
    difficulty: "advanced",
    category: "stl",
    chapter: "Standard Template Library",
    points: 30,
  },
  {
    id: "stl-2",
    question:
      "Which STL container provides constant time insertion and deletion?",
    options: ["vector", "list", "array", "stack"],
    correctAnswer: 1,
    explanation:
      "std::list provides constant time insertion and deletion at any position as it is implemented as a doubly-linked list.",
    difficulty: "advanced",
    category: "stl",
    chapter: "Standard Template Library",
    points: 35,
  },

  // Modern C++ Questions
  {
    id: "modern-2",
    question: "Range-based for loop nasıl kullanılır?",
    options: [
      "for(int i=0; i<size; i++)",
      "for(auto element : container)",
      "for(auto i in container)",
      "for(element of container)",
    ],
    correctAnswer: 1,
    explanation:
      'Range-based for loop C++11\'de tanıtılmış olup "for(auto element : container)" şeklinde kullanılır.',
    difficulty: "advanced",
    category: "modern-cpp",
    chapter: "Modern C++ Features",
    points: 30,
  },
  {
    id: "modern-3",
    question: "What does nullptr represent in C++11?",
    options: [
      "A null character",
      "A null pointer constant",
      "An empty string",
      "Zero value",
    ],
    correctAnswer: 1,
    explanation:
      "nullptr is a null pointer constant introduced in C++11 that represents a null pointer value.",
    difficulty: "advanced",
    category: "modern-cpp",
    chapter: "Modern C++ Features",
    points: 35,
  },
  {
    id: "modern-4",
    question: "Lambda expressions C++'da nasıl tanımlanır?",
    options: ["function() {}", "[]() {}", "lambda() {}", "auto() {}"],
    correctAnswer: 1,
    explanation:
      "Lambda expressions C++11'de tanıtılmış olup [capture](parameters){body} şeklinde tanımlanır.",
    difficulty: "advanced",
    category: "modern-cpp",
    chapter: "Modern C++ Features",
    points: 40,
  },
];
