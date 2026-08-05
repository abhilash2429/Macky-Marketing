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
      "A separate safety-first dictation path validates the focused field, listens while you hold Ctrl + Fn, and inserts one final result only if the same field is still active.",
    video: "/assets/ocr.mp4",
  },
  {
    title: "Understand what is on screen",
    label: "On-demand vision",
    description:
      "When you ask for visual help, Macky captures fresh screen context and reasons about what is in front of you. It does not continuously record your screen.",
    video: "/assets/bulk-copy.mp4",
  },
  {
    title: "Control macOS by voice",
    label: "Native Mac actions",
    description:
      "Open apps and websites, change volume, toggle Do Not Disturb, lock the screen, set a reminder, check the calendar, or take care of another supported Mac task.",
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
      "Drop images, PDFs, text, and other readable files into the notch panel, and Macky will use them alongside the active conversation.",
    video: "/assets/quick-paste.mp4",
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
    status: "Live Feature",
    title: "State Memory",
    description:
      "Durable, user-controlled context that carries preferences, project state, and decisions across sessions — visible and removable at any time.",
    details: ["Explicit memory controls", "Project and preference context", "Review and delete what is remembered"],
  },
  {
    status: "Live Feature",
    title: "Sub-agents",
    description:
      "Specialized workers Macky can delegate bounded pieces of a larger request to, while the main voice session remains the place you direct and review the work.",
    details: ["Parallel bounded tasks", "Visible ownership and progress", "Results returned to the main session"],
  },
  {
    status: "Preview",
    title: "Skills",
    description:
      "A catalog for focused workflows such as meeting preparation, email assistance, research, code review, team updates, and music control.",
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
      "No. Audio capture begins only while you hold the configured shortcut. The microphone is not intended to run continuously in the background.",
  },
  {
    question: "Does Macky constantly record the screen?",
    answer:
      "No. Screen context is captured on demand when a request needs visual understanding. You control the macOS Screen Recording permission.",
  },
  {
    question: "How is dictation different from the assistant?",
    answer:
      "Ctrl + Fn dictation is a separate text-only path. It does not speak, call tools, send a message, press Return, or submit a form. It revalidates the original text field before inserting anything.",
  },
  {
    question: "Which services can be connected?",
    answer:
      "The current app surfaces Gmail, Slack, Spotify, Google Calendar, Notion, GitHub, and Linear. Calendar, Reminders, system controls, app launching, and screen actions are handled locally on the Mac.",
  },
  {
    question: "Does Macky remember context across sessions?",
    answer:
      "Yes. State Memory carries forward the context, preferences, and decisions that make future conversations easier. You can review or remove anything Macky remembers.",
  },
  {
    question: "Can Macky hand off work?",
    answer:
      "Yes. Macky can split a larger request into focused pieces — research, code, or app actions — work on them in parallel, and bring everything back to the main session.",
  },
  {
    question: "Can Macky be interrupted while speaking?",
    answer:
      "Yes. Hold the push-to-talk shortcut again and Macky stops playback and starts listening to the new turn.",
  },
  {
    question: "How do you get access?",
    answer:
      "Macky is opening early access in small groups. Join the waitlist and you'll be notified when a spot is ready.",
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
    title: "Dictation moves to a dedicated realtime path",
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
    intro: ["A focused pass on making text editing more useful without losing control of where text is written."],
    items: [
      "Optional current-app context during a voice turn.",
      "Focused browser text editing support.",
      "Safety notices and copy fallback when focus changes.",
      "Screen dimensions aligned with the active display.",
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

export type LegalDocument = {
  eyebrow: string;
  title: string;
  summary: string;
  lastUpdated: string;
  notice?: string;
  highlights: { title: string; description: string }[];
  sections: { title: string; paragraphs: string[] }[];
};

export const privacyDocument: LegalDocument = {
  eyebrow: "Privacy",
  title: "Your privacy",
  summary:
    "A clear look at what Macky uses, what you choose to share, and when it leaves your Mac.",
  lastUpdated: "August 4, 2026",
  notice:
    "Macky is in early access. The person or organization running the Macky service you use chooses its service providers, settings, and data-retention practices.",
  highlights: [
    { title: "You start the interaction", description: "Macky uses audio, screen context, and files only when you ask it to." },
    { title: "You control permissions", description: "macOS permissions control access to your microphone, screen, calendars, reminders, and accessibility features." },
    { title: "You choose connected accounts", description: "A third-party account is involved only after you decide to connect and use it." },
  ],
  sections: [
    {
      title: "What this covers",
      paragraphs: [
        "This page covers the Macky website, early-access requests, and the Macky app. It does not replace the privacy notice of a connected service you decide to use.",
        "When you request early access, Macky sends the email address you provide to its configured waitlist service so it can manage your request. A site host may also process the basic technical information needed to serve the website.",
      ],
    },
    {
      title: "Audio, screen context, and attachments",
      paragraphs: [
        "Macky captures assistant and dictation audio while you hold the relevant shortcut. When you ask for visual help, it can take a fresh screenshot; it is not meant to continuously record your screen.",
        "Files, images, screenshots, and text you deliberately attach can be part of the active conversation. Only share material you are allowed to use.",
      ],
    },
    {
      title: "Permissions and local controls",
      paragraphs: [
        "Features can require macOS permissions, including Microphone, Screen Recording, Accessibility, Calendar, and Reminders. You can review or revoke these permissions in macOS Settings, though doing so may turn off the related feature.",
        "Macky's memory is designed to stay in your control. You can review or remove remembered information from the app you use.",
      ],
    },
    {
      title: "Service providers and connected accounts",
      paragraphs: [
        "Macky can send the information needed to handle your request to its configured realtime, authentication, connector, or analytics providers. Connected services such as Gmail, Slack, Spotify, Google Calendar, Notion, GitHub, and Linear have their own terms and privacy practices.",
        "Before you connect an account, review the permissions Macky and the service request. You can disconnect an account or revoke access through the relevant app or service provider.",
      ],
    },
    {
      title: "Questions about your data",
      paragraphs: [
        "For questions about retention, deletion, or privacy in the Macky service you use, contact the service operator directly. Do not send passwords, access tokens, or other secrets in a support request.",
      ],
    },
  ],
};

export const termsDocument: LegalDocument = {
  eyebrow: "Terms",
  title: "Terms of use",
  summary:
    "The practical ground rules for using Macky and requesting early access.",
  lastUpdated: "August 4, 2026",
  notice:
    "Macky is in early access, so the experience will keep changing as more people use it and share what works.",
  highlights: [
    { title: "Early access", description: "Access may be limited, change over time, or be paused while Macky improves." },
    { title: "You stay in control", description: "You choose the requests, permissions, and accounts Macky can work with." },
    { title: "Connected services have their own terms", description: "The platforms you connect set their own rules, availability, and pricing." },
  ],
  sections: [
    {
      title: "Using Macky",
      paragraphs: [
        "Macky is a macOS voice assistant. It can respond through audio and help with supported actions on your Mac or in the apps you choose to connect.",
        "These terms apply to the Macky website, early-access requests, and the Macky service you use.",
      ],
    },
    {
      title: "Responsible use",
      paragraphs: [
        "You are responsible for the requests you make, the information you provide, the accounts you connect, and the actions you approve. Use Macky only with permissions and content you are allowed to use.",
        "Review any action that can affect messages, files, records, settings, or connected accounts before asking Macky to take it.",
      ],
    },
    {
      title: "Permissions and third-party services",
      paragraphs: [
        "Some features require macOS permissions, including Microphone, Accessibility, Screen Recording, Calendar, or Reminders access. You can revoke these permissions in macOS Settings, though the related feature may stop working.",
        "Macky can rely on third-party services for realtime inference, authentication, analytics, and connected-app actions. Their availability, pricing, terms, and data practices follow their own policies.",
      ],
    },
    {
      title: "Changes and availability",
      paragraphs: [
        "Macky is growing quickly, so features, integrations, and access can change. Do not rely on a feature for a high-stakes workflow without checking it first.",
        "To the extent allowed by law, Macky is provided as is, without a promise of uninterrupted operation, accuracy, security, compatibility, or fitness for a particular purpose.",
      ],
    },
    {
      title: "Early-access requests",
      paragraphs: [
        "Submitting your email requests early access; it does not guarantee a place or a particular date. If access becomes available, Macky may use the email you provided to contact you about it.",
      ],
    },
  ],
};
