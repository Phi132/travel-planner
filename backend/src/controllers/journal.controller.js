import { journalService } from '../services/journal.service.js';
import { catchAsync } from '../utils/catchAsync.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const create = catchAsync(async (req, res) => {
  const journal = await journalService.createJournal(req.user.id, req.body);
  sendSuccess(res, { statusCode: 201, message: 'Tạo nhật ký thành công.', data: { journal } });
});

export const list = catchAsync(async (req, res) => {
  const { journals, meta } = await journalService.listJournals(req.user.id, req.query);
  sendSuccess(res, { message: 'Lấy danh sách nhật ký thành công.', data: { journals }, meta });
});

export const getOne = catchAsync(async (req, res) => {
  const journal = await journalService.getJournalById(req.user.id, req.params.id);
  sendSuccess(res, { message: 'Lấy nhật ký thành công.', data: { journal } });
});

export const update = catchAsync(async (req, res) => {
  const journal = await journalService.updateJournal(req.user.id, req.params.id, req.body);
  sendSuccess(res, { message: 'Cập nhật nhật ký thành công.', data: { journal } });
});

export const remove = catchAsync(async (req, res) => {
  await journalService.deleteJournal(req.user.id, req.params.id);
  sendSuccess(res, { message: 'Xoá nhật ký thành công.' });
});
