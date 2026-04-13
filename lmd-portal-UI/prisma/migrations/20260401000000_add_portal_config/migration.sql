-- CreateTable
CREATE TABLE "PortalConfig" (
    "id" TEXT NOT NULL DEFAULT 'global',
    "config" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PortalConfig_pkey" PRIMARY KEY ("id")
);
