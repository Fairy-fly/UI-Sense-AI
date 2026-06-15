// Type definitions for UI Sense AI

// ---- Inspirations ----
export interface Inspiration {
  id: string;
  title: string;
  description: string | null;
  sourceUrl: string | null;
  imageUrl: string;
  previewVariant?: string;
  projectType: string | null;
  rating: number;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  tags?: Tag[];
  analysis?: AiAnalysis | null;
}

// ---- Tags ----
export interface Tag {
  id: string;
  name: string;
  category: TagCategory | null;
  color: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type TagCategory = "style" | "color" | "layout" | "component" | "mood" | "project_type";

// ---- AI Analysis ----
export interface AiAnalysis {
  id: string;
  inspirationId: string;
  colorAnalysis: string | null;
  layoutAnalysis: string | null;
  componentAnalysis: string | null;
  styleSummary: string | null;
  designKeywords: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ---- Prompt Records ----
export interface PromptRecord {
  id: string;
  title: string;
  targetProject: string;
  projectType: string | null;
  selectedInspirationIds: string;
  generatedPrompt: string;
  designSystemPrompt: string | null;
  pageLevelPrompt: string | null;
  componentLevelPrompt: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ---- User Preferences ----
export interface UserPreferences {
  id: string;
  preferredStyles: string | null;
  dislikedStyles: string | null;
  preferredColors: string | null;
  preferredLayouts: string | null;
  defaultTechStack: string | null;
  defaultUiStyle: string | null;
  updatedAt: Date;
  // Aesthetic memory (v1.7)
  aestheticSummary: string | null;
  aestheticPreferredStyles: string | null;
  aestheticPreferredColors: string | null;
  aestheticPreferredLayouts: string | null;
  aestheticPreferredComponents: string | null;
  aestheticAvoidedStyles: string | null;
  aestheticKeywords: string | null;
  aestheticAgentInstruction: string | null;
  aestheticSourceCount: number | null;
  aestheticGeneratedAt: Date | null;
}

// ---- Collections ----
export interface Collection {
  id: string;
  name: string;
  description: string | null;
  coverColor: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count?: { inspirations: number };
}

// ---- Prompt Builder Input ----
export interface PromptBuilderInput {
  projectName: string;
  projectDescription: string;
  targetUsers: string;
  selectedInspirationIds: string[];
  preferredStyles: string[];
  dislikedStyles: string[];
  techStack: string;
  pageList: string[];
  additionalNotes: string;
}

// ---- Prompt Builder Output ----
export interface PromptBuilderOutput {
  globalUiPrompt: string;
  designSystemPrompt: string;
  pageLevelPrompt: string;
  componentLevelPrompt: string;
}

// ---- AI Provider Interface ----
export interface AiProvider {
  analyzeUI(imageUrl: string, metadata: Record<string, unknown>): Promise<AiAnalysisResult>;
  generatePrompt(input: PromptBuilderInput): Promise<PromptBuilderOutput>;
}

export interface AiAnalysisResult {
  colorAnalysis: string;
  layoutAnalysis: string;
  componentAnalysis: string;
  styleSummary: string;
  designKeywords: string;
}
