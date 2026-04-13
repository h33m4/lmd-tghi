-- Migration: normalize_okr_objectives
-- Extracts the denormalized `objective` / `objectiveToc` strings from Okr
-- into a proper OkrObjective table, then links each Okr row via objectiveId FK.

-- 1. Create OkrObjective table
CREATE TABLE "OkrObjective" (
  "id"        TEXT         NOT NULL,
  "number"    INTEGER      NOT NULL,
  "text"      TEXT         NOT NULL,
  "toc"       TEXT         NOT NULL DEFAULT '',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "OkrObjective_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "OkrObjective_number_key" ON "OkrObjective"("number");
CREATE INDEX "OkrObjective_number_idx"        ON "OkrObjective"("number");

-- 2. Populate OkrObjective from distinct objective strings that exist in Okr.
--    The objective number is derived from the numeric prefix of okrId (e.g. "2" from "2.3").
--    Where parsing fails we fall back to row_number ordering.
INSERT INTO "OkrObjective" ("id", "number", "text", "toc", "createdAt", "updatedAt")
SELECT
  gen_random_uuid()::text                          AS "id",
  COALESCE(
    (regexp_match(MIN("okrId"), '^(\d+)\.'))[1]::int,
    ROW_NUMBER() OVER (ORDER BY MIN("okrId"))::int
  )                                                AS "number",
  "objective"                                      AS "text",
  MAX("objectiveToc")                              AS "toc",
  NOW()                                            AS "createdAt",
  NOW()                                            AS "updatedAt"
FROM "Okr"
WHERE "objective" IS NOT NULL AND "objective" <> ''
GROUP BY "objective";

-- 3. Add objectiveId column (nullable during backfill)
ALTER TABLE "Okr" ADD COLUMN "objectiveId" TEXT;

-- 4. Backfill objectiveId for every existing Okr row
UPDATE "Okr" o
SET "objectiveId" = oo."id"
FROM "OkrObjective" oo
WHERE o."objective" = oo."text";

-- 5. Make objectiveId NOT NULL (all rows should be filled now)
ALTER TABLE "Okr" ALTER COLUMN "objectiveId" SET NOT NULL;

-- 6. Add FK constraint
ALTER TABLE "Okr"
  ADD CONSTRAINT "Okr_objectiveId_fkey"
  FOREIGN KEY ("objectiveId") REFERENCES "OkrObjective"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

-- 7. Add index on objectiveId
CREATE INDEX "Okr_objectiveId_idx" ON "Okr"("objectiveId");

-- 8. Drop the now-redundant denormalized columns
ALTER TABLE "Okr" DROP COLUMN "objective";
ALTER TABLE "Okr" DROP COLUMN "objectiveToc";
DROP INDEX IF EXISTS "Okr_objectiveToc_idx";
