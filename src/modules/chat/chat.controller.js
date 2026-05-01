import asyncHandler from '../../utils/asyncHandler';
import getHttpStatus from '../../utils/httpStatus';
import getMessage from '../../utils/message';
import chatService from './chat.service';

const ok = (req, res, data, msgKey) => res.status(getHttpStatus('OK')).json({ success: true, data, message: getMessage(req, true, msgKey) });
const created = (req, res, data, msgKey) => res.status(getHttpStatus('CREATED')).json({ success: true, data, message: getMessage(req, true, msgKey) });
const bad = (req, res, error, msgKey) => res.status(getHttpStatus('BAD_REQUEST')).json({ success: false, data: null, error: error?.message || error, message: getMessage(req, false, msgKey) });

// Admin routes
const createChatRoom = asyncHandler(async (req, res) => {
  try {
    const result = await chatService.createChatRoom(req.admin.id, req.body);
    return ok(req, res, result, 'CHAT_ROOM_CREATED');
  } catch (error) { return bad(req, res, error, 'CHAT_ROOM_CREATION_FAILED'); }
});

const getAdminChatRooms = asyncHandler(async (req, res) => {
  try {
    const result = await chatService.getAdminChatRooms(req.admin.id, req.query);
    return ok(req, res, result, 'CHAT_ROOMS_RETRIEVED');
  } catch (error) { return bad(req, res, error, 'CHAT_ROOMS_RETRIEVAL_FAILED'); }
});

const getAdminChatRoomMessages = asyncHandler(async (req, res) => {
  try {
    const result = await chatService.getRoomMessages(req.params.roomId, req.admin.id, req.admin.role || 'admin', req.query);
    return ok(req, res, result, 'MESSAGES_RETRIEVED');
  } catch (error) { return bad(req, res, error, 'MESSAGES_RETRIEVAL_FAILED'); }
});

const updateChatRoomStatusByAdmin = asyncHandler(async (req, res) => {
  try {
    const result = await chatService.updateChatRoomStatusByAdmin({ chatRoomId: req.params.chatRoomId, status: req.body.status });
    return ok(req, res, result, 'Chat room status updated successfully');
  } catch (error) { return bad(req, res, error, 'Chat room status update failed'); }
});

// User routes
const getUserChatRooms = asyncHandler(async (req, res) => {
  try {
    const result = await chatService.getUserChatRooms(req.user.id, req.query);
    return ok(req, res, result, 'USER_CHAT_ROOMS_RETRIEVED');
  } catch (error) { return bad(req, res, error, 'USER_CHAT_ROOMS_RETRIEVAL_FAILED'); }
});

const getUserChatRoomMessages = asyncHandler(async (req, res) => {
  try {
    const result = await chatService.getRoomMessages(req.params.roomId, req.user.id, 'user', req.query);
    return ok(req, res, result, 'MESSAGES_RETRIEVED');
  } catch (error) {
    if (error.message === 'Access denied to this chat room') {
      return res.status(getHttpStatus('FORBIDDEN')).json({ success: false, data: null, error: error.message, message: getMessage(req, false, 'MESSAGES_RETRIEVAL_FAILED') });
    }
    return bad(req, res, error, 'MESSAGES_RETRIEVAL_FAILED');
  }
});

const createIndividualChatRoom = asyncHandler(async (req, res) => {
  try {
    const result = await chatService.createIndividualChatRoom(req.user.id, req.body.other_user_id);
    return created(req, res, result, 'INDIVIDUAL_CHAT_CREATED');
  } catch (error) { return bad(req, res, error, 'INDIVIDUAL_CHAT_CREATION_FAILED'); }
});

// Common routes
const sendMessage = asyncHandler(async (req, res) => {
  try {
    const roomId = parseInt(req.params.roomId, 10);
    if (Number.isNaN(roomId)) return bad(req, res, 'Invalid room ID', 'INVALID_ROOM_ID');

    const userId = req.admin?.id || req.user?.id;
    const role = req.admin ? 'admin' : 'user';
    if (!userId) return res.status(getHttpStatus('UNAUTHORIZED')).json({ success: false, data: null, message: 'User not authenticated' });

    const result = await chatService.sendMessage(userId, roomId, req.body, role);
    return created(req, res, result, 'MESSAGE_SENT');
  } catch (error) { return bad(req, res, error, 'MESSAGE_SEND_FAILED'); }
});

const deleteMessage = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?.id || req.admin?.id;
    const result = await chatService.deleteMessage(userId, req.params.messageId, Boolean(req.admin));
    return ok(req, res, result, 'MESSAGE_DELETED');
  } catch (error) { return bad(req, res, error, 'MESSAGE_DELETE_FAILED'); }
});

const getChatRoomDetails = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?.id || req.admin?.id;
    const result = await chatService.getRoomDetails(req.params.roomId, userId);
    return ok(req, res, result, 'CHAT_ROOM_DETAILS_RETRIEVED');
  } catch (error) { return bad(req, res, error, 'CHAT_ROOM_DETAILS_RETRIEVAL_FAILED'); }
});

const markMessagesAsRead = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?.id || req.admin?.id;
    const result = await chatService.markMessagesAsRead(userId, req.params.roomId);
    return ok(req, res, { marked: result }, 'MESSAGES_MARKED_READ');
  } catch (error) { return bad(req, res, error, 'MESSAGES_MARKED_READ_FAILED'); }
});

const createGoogleMeetMeeting = asyncHandler(async (req, res) => {
  try {
    const roomId = parseInt(req.params.roomId, 10);
    if (Number.isNaN(roomId)) return bad(req, res, 'Invalid room ID', 'INVALID_ROOM_ID');
    const userId = req.admin?.id || req.user?.id;
    const role = req.admin ? 'admin' : 'user';
    const { meeting, message } = await chatService.createGoogleMeetMeeting(userId, roomId, req.body, role);
    return created(req, res, { meeting, chatMessage: message }, 'GOOGLE_MEET_CREATED');
  } catch (error) { return bad(req, res, error, 'GOOGLE_MEET_CREATION_FAILED'); }
});

export default {
  createChatRoom, getAdminChatRooms, getAdminChatRoomMessages, updateChatRoomStatusByAdmin,
  getUserChatRooms, getUserChatRoomMessages, createIndividualChatRoom,
  sendMessage, deleteMessage, getChatRoomDetails, markMessagesAsRead, createGoogleMeetMeeting,
};
