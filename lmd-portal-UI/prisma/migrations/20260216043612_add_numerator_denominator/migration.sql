-- AlterTable
ALTER TABLE "MonthlyUpdate" ADD COLUMN     "denominatorOverride" DOUBLE PRECISION,
ADD COLUMN     "numerator" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Okr" ADD COLUMN     "denominator" DOUBLE PRECISION,
ADD COLUMN     "denominatorLabel" TEXT,
ADD COLUMN     "numeratorLabel" TEXT;
