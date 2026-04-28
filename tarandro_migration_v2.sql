
-- Migration v3: signature par compte email
ALTER TABLE "EmailAccount" ADD COLUMN IF NOT EXISTS "signature" TEXT;
