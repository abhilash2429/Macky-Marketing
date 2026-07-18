export const sourceUrl = "https://github.com/abhilash2429/macky";

export const capabilityVideos = [
  {
    title: "Talk to your Mac",
    label: "Push to talk",
    description:
      "Hold your shortcut, speak naturally, and release. Macky answers aloud and can take supported actions without opening a chat window.",
    video: "/assets/notch.mp4",
  },
  {
    title: "Dictate into the right field",
    label: "Ctrl + Fn dictation",
    description:
      "A separate safety-first dictation path validates the focused editable field, listens while you hold Ctrl + Fn, and inserts one final result only if the same field is still focused.",
    video: "/assets/ocr.mp4",
  },
  {
    title: "Understand what is on screen",
    label: "On-demand vision",
    description:
      "When you ask for visual help, Macky can capture fresh screen context and reason about what is in front of you. It does not continuously record your screen.",
    video: "/assets/bulk-copy.mp4",
  },
  {
    title: "Control macOS by voice",
    label: "Native Mac actions",
    description:
      "Open apps and websites, change volume, toggle Do Not Disturb, lock the screen, operate visible UI, create reminders, and work with your calendar.",
    video: "/assets/inline.mp4",
  },
  {
    title: "Work across connected apps",
    label: "Cloud connectors",
    description:
      "Connect Gmail, Slack, Spotify, Google Calendar, Notion, GitHub, and Linear as you need them, then make clear requests in your own words.",
    video: "/assets/reminders.mp4",
  },
  {
    title: "Bring files into the conversation",
    label: "Files as context",
    description:
      "Drop images, PDFs, text, and other readable files into the notch panel, add a prompt, and let Macky use them in the active conversation.",
    video: "/assets/quick-paste.mp4",
  },
  {
    title: "Stay in the live moment",
    label: "Session context",
    description:
      "Macky keeps the thread of your active realtime conversation, including the context and tool results you provide during that session.",
    video: "/assets/library.mp4",
  },
];

export const connectors = [
  { name: "Gmail", icon: "/assets/gmail.svg", example: "Read my unread email." },
  { name: "Slack", icon: "/assets/slack.svg", example: "Tell the team the fix is live." },
  { name: "Spotify", icon: "/assets/spotify.svg", example: "Play something focused." },
  { name: "Google Calendar", icon: "/assets/googlecalendar.svg", example: "What is on tomorrow?" },
  { name: "Notion", icon: "/assets/notion.svg", example: "Find the launch brief." },
  { name: "GitHub", icon: "/assets/github.svg", example: "Check the open pull requests." },
  { name: "Linear", icon: "/assets/linear.svg", example: "Move the issue to done." },
];

export const nextCapabilities = [
  {
    status: "Coming next",
    title: "State Memory",
    description:
      "Durable, user-controlled context that can carry useful preferences, project state, and decisions across sessions without turning Macky into an always-on activity log.",
    details: ["Explicit memory controls", "Project and preference context", "Review and delete what is remembered"],
  },
  {
    status: "Coming next",
    title: "Sub-agents",
    description:
      "Specialized workers Macky can delegate bounded pieces of a larger request to, while the main voice session remains the place you direct and review the work.",
    details: ["Parallel bounded tasks", "Visible ownership and progress", "Results returned to the main session"],
  },
  {
    status: "Preview",
    title: "Skills",
    description:
      "A catalog for focused workflows such as meeting preparation, email assistance, research, code review, team updates, and music control. Behavioral wiring is still in progress.",
    details: ["Meeting Assistant", "Email Assistant", "Research and Code Review"],
  },
];

export const faqs = [
  {
    question: "What is Macky?",
    answer:
      "Macky is a macOS, notch-first, push-to-talk AI assistant. Hold a shortcut, speak, and it can answer or take supported actions across your Mac and the services you connect.",
  },
  {
    question: "Which Macs does Macky support?",
    answer:
      "Macky targets macOS 14.2 or later. Macs with a physical notch get the native notch experience; other Macs use a top-center floating bar.",
  },
  {
    question: "Is Macky always listening?",
    answer:
      "No. Assistant audio and dictation begin only while you hold their configured shortcuts. The microphone is not intended to run continuously in the background.",
  },
  {
    question: "Does Macky constantly record my screen?",
    answer:
      "No. Screen context is captured on demand for a request that needs visual understanding. You control the macOS Screen Recording permission.",
  },
  {
    question: "How is dictation different from the assistant?",
    answer:
      "Ctrl + Fn dictation is a separate text-only path. It does not speak, call tools, send a message, press Return, or submit a form. It revalidates the original text field before inserting anything.",
  },
  {
    question: "Which services can I connect?",
    answer:
      "The current app surfaces Gmail, Slack, Spotify, Google Calendar, Notion, GitHub, and Linear. Native Calendar, Reminders, system controls, app launching, and screen actions are implemented locally on the Mac.",
  },
  {
    question: "Does Macky remember me across sessions?",
    answer:
      "Today Macky keeps context during the active realtime session, while preferences and account identity persist separately. Durable State Memory is planned next and is not shipped yet.",
  },
  {
    question: "Does Macky use sub-agents today?",
    answer:
      "Not yet. The current product uses one realtime assistant with local tools and an optional cloud connector gateway. Sub-agent delegation is on the roadmap.",
  },
  {
    question: "Can I interrupt Macky while it is speaking?",
    answer:
      "Yes. Hold the push-to-talk shortcut again and Macky stops playback and starts listening to the new turn.",
  },
  {
    question: "Can I build Macky myself?",
    answer:
      "Yes. Macky is available as source code on GitHub. The current repository includes the native Swift app, Cloudflare Worker, setup documentation, and release tooling.",
  },
];

export type UpdatePost = {
  slug: string;
  date: string;
  title: string;
  intro: string[];
  items: string[];
  outro?: string;
};

export const updates: UpdatePost[] = [
  {
    slug: "realtime-dictation-pipeline",
    date: "Jul 15, 2026",
    title: "Dictation moves to Azure Realtime mini",
    intro: ["Macky now uses a dedicated, on-demand realtime path for safe Ctrl + Fn dictation."],
    items: [
      "One authenticated text-only realtime session per dictation.",
      "Literal, Clean, and Smart formatting modes.",
      "Focused-field validation before recording and again before insertion.",
      "No assistant tools, speech output, auto-send, or partial typing in dictation mode.",
    ],
  },
  {
    slug: "foreground-context-and-focused-editing",
    date: "Jul 14, 2026",
    title: "Safer focused editing and app context",
    intro: ["A focused pass on making text editing useful without losing control of where text is written."],
    items: [
      "Optional current-app identity during a voice turn.",
      "Focused browser text editing support.",
      "Compact-notch safety notices and copy fallback when focus changes.",
      "On-demand screen dimensions aligned with the active display.",
    ],
  },
  {
    slug: "connectors-and-native-actions",
    date: "Jul 10, 2026",
    title: "Real sessions for connectors and native Mac actions",
    intro: ["Macky replaced hard-coded connector identity with session-backed access and strengthened the native action layer."],
    items: [
      "Anonymous or email-verified session identity stored in Keychain.",
      "Gmail, Slack, Spotify, Google Calendar, Notion, GitHub, and Linear connector catalog.",
      "Calendar, Reminders, screen context, system controls, cursor actions, and app launching.",
      "Barge-in and persistent realtime socket lifecycle improvements.",
    ],
  },
];

export const privacySections = [
  ["Last updated: July 15, 2026", "This page summarizes the privacy behavior visible in the current Macky source code. It should be reviewed before a public production release."],
  ["1. Push-to-talk audio", "Macky is designed to capture assistant and dictation audio only while their shortcuts are held. Audio is sent through the configured realtime service to produce a response or final dictation result."],
  ["2. Screen context", "Macky does not continuously record the screen. A fresh screenshot may be captured and sent when a request needs visual context. Screen Recording permission is controlled in macOS Settings."],
  ["3. Files and conversation context", "Files, images, screenshots, and text you deliberately attach may be added to the active realtime conversation. Do not attach information you are not authorized to process."],
  ["4. Account and connector identity", "Session identity is stored in the macOS Keychain. Connector sessions and related identity metadata may be stored by the configured Cloudflare Worker and Composio services."],
  ["5. Analytics", "When configured in a production build, Macky may send limited product events such as numeric latency, tool success or failure, connector funnel steps, and categorical dictation outcomes. The analytics layer is a no-op when no PostHog key is configured."],
  ["6. Memory", "The current app does not save a local activity history across launches. Preferences persist in UserDefaults, account/session identity persists in Keychain, and the live realtime service holds context for the active session. Durable State Memory is not shipped yet."],
  ["7. Connected services", "Actions involving Gmail, Slack, Spotify, Google Calendar, Notion, GitHub, or Linear are handled through their respective APIs and Composio. Their own privacy terms apply."],
  ["8. Contact", "For privacy questions or deletion requests related to a deployed Macky service, contact the operator of that deployment through the project repository."],
];

export const termsSections = [
  ["Last updated: July 15, 2026", "These starter terms describe the current open-source Macky project and are not a substitute for legal review before commercial release."],
  ["1. The software", "Macky is a macOS voice assistant project that can respond through audio and take supported actions through local tools and connected services."],
  ["2. Your responsibility", "You are responsible for reviewing requests before speaking them, the accounts and permissions you connect, and the consequences of actions Macky performs on your instruction."],
  ["3. Permissions", "Features may require Microphone, Accessibility, Screen Recording, Calendar, or Reminders permissions. You can revoke these in macOS Settings, which may disable related functionality."],
  ["4. Third-party services", "Realtime inference, authentication, analytics, and connected-app actions can depend on third-party providers. Their availability, pricing, terms, and data practices are outside the project’s control."],
  ["5. Experimental features", "Macky is under active development. Skills, State Memory, sub-agents, and other roadmap items may be incomplete, change materially, or never ship in their current form."],
  ["6. No warranty", "The software is provided without warranties or guarantees of uninterrupted operation, accuracy, security, compatibility, or fitness for a particular purpose, subject to the repository license and applicable law."],
  ["7. Source license", "Use, modification, and distribution of the source code are governed by the licenses included in the Macky repository and its dependencies."],
  ["8. Contact", "Project questions and issue reports can be submitted through the Macky GitHub repository."],
];
