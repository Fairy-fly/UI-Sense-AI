import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sparkles } from "lucide-react";
import {
  projectTypes,
  defaultStyleTags,
  defaultTechStack,
  dislikedStyleExamples,
} from "@/lib/constants";

export function PromptForm() {
  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1.5 block text-[13px] font-medium text-foreground">项目名称</label>
        <Input placeholder="例如：AI 研究仪表盘" className="rounded-[10px]" />
      </div>

      <div>
        <label className="mb-1.5 block text-[13px] font-medium text-foreground">项目类型</label>
        <Select>
          <SelectTrigger className="rounded-[10px]">
            <SelectValue placeholder="选择类型..." />
          </SelectTrigger>
          <SelectContent>
            {projectTypes.map((type) => (
              <SelectItem key={type} value={type.toLowerCase()}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="mb-1.5 block text-[13px] font-medium text-foreground">目标用户</label>
        <Input placeholder="例如：开发者、设计师" className="rounded-[10px]" />
      </div>

      <div>
        <label className="mb-1.5 block text-[13px] font-medium text-foreground">参考灵感</label>
        <Select>
          <SelectTrigger className="rounded-[10px]">
            <SelectValue placeholder="选择参考灵感..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="insp-001">Linear — Project Dashboard</SelectItem>
            <SelectItem value="insp-002">Vercel — Deployment Overview</SelectItem>
            <SelectItem value="insp-003">Raycast — Quick Search</SelectItem>
            <SelectItem value="insp-004">Notion — Database View</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="mb-1.5 block text-[13px] font-medium text-foreground">期望风格</label>
        <div className="flex flex-wrap gap-1.5">
          {defaultStyleTags.slice(0, 6).map((tag) => (
            <Badge key={tag} variant="outline" className="cursor-pointer text-[11px] transition-colors hover:bg-muted">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-[13px] font-medium text-foreground">避免的风格</label>
        <div className="flex flex-wrap gap-1.5">
          {dislikedStyleExamples.slice(0, 5).map((style) => (
            <Badge key={style} variant="outline" className="cursor-pointer text-[11px] text-muted-foreground transition-colors hover:bg-muted">
              {style}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-[13px] font-medium text-foreground">技术栈</label>
        <div className="flex flex-wrap gap-1.5">
          {defaultTechStack.map((tech) => (
            <Badge key={tech} variant="secondary" className="text-[11px]">{tech}</Badge>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-[13px] font-medium text-foreground">页面列表</label>
        <Textarea placeholder="仪表盘、设置、项目详情、数据分析..." className="min-h-[60px] rounded-[10px]" />
      </div>

      <div>
        <label className="mb-1.5 block text-[13px] font-medium text-foreground">补充说明</label>
        <Textarea placeholder="任何特殊需求或限制条件..." className="min-h-[60px] rounded-[10px]" />
      </div>

      <Separator />

      <Button className="w-full rounded-[10px]">
        <Sparkles className="h-3.5 w-3.5" />
        生成 Prompt
      </Button>
    </div>
  );
}
