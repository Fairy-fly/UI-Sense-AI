/**
 * CSS-based mock UI preview — simulates a UI screenshot without external images.
 * Each preview has a unique gradient and layout hint matching the mock data.
 */

interface MockPreviewProps {
  variant: string;
  className?: string;
}

const variants: Record<string, { bg: string; accent: string; text: string; label: string }> = {
  generic: {
    bg: "from-[#F5F5F4] via-[#ECECEA] to-[#F5F5F4]",
    accent: "bg-zinc-400",
    text: "bg-zinc-700",
    label: "UI 预览",
  },
  linear: {
    bg: "from-[#1A1A1A] via-[#262626] to-[#1A1A1A]",
    accent: "bg-[#5E6AD2]",
    text: "bg-white/90",
    label: "Linear",
  },
  vercel: {
    bg: "from-[#000000] via-[#111111] to-[#000000]",
    accent: "bg-[#7928CA]",
    text: "bg-white/90",
    label: "Vercel",
  },
  raycast: {
    bg: "from-[#F5F5F4] via-[#ECECEA] to-[#F5F5F4]",
    accent: "bg-[#FF6363]",
    text: "bg-black/80",
    label: "Raycast",
  },
  notion: {
    bg: "from-[#FFFBFA] via-[#F7F6F3] to-[#FFFBFA]",
    accent: "bg-[#E16259]",
    text: "bg-black/80",
    label: "Notion",
  },
  stripe: {
    bg: "from-[#F6F9FC] via-[#EDF2F7] to-[#F6F9FC]",
    accent: "bg-[#635BFF]",
    text: "bg-black/80",
    label: "Stripe",
  },
  figma: {
    bg: "from-[#1E1E1E] via-[#2C2C2C] to-[#1E1E1E]",
    accent: "bg-[#A259FF]",
    text: "bg-white/90",
    label: "Figma",
  },
  arc: {
    bg: "from-[#E8E0F0] via-[#DDD6E8] to-[#E8E0F0]",
    accent: "bg-[#FC6150]",
    text: "bg-black/80",
    label: "Arc",
  },
  github: {
    bg: "from-[#F6F8FA] via-[#EDEFF2] to-[#F6F8FA]",
    accent: "bg-[#0969DA]",
    text: "bg-black/80",
    label: "GitHub",
  },
};

export function MockPreview({ variant, className = "" }: MockPreviewProps) {
  const v = variants[variant] ?? variants.generic;

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${v.bg} ${className}`}>
      {/* Simulated sidebar */}
      <div className="absolute left-0 top-0 h-full w-[28%] border-r border-white/[0.06] bg-black/[0.03]" />
      {/* Simulated header */}
      <div className="absolute right-0 top-0 h-[18%] w-[72%] border-b border-white/[0.06]" />
      {/* Accent element */}
      <div className={`absolute right-[8%] top-[28%] h-3 w-16 rounded-full opacity-40 ${v.accent}`} />
      <div className={`absolute right-[20%] top-[40%] h-2 w-10 rounded-full opacity-20 ${v.accent}`} />
      {/* Text lines */}
      <div className={`absolute left-[34%] top-[30%] h-1.5 w-[35%] rounded-full opacity-40 ${v.text}`} />
      <div className={`absolute left-[34%] top-[38%] h-1.5 w-[25%] rounded-full opacity-25 ${v.text}`} />
      <div className={`absolute left-[34%] top-[46%] h-1 w-[18%] rounded-full opacity-15 ${v.text}`} />
      {/* Card preview */}
      <div className="absolute bottom-[12%] left-[34%] right-[6%] h-[32%] rounded-xl border border-white/[0.06] bg-white/[0.03]" />
      {/* Label */}
      <div className="absolute bottom-3 right-4 rounded-md bg-black/20 px-2 py-0.5 text-[10px] font-medium text-white/60 backdrop-blur-sm">
        {v.label}
      </div>
    </div>
  );
}

/** Map inspiration variant names to mock preview variants */
export function getPreviewVariant(id: string): string {
  const map: Record<string, string> = {
    "insp-001": "linear",
    "insp-002": "vercel",
    "insp-003": "raycast",
    "insp-004": "notion",
    "insp-005": "stripe",
    "insp-006": "figma",
    "insp-007": "arc",
    "insp-008": "github",
  };
  return map[id] ?? "generic";
}

/** Get a color label from a tag name */
export function getColorLabel(tagColor: string | null): string {
  if (!tagColor) return "bg-muted-foreground/30";
  const map: Record<string, string> = {
    neutral: "bg-stone-400",
    zinc: "bg-zinc-400",
    slate: "bg-slate-400",
    stone: "bg-stone-500",
    violet: "bg-violet-400",
    indigo: "bg-indigo-400",
    amber: "bg-amber-400",
  };
  return map[tagColor] ?? "bg-muted-foreground/30";
}
