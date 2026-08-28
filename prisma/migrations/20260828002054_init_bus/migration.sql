-- CreateEnum
CREATE TYPE "BusStatus" AS ENUM ('AVAILABLE', 'ON_TRIP', 'MAINTENANCE');

-- CreateTable
CREATE TABLE "Bus" (
    "id" TEXT NOT NULL,
    "busNumber" TEXT NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "status" "BusStatus" NOT NULL DEFAULT 'AVAILABLE',

    CONSTRAINT "Bus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bus_busNumber_key" ON "Bus"("busNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Bus_registrationNumber_key" ON "Bus"("registrationNumber");
