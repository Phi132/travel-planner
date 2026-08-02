import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma.js';
import { AppError } from '../middlewares/errorHandler.middleware.js';
import { deleteUploadedFile } from '../helpers/image.helper.js';

const SALT_ROUNDS = 10;

function toSafeUser(user) {
  // eslint-disable-next-line no-unused-vars
  const { password, deletedAt, ...safeUser } = user;
  return safeUser;
}

async function updateProfile(userId, data) {
  const user = await prisma.user.update({ where: { id: userId }, data });
  return toSafeUser(user);
}

/**
 * Đổi mật khẩu — sau khi đổi thành công, thu hồi toàn bộ refresh token hiện
 * có của user để buộc đăng nhập lại trên mọi thiết bị (giảm rủi ro nếu mật
 * khẩu cũ đã bị lộ).
 */
async function changePassword(userId, { currentPassword, newPassword }) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError('Không tìm thấy người dùng.', 404);
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw new AppError('Mật khẩu hiện tại không đúng.', 400);
  }

  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

  await prisma.$transaction([
    prisma.user.update({ where: { id: userId }, data: { password: hashedPassword } }),
    prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() }
    })
  ]);
}

async function updateAvatar(userId, avatarUrl) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError('Không tìm thấy người dùng.', 404);
  }

  if (user.avatarUrl) {
    await deleteUploadedFile(user.avatarUrl);
  }

  const updated = await prisma.user.update({ where: { id: userId }, data: { avatarUrl } });
  return toSafeUser(updated);
}

export const userService = { updateProfile, changePassword, updateAvatar };
