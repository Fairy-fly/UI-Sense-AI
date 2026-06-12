import { Badge } from "@/components/ui/badge";
import { SectionCard } from "@/components/common/section-card";
import { displayStyleTag, displayColor, displayLayout } from "@/lib/display-labels";

interface StyleOverviewProps {
  preferredStyles: string[];
  dislikedStyles: string[];
  preferredColors: string[];
  preferredLayouts: string[];
}

export function StyleOverview({
  preferredStyles,
  dislikedStyles,
  preferredColors,
  preferredLayouts,
}: StyleOverviewProps) {

  return (
    <SectionCard
      title="审美概览"
      description="基于已收藏参考的视觉偏好画像。"
    >
      <div className="space-y-4">
        <div>
          <p className="mb-1.5 text-[12px] font-medium text-muted-foreground">偏好风格</p>
          <div className="flex flex-wrap gap-1.5">
            {preferredStyles.map((s) => (
              <Badge key={s} variant="secondary" className="text-[11px]">{displayStyleTag(s)}</Badge>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-1.5 text-[12px] font-medium text-muted-foreground">不喜欢</p>
          <div className="flex flex-wrap gap-1.5">
            {dislikedStyles.map((s) => (
              <Badge key={s} variant="outline" className="text-[11px] text-muted-foreground">{s}</Badge>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-1.5 text-[12px] font-medium text-muted-foreground">偏好配色</p>
          <div className="flex flex-wrap gap-1.5">
            {preferredColors.map((c) => (
              <Badge key={c} variant="secondary" className="text-[11px]">{displayColor(c)}</Badge>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-1.5 text-[12px] font-medium text-muted-foreground">布局偏好</p>
          <div className="flex flex-wrap gap-1.5">
            {preferredLayouts.map((l) => (
              <Badge key={l} variant="secondary" className="text-[11px]">{displayLayout(l)}</Badge>
            ))}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
