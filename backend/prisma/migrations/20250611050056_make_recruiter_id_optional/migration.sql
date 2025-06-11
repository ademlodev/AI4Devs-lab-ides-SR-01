-- DropForeignKey
ALTER TABLE "Applicant" DROP CONSTRAINT "Applicant_recruiterId_fkey";

-- AlterTable
ALTER TABLE "Applicant" ALTER COLUMN "recruiterId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Applicant" ADD CONSTRAINT "Applicant_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
