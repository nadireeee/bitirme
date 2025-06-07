// Simple fallback translations for mobile compatibility
export const fallbackTranslations = {
  tr: {
    navigation: {
      home: "Ana Sayfa",
      courses: "Kurslar",
      exercises: "Egzersizler",
      aiChat: "AI Sohbet",
      profile: "Profil",
      codeEditor: "Kod Editörü",
      quiz: "Quiz",
      forum: "Forum",
      progress: "İlerleme",
      aiMentor: "AI Mentor",
      courseDetail: "Kurs Detayı",
    },
    common: {
      error: "Hata",
      success: "Başarılı",
      cancel: "İptal",
      ok: "Tamam",
      loading: "Yükleniyor...",
      save: "Kaydet",
      delete: "Sil",
      edit: "Düzenle",
      all: "Tümü",
    },
    login: {
      welcome: "Hoş Geldiniz",
      subtitle: "CodeMentor AI'ya giriş yapın veya hesap oluşturun",
      signIn: "Giriş Yap",
      signUp: "Kayıt Ol",
      email: "E-posta",
      password: "Şifre",
      forgotPassword: "Şifremi unuttum",
      fillAllFields: "Lütfen tüm alanları doldurun.",
    },
    home: {
      title: "CodeMentor AI",
      subtitle: "C ve C++ Programlamayı Öğrenmenin En İyi Yolu",
      description:
        "Yapay zeka destekli interaktif platformumuzla sıfırdan C ve C++ programlama dillerini öğrenin.",
      getStarted: "Başlayın",
      watchDemo: "Demo İzleyin",
    },
  },
  en: {
    navigation: {
      home: "Home",
      courses: "Courses",
      exercises: "Exercises",
      aiChat: "AI Chat",
      profile: "Profile",
      codeEditor: "Code Editor",
      quiz: "Quiz",
      forum: "Forum",
      progress: "Progress",
      aiMentor: "AI Mentor",
      courseDetail: "Course Detail",
    },
    common: {
      error: "Error",
      success: "Success",
      cancel: "Cancel",
      ok: "OK",
      loading: "Loading...",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
      all: "All",
    },
    login: {
      welcome: "Welcome",
      subtitle: "Sign in to CodeMentor AI or create an account",
      signIn: "Sign In",
      signUp: "Sign Up",
      email: "Email",
      password: "Password",
      forgotPassword: "Forgot Password",
      fillAllFields: "Please fill all fields.",
    },
    home: {
      title: "CodeMentor AI",
      subtitle: "The Best Way to Learn C/C++ Programming",
      description:
        "Learn C and C++ programming languages from scratch with our AI-powered interactive platform.",
      getStarted: "Get Started",
      watchDemo: "Watch Demo",
    },
  },
};

// Simple translation function fallback
export const fallbackT = (
  key: string,
  defaultValue?: string,
  language: string = "tr",
) => {
  const keys = key.split(".");
  let value =
    fallbackTranslations[language as keyof typeof fallbackTranslations];

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = value[k as keyof typeof value];
    } else {
      return defaultValue || key;
    }
  }

  return typeof value === "string" ? value : defaultValue || key;
};
