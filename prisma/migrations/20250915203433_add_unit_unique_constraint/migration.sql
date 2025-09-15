/*
  Warnings:

  - A unique constraint covering the columns `[name,floor,propertyId]` on the table `Unit` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Unit_name_floor_propertyId_key" ON "public"."Unit"("name", "floor", "propertyId");
