-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_prompt_records" (
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
    "updated_at" DATETIME NOT NULL,
    "feedback_rating" INTEGER,
    "feedback_label" TEXT,
    "feedback_note" TEXT,
    "feedback_tags" TEXT,
    "is_favorite" BOOLEAN NOT NULL DEFAULT false,
    "feedback_updated_at" DATETIME
);
INSERT INTO "new_prompt_records" ("component_level_prompt", "created_at", "design_system_prompt", "generated_prompt", "id", "page_level_prompt", "project_type", "selected_inspiration_ids", "target_project", "title", "updated_at") SELECT "component_level_prompt", "created_at", "design_system_prompt", "generated_prompt", "id", "page_level_prompt", "project_type", "selected_inspiration_ids", "target_project", "title", "updated_at" FROM "prompt_records";
DROP TABLE "prompt_records";
ALTER TABLE "new_prompt_records" RENAME TO "prompt_records";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
