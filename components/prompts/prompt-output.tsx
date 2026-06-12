import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const samplePrompt = `# UI Design Prompt — AI Research Dashboard

## 1. Project Overview
Build a modern SaaS dashboard for AI researchers to manage experiments,
track model performance, and collaborate on research artifacts.

## 2. UI Style Direction
**Target aesthetic:** Minimal SaaS, calm productivity tool, neutral palette.
**Reference:** Linear's command palette + Vercel's developer tool feel.
**Avoid:** Bright blue admin panels, heavy shadows, gradient buttons.

## 3. Design System Requirements

### Color Palette
- Background: #FAFAFA (page), #FFFFFF (cards)
- Foreground: #18181B (text), #71717A (secondary text)
- Borders: #E4E4E7 (card borders), #F4F4F5 (subtle separators)
- Primary: #18181B (buttons, active states)
- Accent: #EEF2FF (badge backgrounds), #3730A3 (badge text)
- Semantic: #EF4444 (destructive), #22C55E (success)

### Typography
- Font: Inter / Geist Sans — tracking-tight for headings
- Scale: 12/13/14/15/18/28/36px
- Weights: 400 body, 500 card titles, 600 page headings

### Spacing
- Page: max-width 1280px, padding 24-32px
- Cards: padding 24px, gap 16-24px between modules
- Buttons: height 32-36px, padding 12-16px horizontal

### Component Style
- Cards: white bg, 1px border #E4E4E7, 14px radius
- Buttons: 10px radius, dark bg primary, outline secondary
- Badges: 8px radius, low-saturation, muted background
- Inputs: 10px radius, 1px border, subtle focus ring
- Tables: minimal borders, zebra striping optional

## 4. Page Structure

### Dashboard (/)
- Welcome header + taste summary
- 4 stat cards (inspirations, high-rated, tags, prompts)
- Recent inspirations grid (2 columns)
- Taste overview panel

### Experiments (/experiments)
- Filterable table with status badges
- Quick actions: new, duplicate, archive
- Detail panel slides in from right

### Model Analytics (/models)
- Performance charts (line + bar)
- Model comparison table
- Version history timeline

## 5. Anti-Patterns to Avoid
- No bright blue (#2563EB) primary buttons
- No heavy box-shadows (>4px blur)
- No gradient backgrounds on cards
- No rainbow-colored sidebar
- No cramped table layouts
- No default template styling

## 6. Tech Stack
- Next.js 15 (App Router)
- TypeScript (strict)
- Tailwind CSS 4
- shadcn/ui components
- Prisma + SQLite

## 7. Development Order
1. Design system tokens + layout shell
2. Dashboard page with stat cards
3. Experiments list + CRUD
4. Model analytics with charts
5. Polish, responsive, empty states

## 8. Acceptance Criteria
- Feels like a premium SaaS tool, not an admin panel
- Colors are neutral and calming
- Information hierarchy is clear
- Responsive on desktop (1280px+) and laptop (1024px)
- Keyboard navigation works for power users`;

export function PromptOutput() {
  return (
    <div className="flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[14px] font-medium text-foreground">生成的 Prompt</h3>
        <Button variant="outline" size="sm" className="rounded-[10px]">
          <Copy className="h-3.5 w-3.5" />
          复制
        </Button>
      </div>

      <Separator className="mb-4" />

      <div className="rounded-xl border border-border bg-muted/30 p-5">
        <pre className="whitespace-pre-wrap font-mono text-[12px] leading-relaxed text-foreground">
          {samplePrompt}
        </pre>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        <Button variant="outline" size="sm" className="rounded-[10px]">
          <Copy className="h-3.5 w-3.5" />
          复制 Prompt
        </Button>
        <Button size="sm" className="rounded-[10px]">
          保存记录
        </Button>
      </div>
    </div>
  );
}

export { samplePrompt };
