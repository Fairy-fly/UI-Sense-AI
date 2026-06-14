-- CreateTable
CREATE TABLE "collections" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "cover_color" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "inspiration_collections" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "inspiration_id" TEXT NOT NULL,
    "collection_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "inspiration_collections_inspiration_id_fkey" FOREIGN KEY ("inspiration_id") REFERENCES "inspirations" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "inspiration_collections_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "collections" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "inspiration_collections_inspiration_id_collection_id_key" ON "inspiration_collections"("inspiration_id", "collection_id");
