-- AlterTable
ALTER TABLE `refresh_tokens`
  MODIFY `user_agent` TEXT NULL,
  MODIFY `ip_address` VARCHAR(45) NULL;
