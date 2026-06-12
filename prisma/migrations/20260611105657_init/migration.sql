-- CreateTable
CREATE TABLE "inspirations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "source_url" TEXT,
    "image_url" TEXT NOT NULL DEFAULT '',
    "preview_variant" TEXT NOT NULL DEFAULT 'linear',
    "project_type" TEXT,
    "rating" INTEGER NOT NULL DEFAULT 3,
    "notes" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "color" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "inspiration_tags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "inspiration_id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "inspiration_tags_inspiration_id_fkey" FOREIGN KEY ("inspiration_id") REFERENCES "inspirations" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "inspiration_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ai_analysis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "inspiration_id" TEXT NOT NULL,
    "color_analysis" TEXT,
    "layout_analysis" TEXT,
    "component_analysis" TEXT,
    "style_summary" TEXT,
    "design_keywords" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "ai_analysis_inspiration_id_fkey" FOREIGN KEY ("inspiration_id") REFERENCES "inspirations" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "prompt_records" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "target_project" TEXT NOT NULL,
    "project_type" TEXT,
    "selected_inspiration_ids" TEXT NOT NULL,
    "generated_prompt" TEXT NOT NULL,
    "design_system_prompt" TEXT,
    "page_level_prompt" TEXT,
    "component_level_prompt" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "user_preferences" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "preferred_styles" TEXT,
    "disliked_styles" TEXT,
    "preferred_colors" TEXT,
    "preferred_layouts" TEXT,
    "default_tech_stack" TEXT,
    "default_ui_style" TEXT,
    "updated_at" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "inspiration_tags_inspiration_id_tag_id_key" ON "inspiration_tags"("inspiration_id", "tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "ai_analysis_inspiration_id_key" ON "ai_analysis"("inspiration_id");
