import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  ClipboardList,
  GraduationCap,
  Hash,
  Layers,
  Plus,
  RotateCcw,
  School,
  Trash2,
  User as UserIcon,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import heroImg from "@/assets/hero-academic.jpg";
import {
  BRANCHES,
  CLASS_OPTIONS,
  COURSES,
  SPECIALIZATIONS,
  STREAMS,
  getStreamLabel,
  type StreamKey,
} from "@/lib/academic-config";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Academic Record Portal — Student & Institution Manager" },
      {
        name: "description",
        content:
          "Capture institutional and student academic records through a guided, professional multi-step form.",
      },
      { property: "og:title", content: "Academic Record Portal" },
      {
        property: "og:description",
        content:
          "Capture institutional and student academic records through a guided, professional multi-step form.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AcademicPortal,
});

type Level = "school" | "college";

type Student = {
  id: number;
  roll: string;
  name: string;
  section: string;
  marks: string[];
};

const STEPS = [
  { id: 1, label: "Academic Details", icon: GraduationCap },
  { id: 2, label: "Student Records", icon: Users },
  { id: 3, label: "Summary", icon: ClipboardList },
];

function AcademicPortal() {
  const [step, setStep] = useState(1);
  const [level, setLevel] = useState<Level | "">("");

  // School fields
  const [schoolName, setSchoolName] = useState("");
  const [className, setClassName] = useState("");

  // College fields
  const [collegeName, setCollegeName] = useState("");
  const [streamKey, setStreamKey] = useState<StreamKey | "">("");
  const [courseId, setCourseId] = useState("");
  const [year, setYear] = useState("");
  const [branch, setBranch] = useState("");
  const [specialization, setSpecialization] = useState("");

  // Students
  const [students, setStudents] = useState<Student[]>([
    { id: 1, roll: "", name: "", section: "", marks: [""] },
  ]);

  const courses = streamKey ? COURSES[streamKey] : [];
  const selectedCourse = courses.find((c) => c.id === courseId);

  function resetCollegeFields() {
    setCourseId("");
    setYear("");
    setBranch("");
    setSpecialization("");
  }

  function validateStep1(): boolean {
    if (!level) {
      toast.error("Please choose School or College.");
      return false;
    }
    if (level === "school") {
      if (!schoolName.trim()) {
        toast.error("Enter the school name.");
        return false;
      }
      if (!className) {
        toast.error("Select a class (1–12).");
        return false;
      }
      return true;
    }
    // college
    if (!collegeName.trim()) {
      toast.error("Enter the college name.");
      return false;
    }
    if (!streamKey) {
      toast.error("Select a stream.");
      return false;
    }
    if (!courseId) {
      toast.error("Select a course.");
      return false;
    }
    if (!year) {
      toast.error("Select the year.");
      return false;
    }
    if (selectedCourse?.hasBranch && !branch) {
      toast.error("Select a branch.");
      return false;
    }
    if (branch === "CSE Specialization" && !specialization) {
      toast.error("Select a specialization.");
      return false;
    }
    return true;
  }

  function validateStep2(): boolean {
    if (students.length === 0) {
      toast.error("Add at least one student.");
      return false;
    }
    for (const s of students) {
      const idx = students.indexOf(s) + 1;
      if (!s.roll.trim()) {
        toast.error(`Student ${idx}: enter a roll number.`);
        return false;
      }
      if (!s.name.trim()) {
        toast.error(`Student ${idx}: enter a name.`);
        return false;
      }
      if (!s.section.trim()) {
        toast.error(`Student ${idx}: enter a section.`);
        return false;
      }
      const validMarks = s.marks.filter((m) => m.trim() !== "");
      if (validMarks.length === 0) {
        toast.error(`Student ${idx}: add at least one subject mark.`);
        return false;
      }
      if (validMarks.some((m) => isNaN(Number(m)))) {
        toast.error(`Student ${idx}: all marks must be numbers.`);
        return false;
      }
    }
    return true;
  }

  function goNext() {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
    setStep((s) => Math.min(3, s + 1));
  }

  function goBack() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setStep((s) => Math.max(1, s - 1));
  }

  // ---- student helpers ----
  function updateStudent(id: number, patch: Partial<Student>) {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    );
  }

  function updateMark(id: number, index: number, value: string) {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, marks: s.marks.map((m, i) => (i === index ? value : m)) }
          : s,
      ),
    );
  }

  function addMark(id: number) {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, marks: [...s.marks, ""] } : s)),
    );
  }

  function removeMark(id: number, index: number) {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, marks: s.marks.filter((_, i) => i !== index) }
          : s,
      ),
    );
  }

  function addStudent() {
    setStudents((prev) => [
      ...prev,
      {
        id: (prev.at(-1)?.id ?? 0) + 1,
        roll: "",
        name: "",
        section: "",
        marks: [""],
      },
    ]);
  }

  function removeStudent(id: number) {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  }

  function startOver() {
    setStep(1);
    setLevel("");
    setSchoolName("");
    setClassName("");
    setCollegeName("");
    setStreamKey("");
    resetCollegeFields();
    setStudents([{ id: 1, roll: "", name: "", section: "", marks: [""] }]);
    toast.success("All records cleared.");
  }

  const totals = useMemo(() => {
    const map: Record<number, number> = {};
    for (const s of students) {
      map[s.id] = s.marks
        .filter((m) => m.trim() !== "" && !isNaN(Number(m)))
        .reduce((acc, m) => acc + Number(m), 0);
    }
    return map;
  }, [students]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header banner */}
      <header className="relative overflow-hidden bg-deep">
        <img
          src={heroImg}
          alt=""
          aria-hidden="true"
          width={1920}
          height={720}
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-deep via-deep/85 to-deep/40" />
        <div className="relative mx-auto max-w-3xl px-6 py-14 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
            <GraduationCap className="h-7 w-7" />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Academic Record Portal
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-balance text-sm text-indigo-100/90 sm:text-base">
            Capture institution details and student marks through a clean,
            guided workflow. Built for accuracy and clarity.
          </p>
        </div>
      </header>

      <main className="mx-auto -mt-8 max-w-3xl px-4 pb-20 sm:px-6">
        {/* Stepper */}
        <nav aria-label="Progress" className="mb-8">
          <ol className="flex items-center justify-center gap-2 sm:gap-4">
            {STEPS.map((s, i) => {
              const isActive = step === s.id;
              const isDone = step > s.id;
              return (
                <li key={s.id} className="flex items-center gap-2 sm:gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={[
                        "flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                        isDone
                          ? "border-primary bg-primary text-primary-foreground"
                          : isActive
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-card text-muted-foreground",
                      ].join(" ")}
                    >
                      {isDone ? "✓" : s.id}
                    </div>
                    <span
                      className={[
                        "hidden text-xs font-medium sm:block",
                        isActive ? "text-foreground" : "text-muted-foreground",
                      ].join(" ")}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className={[
                        "h-0.5 w-8 sm:w-16",
                        isDone ? "bg-primary" : "bg-border",
                      ].join(" ")}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Step 1 — Academic details */}
        {step === 1 && (
          <Card className="shadow-xl shadow-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <School className="h-5 w-5 text-primary" />
                Academic Details
              </CardTitle>
              <CardDescription>
                Select the level of education and provide the institution
                information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Level selection */}
              <div className="space-y-3">
                <Label>Level of education</Label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {(
                    [
                      {
                        key: "school",
                        title: "School",
                        desc: "Classes 1–12",
                        icon: School,
                      },
                      {
                        key: "college",
                        title: "College",
                        desc: "Degree & stream",
                        icon: Building2,
                      },
                    ] as const
                  ).map((opt) => {
                    const active = level === opt.key;
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => {
                          setLevel(opt.key);
                          // clear the other path's fields when switching
                          if (opt.key === "school") {
                            setCollegeName("");
                            setStreamKey("");
                            resetCollegeFields();
                          } else {
                            setSchoolName("");
                            setClassName("");
                          }
                        }}
                        className={[
                          "flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all",
                          active
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "border-border bg-card hover:border-primary/40",
                        ].join(" ")}
                      >
                        <opt.icon
                          className={[
                            "mt-0.5 h-6 w-6",
                            active ? "text-primary" : "text-muted-foreground",
                          ].join(" ")}
                        />
                        <div>
                          <p className="font-semibold text-foreground">
                            {opt.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {opt.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <Separator />

              {/* School fields */}
              {level === "school" && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="school-name">School name</Label>
                    <Input
                      id="school-name"
                      placeholder="e.g. Delhi Public School"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Class</Label>
                    <Select
                      value={className}
                      onValueChange={setClassName}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select class (1–12)" />
                      </SelectTrigger>
                      <SelectContent>
                        {CLASS_OPTIONS.map((c) => (
                          <SelectItem key={c} value={String(c)}>
                            Class {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* College fields */}
              {level === "college" && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="college-name">College name</Label>
                    <Input
                      id="college-name"
                      placeholder="e.g. National Institute of Technology"
                      value={collegeName}
                      onChange={(e) => setCollegeName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Stream</Label>
                    <Select
                      value={streamKey}
                      onValueChange={(v) => {
                        setStreamKey(v as StreamKey);
                        resetCollegeFields();
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select stream" />
                      </SelectTrigger>
                      <SelectContent>
                        {STREAMS.map((s) => (
                          <SelectItem key={s.key} value={s.key}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {streamKey && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Course</Label>
                        <Select
                          value={courseId}
                          onValueChange={(v) => {
                            setCourseId(v);
                            setYear("");
                            setBranch("");
                            setSpecialization("");
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select course" />
                          </SelectTrigger>
                          <SelectContent>
                            {courses.map((c) => (
                              <SelectItem key={c.id} value={c.id}>
                                {c.name} · {c.years} yr
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Year</Label>
                        <Select
                          value={year}
                          onValueChange={setYear}
                          disabled={!selectedCourse}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder={
                                selectedCourse
                                  ? `1–${selectedCourse.years}`
                                  : "Select course first"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedCourse &&
                              Array.from(
                                { length: selectedCourse.years },
                                (_, i) => i + 1,
                              ).map((y) => (
                                <SelectItem key={y} value={String(y)}>
                                  Year {y}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {selectedCourse?.hasBranch && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Branch</Label>
                        <Select
                          value={branch}
                          onValueChange={(v) => {
                            setBranch(v);
                            setSpecialization("");
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select branch" />
                          </SelectTrigger>
                          <SelectContent>
                            {BRANCHES.map((b) => (
                              <SelectItem key={b} value={b}>
                                {b}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {branch === "CSE Specialization" && (
                        <div className="space-y-2">
                          <Label>Specialization</Label>
                          <Select
                            value={specialization}
                            onValueChange={setSpecialization}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select specialization" />
                            </SelectTrigger>
                            <SelectContent>
                              {SPECIALIZATIONS.map((sp) => (
                                <SelectItem key={sp} value={sp}>
                                  {sp}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 2 — Student records */}
        {step === 2 && (
          <div className="space-y-4">
            <Card className="shadow-xl shadow-primary/5">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Student Records
                  </CardTitle>
                  <CardDescription>
                    Enter details and marks for each student.
                  </CardDescription>
                </div>
                <Button type="button" variant="outline" onClick={addStudent}>
                  <Plus className="h-4 w-4" />
                  Add student
                </Button>
              </CardHeader>
            </Card>

            {students.map((s, i) => (
              <Card key={s.id} className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="h-8 px-3 text-sm">
                      #{i + 1}
                    </Badge>
                    <CardTitle className="text-base">
                      {s.name || "Unnamed student"}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-primary">
                      Total: {totals[s.id]?.toFixed(2)}
                    </span>
                    {students.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeStudent(s.id)}
                        aria-label="Remove student"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor={`roll-${s.id}`}>Roll number</Label>
                      <Input
                        id={`roll-${s.id}`}
                        placeholder="e.g. 21"
                        value={s.roll}
                        onChange={(e) =>
                          updateStudent(s.id, { roll: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`name-${s.id}`}>Name</Label>
                      <Input
                        id={`name-${s.id}`}
                        placeholder="Full name"
                        value={s.name}
                        onChange={(e) =>
                          updateStudent(s.id, { name: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`section-${s.id}`}>Section</Label>
                      <Input
                        id={`section-${s.id}`}
                        placeholder="e.g. A"
                        value={s.section}
                        onChange={(e) =>
                          updateStudent(s.id, { section: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-muted-foreground" />
                        Subject marks
                      </Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => addMark(s.id)}
                      >
                        <Plus className="h-4 w-4" />
                        Add subject
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {s.marks.map((m, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="relative">
                            <Hash className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              type="number"
                              inputMode="decimal"
                              placeholder={`S${idx + 1}`}
                              value={m}
                              onChange={(e) =>
                                updateMark(s.id, idx, e.target.value)
                              }
                              className="w-28 pl-8"
                            />
                          </div>
                          {s.marks.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeMark(s.id, idx)}
                              aria-label="Remove subject"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Step 3 — Summary */}
        {step === 3 && (
          <div className="space-y-4">
            <Card className="shadow-xl shadow-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-primary" />
                  Academic Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                  {level === "school" ? (
                    <>
                      <SummaryRow icon={School} label="School" value={schoolName} />
                      <SummaryRow
                        icon={Hash}
                        label="Class"
                        value={className ? `Class ${className}` : "—"}
                      />
                    </>
                  ) : (
                    <>
                      <SummaryRow icon={Building2} label="College" value={collegeName} />
                      <SummaryRow
                        icon={Layers}
                        label="Stream"
                        value={streamKey ? getStreamLabel(streamKey) : "—"}
                      />
                      <SummaryRow
                        icon={GraduationCap}
                        label="Course"
                        value={selectedCourse?.name ?? "—"}
                      />
                      <SummaryRow
                        icon={Hash}
                        label="Year"
                        value={year ? `Year ${year}` : "—"}
                      />
                      {selectedCourse?.hasBranch && (
                        <SummaryRow
                          icon={Layers}
                          label="Branch"
                          value={branch || "—"}
                        />
                      )}
                      {branch === "CSE Specialization" && (
                        <SummaryRow
                          icon={GraduationCap}
                          label="Specialization"
                          value={specialization || "—"}
                        />
                      )}
                    </>
                  )}
                </dl>
              </CardContent>
            </Card>

            <Card className="shadow-xl shadow-primary/5">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Students
                </CardTitle>
                <Badge variant="secondary">
                  {students.length}{" "}
                  {students.length === 1 ? "student" : "students"}
                </Badge>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Roll No</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Section</TableHead>
                        <TableHead className="text-right">Total Marks</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map((s) => (
                        <TableRow key={s.id}>
                          <TableCell className="font-medium">{s.roll}</TableCell>
                          <TableCell>{s.name}</TableCell>
                          <TableCell>{s.section}</TableCell>
                          <TableCell className="text-right font-semibold text-primary">
                            {totals[s.id]?.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          {step > 1 ? (
            <Button variant="outline" onClick={goBack}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          ) : (
            <span />
          )}

          {step < 3 ? (
            <Button onClick={goNext}>
              {step === 1 ? "Continue" : "Review summary"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={startOver} variant="outline">
              <RotateCcw className="h-4 w-4" />
              Start over
            </Button>
          )}
        </div>
      </main>

      <footer className="border-t bg-card/50 py-6">
        <p className="text-center text-xs text-muted-foreground">
          Academic Record Portal · Captures institution & student data in a
          single session.
        </p>
      </footer>
    </div>
  );
}

function SummaryRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </dt>
        <dd className="truncate font-medium text-foreground">{value}</dd>
      </div>
    </div>
  );
}
