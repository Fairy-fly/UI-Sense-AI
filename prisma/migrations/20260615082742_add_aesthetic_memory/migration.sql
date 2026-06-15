-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_user_preferences" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "preferred_styles" TEXT,
    "disliked_styles" TEXT,
    "preferred_colors" TEXT,
    "preferred_layouts" TEXT,
    "default_tech_stack" TEXT,
    "default_ui_style" TEXT,
    "updated_at" DATETIME NOT NULL,
    "aesthetic_summary" TEXT,
    "aesthetic_agent_instruction" TEXT,
    "aesthetic_generated_at" DATETIME,
    "aesthetic_source_count" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_user_preferences" ("default_tech_stack", "default_ui_style", "disliked_styles", "id", "preferred_colors", "preferred_layouts", "preferred_styles", "updated_at") SELECT "default_tech_stack", "default_ui_style", "disliked_styles", "id", "preferred_colors", "preferred_layouts", "preferred_styles", "updated_at" FROM "user_preferences";
DROP TABLE "user_preferences";
ALTER TABLE "new_user_preferences" RENAME TO "user_preferences";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
