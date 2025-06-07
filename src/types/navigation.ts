export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  CodeEditor: { exerciseId?: string };
  Quiz: { quizId?: string };
  Forum: undefined;
  Progress: undefined;
  AIMentor: undefined;
  CourseDetail: { courseId: string | number };
};

export type MainTabParamList = {
  Home: undefined;
  Courses: undefined;
  Exercises: undefined;
  AIChat: undefined;
  Profile: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
