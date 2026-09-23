// Academic configuration data — mirrors the course/stream/branch logic
// from the original Python script, structured for the web form.

export type StreamKey = "science" | "commerce" | "arts";

export type Course = {
  id: string;
  name: string;
  years: number;
  hasBranch?: boolean;
};

export const STREAMS: { key: StreamKey; label: string; description: string }[] = [
  {
    key: "science",
    label: "Science & Engineering",
    description: "B.Tech, MBBS, B.Sc, BDS and more",
  },
  {
    key: "commerce",
    label: "Commerce & Management",
    description: "B.Com, BBA, BMS, BBA LL.B",
  },
  {
    key: "arts",
    label: "Arts, Humanities & Social Sciences",
    description: "B.A, BCA, B.F.A, LL.B",
  },
];

export const COURSES: Record<StreamKey, Course[]> = {
  science: [
    { id: "btech", name: "B.Tech / B.E", years: 4, hasBranch: true },
    { id: "mbbs", name: "MBBS", years: 5 },
    { id: "bsc", name: "B.Sc", years: 3 },
    { id: "bds", name: "BDS", years: 5 },
  ],
  commerce: [
    { id: "bcom", name: "B.Com", years: 3 },
    { id: "bba", name: "BBA", years: 3 },
    { id: "bms", name: "BMS", years: 3 },
    { id: "bbalib", name: "BBA LL.B", years: 5 },
  ],
  arts: [
    { id: "ba", name: "B.A", years: 3 },
    { id: "bca", name: "BCA", years: 3 },
    { id: "bfa", name: "B.F.A", years: 4 },
    { id: "llb", name: "LL.B", years: 3 },
  ],
};

export const BRANCHES = [
  "CSE",
  "ECE",
  "Civil",
  "IT",
  "EEE",
  "CSE Specialization",
] as const;

export const SPECIALIZATIONS = [
  "CSE (AI & ML)",
  "CSE (AI & Data Science)",
  "CSE (Cyber Security)",
  "CSE (Data Science)",
  "CSE (IoT)",
] as const;

export const CLASS_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1);

export function getStreamLabel(key: StreamKey): string {
  return STREAMS.find((s) => s.key === key)?.label ?? "";
}
