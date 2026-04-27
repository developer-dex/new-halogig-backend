import { Router } from 'express';
import chatController from './chat.controller';
import validate from '../../middlewares/validate.middleware';
import chatValidation from './chat.validation';
import authMiddleware from '../../middlewares/auth.middleware';
import adminAuthMiddleware from '../../middlewares/adminAuth.middleware';
import combinedAuthMiddleware from '../../middlewares/combinedAuth.middleware';

const router = Router();

// Admin routes
router.post('/admin/chat/rooms', adminAuthMiddleware, validate(chatValidation.createChatRoom), chatController.createChatRoom);
router.get('/admin/chat/rooms', adminAuthMiddleware, chatController.getAdminChatRooms);
router.get('/admin/chat/rooms/:roomId/messages', adminAuthMiddleware, validate(chatValidation.roomIdParam), chatController.getAdminChatRoomMessages);
router.patch('/admin/chat-room/:chatRoomId/status', adminAuthMiddleware, validate(chatValidation.updateChatRoomStatus), chatController.updateChatRoomStatusByAdmin);

// User routes
router.get('/user/chat/rooms', authMiddleware, chatController.getUserChatRooms);
router.get('/user/chat/rooms/:roomId/messages', authMiddleware, validate(chatValidation.roomIdParam), chatController.getUserChatRoomMessages);
router.post('/user/chat/individual', authMiddleware, validate(chatValidation.createIndividualChatRoom), chatController.createIndividualChatRoom);

// Common routes (admin or user)
router.post('/chat/rooms/:roomId/messages', combinedAuthMiddleware, validate(chatValidation.sendMessage), chatController.sendMessage);
router.delete('/chat/messages/:messageId', combinedAuthMiddleware, validate(chatValidation.messageIdParam), chatController.deleteMessage);
router.get('/chat/rooms/:roomId', combinedAuthMiddleware, validate(chatValidation.roomIdParam), chatController.getChatRoomDetails);
router.post('/chat/rooms/:roomId/read', combinedAuthMiddleware, validate(chatValidation.roomIdParam), chatController.markMessagesAsRead);
router.post('/chat/rooms/:roomId/meetings/google', combinedAuthMiddleware, validate(chatValidation.createGoogleMeet), chatController.createGoogleMeetMeeting);

export default router;
