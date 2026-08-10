import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AppFlow, APP_SCREENS } from "../components/AppFlow";
import type { AppScreen } from "../components/AppFlow";
import { curriculumDatabase } from "@/data/curriculum";

/* Named screen stories — one per state in the shared contract, so every
   learner, researcher, and system screen can be inspected directly. */

const meta = {
  title: "Application/Screens",
  component: AppFlow,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Every required screen and state from the shared contract, addressable by name: enrollment (welcome, login, register, enroll, mission intro, avatar), core path (dashboard, island, activity renderers, completion), final-exam states, profile/settings, offline/install, researcher view, and access denied.",
      },
    },
  },
} satisfies Meta<typeof AppFlow>;

export default meta;
type Story = StoryObj<typeof meta>;

const screenStory = (screen: AppScreen): Story => ({
  args: { islands: curriculumDatabase.islands, initialScreen: screen, showScreenPicker: false },
});

// Enrollment & onboarding
export const Welcome: Story = screenStory("welcome");
export const Login: Story = screenStory("login");
export const Register: Story = screenStory("register");
export const Enroll: Story = screenStory("enroll");
export const MissionIntro: Story = screenStory("mission");
export const AvatarSelect: Story = screenStory("avatar");

// Core learner path
export const Dashboard: Story = screenStory("dashboard");
export const Island: Story = screenStory("island");
export const ReadingActivity: Story = screenStory("lessonReading");
export const VideoActivity: Story = screenStory("lessonVideo");
export const VentLab: Story = screenStory("ventSim");
export const QuizMcq: Story = screenStory("quiz");
export const QuizFeedback: Story = screenStory("quizFeedback");
export const QuizMatching: Story = screenStory("quizMatch");
export const QuizDragDrop: Story = screenStory("quizDrag");
export const QuizFillBlank: Story = screenStory("quizFill");
export const CaseVignette: Story = screenStory("caseVignette");
export const Quest: Story = screenStory("quest");
export const ActivityComplete: Story = screenStory("activityComplete");
export const IslandComplete: Story = screenStory("islandComplete");

// Final exam states
export const FinalExamIntro: Story = screenStory("finalExamIntro");
export const FinalExamQuestion: Story = screenStory("finalExamQuestion");
export const ExamResults: Story = screenStory("examResults");
export const CourseComplete: Story = screenStory("courseComplete");

// Account & system
export const Profile: Story = screenStory("profile");
export const Settings: Story = screenStory("settings");
export const OfflineInstall: Story = screenStory("offline");
export const Researcher: Story = screenStory("researcher");
export const AccessDenied: Story = screenStory("accessDenied");

/* Sanity: the named stories above must cover the whole screen contract. */
const covered = new Set<AppScreen>([
  "welcome", "login", "register", "enroll", "mission", "avatar",
  "dashboard", "island", "lessonReading", "lessonVideo", "ventSim",
  "quiz", "quizFeedback", "quizMatch", "quizDrag", "quizFill",
  "caseVignette", "quest", "activityComplete", "islandComplete",
  "finalExamIntro", "finalExamQuestion", "examResults", "courseComplete",
  "profile", "settings", "researcher", "offline", "accessDenied",
]);
for (const s of APP_SCREENS) {
  if (!covered.has(s)) throw new Error(`Screen "${s}" is missing a named story`);
}
