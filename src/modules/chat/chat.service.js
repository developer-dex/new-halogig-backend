import { Op } from 'sequelize';
import {
  ChatRoom, ChatRoomMember, ChatMessage, ChatMessageRead, ChatMeeting,
  User, Admin, sequelize,
} from '../../models';
import { calculatePagination } from '../../utils/pagination';
import emailTemplateService from '../../services/emailTemplate.service';
import logger from '../../config/logger';

const { maskPrivacyData } = require('../../utils/privacyMask');

// ---- Helpers ----

const resolveSender = (msgData) => {
  const d = { ...msgData };
  if (d.by_admin) {
    d.sender = d.adminSender || { id: d.sender_id, first_name: null, last_name: null, email: 'Unknown Admin' };
  } else {
    d.sender = d.sender || { id: d.sender_id, first_name: null, last_name: null, email: 'Unknown User' };
  }
  delete d.adminSender;
  return d;
};

const checkRoomAccess = async ({ roomId, userId, role }) => {
  if (role === 'admin') {
    const created = await ChatRoom.findOne({ where: { id: roomId, created_by: userId, created_by_type: 'admin' } });
    if (created) return true;
  }
  const membership = await ChatRoomMember.findOne({ where: { room_id: roomId, user_id: userId, status: 'active' } });
  return !!membership;
};

// ---- Service Functions ----

/**
 * Create a group chat room (admin only).
 */
const createChatRoom = async (adminId, roomData) => {
  const tx = await sequelize.transaction();
  try {
    const { name, description, userEmails, roomType = 'group' } = roomData;
    if (roomType === 'individual') throw new Error('Individual chats should be created through direct messaging');

    const room = await ChatRoom.create({
      name, description, chat_type: roomType, created_by: adminId,
      created_by_type: 'admin', status: 'active', max_members: 50,
    }, { transaction: tx });

    let addedMembers = 0;
    const invalidEmails = [];
    const validUsers = [];

    if (userEmails?.length > 0) {
      const users = await User.findAll({ where: { email: { [Op.in]: userEmails } } });
      const userMap = new Map(users.map((u) => [u.email, u]));

      const results = await Promise.all(userEmails.map(async (email) => {
        const user = userMap.get(email);
        if (!user) return { email, success: false };
        const exists = await ChatRoomMember.findOne({ where: { room_id: room.id, user_id: user.id }, transaction: tx });
        if (exists) return { email, success: false };
        await ChatRoomMember.create({ room_id: room.id, user_id: user.id, role: 'member', status: 'active', added_by: adminId }, { transaction: tx });
        return { email, user, success: true };
      }));

      results.forEach((r) => { if (r.success) { addedMembers++; validUsers.push(r.user); } else { invalidEmails.push(r.email); } });
    }

    await tx.commit();

    // Send invitation emails in background
    if (validUsers.length > 0) {
      setImmediate(async () => {
        await Promise.all(validUsers.map((u) => emailTemplateService.sendChatRoomInvitation({
          email: u.email, userName: `${u.first_name} ${u.last_name}`, roomName: room.name, roomId: room.id,
        }).catch((err) => logger.error(`Chat invite email error: ${err}`))));
      });
    }

    const result = { room, memberCount: addedMembers, totalRequested: userEmails?.length || 0, emailStatus: validUsers.length > 0 ? 'sending_in_background' : 'no_emails_to_send' };
    if (invalidEmails.length > 0) { result.invalidEmails = invalidEmails; result.warning = `${invalidEmails.length} email(s) could not be added`; }
    return result;
  } catch (error) {
    await tx.rollback();
    throw new Error(error.message);
  }
};

/**
 * Create individual chat room between two users.
 */
const createIndividualChatRoom = async (userId1, otherUserId) => {
  // Check if room already exists
  const existingMembers = await ChatRoomMember.findAll({
    where: { user_id: { [Op.in]: [userId1, otherUserId] }, status: 'active' },
    include: [{ model: ChatRoom, as: 'room', where: { chat_type: 'individual' } }],
  });

  const roomCounts = {};
  existingMembers.forEach((m) => {
    if (!roomCounts[m.room_id]) roomCounts[m.room_id] = { count: 0, room: m.room, userIds: [] };
    roomCounts[m.room_id].count++;
    roomCounts[m.room_id].userIds.push(m.user_id);
  });

  const existing = Object.values(roomCounts).find((r) => r.count === 2 && r.userIds.includes(userId1) && r.userIds.includes(otherUserId));
  if (existing) {
    return ChatRoom.findByPk(existing.room.id, {
      include: [{ model: ChatRoomMember, as: 'members', where: { status: 'active' }, required: false, include: [{ model: User, as: 'user', attributes: ['id', 'first_name', 'last_name', 'email'] }] }],
    });
  }

  const room = await ChatRoom.create({ chat_type: 'individual', created_by: userId1, created_by_type: 'user', status: 'active', max_members: 2, is_private: true });
  await ChatRoomMember.bulkCreate([
    { room_id: room.id, user_id: userId1, role: 'member', status: 'active' },
    { room_id: room.id, user_id: otherUserId, role: 'member', status: 'active' },
  ]);

  return ChatRoom.findByPk(room.id, {
    include: [{ model: ChatRoomMember, as: 'members', where: { status: 'active' }, required: false, include: [{ model: User, as: 'user', attributes: ['id', 'first_name', 'last_name', 'email'] }] }],
  });
};

/**
 * Get admin chat rooms with last message.
 */
const getAdminChatRooms = async (adminId, { page = 1, limit = 50 } = {}) => {
  const { offset, parsedLimit } = calculatePagination(page, limit);
  const totalCount = await ChatRoom.count();

  const chatRooms = await ChatRoom.findAll({
    include: [
      { model: Admin, as: 'adminCreator', attributes: ['id', 'first_name', 'last_name', 'email'], required: false },
      { model: ChatRoomMember, as: 'members', where: { status: 'active' }, required: false, attributes: ['id', 'user_id', 'role'], include: [{ model: User, as: 'user', attributes: ['id', 'first_name', 'last_name', 'email'] }] },
    ],
    order: [['created_at', 'DESC']], limit: parsedLimit, offset,
  });

  const roomIds = chatRooms.map((r) => r.id);
  const allMessages = roomIds.length > 0 ? await ChatMessage.findAll({
    where: { room_id: { [Op.in]: roomIds }, is_deleted: false },
    include: [
      { model: User, as: 'sender', attributes: ['id', 'first_name', 'last_name', 'email'], required: false },
      { model: Admin, as: 'adminSender', attributes: ['id', 'first_name', 'last_name', 'email'], required: false },
    ],
    order: [['room_id', 'ASC'], ['created_at', 'DESC']],
  }) : [];

  const lastMsgMap = {};
  allMessages.forEach((m) => { if (!lastMsgMap[m.room_id]) lastMsgMap[m.room_id] = m.toJSON(); });

  const processed = chatRooms.map((r) => {
    const d = r.toJSON();
    d.memberCount = d.members?.length || 0;
    const lm = lastMsgMap[d.id];
    d.lastMessage = lm ? { id: lm.id, message: lm.message, message_type: lm.message_type, created_at: lm.created_at, sender: lm.by_admin ? lm.adminSender : lm.sender, by_admin: lm.by_admin } : null;
    return d;
  });

  return { chatRooms: processed, total_count: totalCount };
};

/**
 * Get user chat rooms.
 */
const getUserChatRooms = async (userId, { page = 1, limit = 50 } = {}) => {
  const { offset, parsedLimit } = calculatePagination(page, limit);
  const memberships = await ChatRoomMember.findAll({ where: { user_id: userId, status: 'active' }, attributes: ['room_id'] });
  const roomIds = memberships.map((m) => m.room_id);
  if (!roomIds.length) return { chatRooms: [], total_count: 0 };

  const chatRooms = await ChatRoom.findAll({
    where: { id: { [Op.in]: roomIds } },
    include: [
      { model: ChatRoomMember, as: 'members', where: { status: 'active' }, required: false, include: [{ model: User, as: 'user', attributes: ['id', 'first_name', 'last_name', 'email'] }] },
      { model: ChatMessage, as: 'messages', required: false, separate: true, limit: 1, order: [['created_at', 'DESC']], where: { is_deleted: false }, include: [{ model: User, as: 'sender', attributes: ['id', 'first_name', 'last_name'], required: false }, { model: Admin, as: 'adminSender', attributes: ['id', 'first_name', 'last_name'], required: false }] },
    ],
    order: [['updated_at', 'DESC']], limit: parsedLimit, offset,
  });

  const processed = chatRooms.map((r) => {
    const d = r.toJSON();
    let lastMessage = null;
    if (d.messages?.length > 0) { [lastMessage] = d.messages; lastMessage = resolveSender(lastMessage); }
    d.displayName = d.chat_type === 'individual' ? (d.members?.find((m) => m.user_id !== userId)?.user ? `${d.members.find((m) => m.user_id !== userId).user.first_name} ${d.members.find((m) => m.user_id !== userId).user.last_name}` : 'Individual Chat') : (d.name || 'Group Chat');
    d.memberCount = d.members?.length || 0;
    d.lastMessage = lastMessage;
    delete d.messages;
    return d;
  });

  return { chatRooms: processed, total_count: roomIds.length };
};

/**
 * Get room messages.
 */
const getRoomMessages = async (roomId, userId, role, { page = 1, limit = 50 } = {}) => {
  const { offset, parsedLimit } = calculatePagination(page, limit);

  const messages = await ChatMessage.findAll({
    attributes: ['id', 'room_id', 'sender_id', 'by_admin', 'message', 'original_message', 'message_type', 'is_edited', 'edited_at', 'privacy_masked', 'read_count', 'created_at'],
    where: { room_id: roomId, is_deleted: false },
    include: [
      { model: User, as: 'sender', attributes: ['id', 'first_name', 'last_name', 'email'], required: false },
      { model: Admin, as: 'adminSender', attributes: ['id', 'first_name', 'last_name', 'email'], required: false },
      { model: ChatMessage, as: 'replyToMessage', attributes: ['id', 'message', 'sender_id', 'by_admin'], required: false, include: [{ model: User, as: 'sender', attributes: ['id', 'first_name', 'last_name', 'email'], required: false }, { model: Admin, as: 'adminSender', attributes: ['id', 'first_name', 'last_name', 'email'], required: false }] },
    ],
    order: [['created_at', 'ASC']], limit: parsedLimit, offset,
  });

  const processed = messages.map((m) => {
    const d = resolveSender(m.toJSON());
    if (d.replyToMessage) d.replyToMessage = resolveSender(d.replyToMessage);
    return d;
  });

  return { messages: processed, room_id: roomId };
};

/**
 * Send a message with privacy masking.
 */
const sendMessage = async (userId, roomId, messageData, role) => {
  const hasAccess = await checkRoomAccess({ roomId, userId, role });
  if (!hasAccess) throw new Error('Access denied to this chat room');

  const { message, messageType = 'text', fileUrl, fileName, fileSize, replyTo } = messageData;
  const { maskedText, originalText, isPrivacyMasked } = maskPrivacyData(message);

  const newMessage = await ChatMessage.create({
    room_id: parseInt(roomId, 10), sender_id: parseInt(userId, 10), by_admin: role === 'admin',
    message: maskedText, original_message: isPrivacyMasked ? originalText : null,
    message_type: messageType, file_url: fileUrl, file_name: fileName, file_size: fileSize,
    reply_to: replyTo ? parseInt(replyTo, 10) : null, privacy_masked: isPrivacyMasked,
  });

  await ChatRoom.update({ updated_at: new Date() }, { where: { id: roomId } });

  const complete = await ChatMessage.findByPk(newMessage.id, {
    include: [
      { model: User, as: 'sender', attributes: ['id', 'first_name', 'last_name', 'email'], required: false },
      { model: Admin, as: 'adminSender', attributes: ['id', 'first_name', 'last_name', 'email'], required: false },
    ],
  });

  return resolveSender(complete.toJSON());
};

/**
 * Delete a message (soft delete).
 */
const deleteMessage = async (userId, messageId, isAdmin = false) => {
  const message = await ChatMessage.findByPk(messageId);
  if (!message) throw new Error('Message not found');
  if (!isAdmin && message.sender_id !== userId) throw new Error('Permission denied');
  await ChatMessage.update({ is_deleted: true, deleted_at: new Date(), deleted_by: userId }, { where: { id: messageId } });
  return true;
};

/**
 * Get room details.
 */
const getRoomDetails = async (roomId, userId) => {
  const room = await ChatRoom.findByPk(roomId, {
    include: [
      { model: Admin, as: 'adminCreator', attributes: ['id', 'first_name', 'last_name', 'email'], required: false },
      { model: User, as: 'userCreator', attributes: ['id', 'first_name', 'last_name', 'email'], required: false },
      { model: ChatRoomMember, as: 'members', where: { status: 'active' }, include: [{ model: User, as: 'user', attributes: ['id', 'first_name', 'last_name', 'email'] }] },
    ],
  });
  if (!room) throw new Error('Chat room not found');
  return room;
};

/**
 * Mark messages as read.
 */
const markMessagesAsRead = async (userId, roomId) => {
  const unread = await ChatMessage.findAll({ where: { room_id: roomId, sender_id: { [Op.ne]: userId } } });
  const alreadyRead = await ChatMessageRead.findAll({ where: { user_id: userId, room_id: roomId }, attributes: ['message_id'] }).then((r) => r.map((x) => x.message_id));
  const toMark = unread.filter((m) => !alreadyRead.includes(m.id));
  if (toMark.length > 0) await Promise.all(toMark.map((m) => ChatMessageRead.create({ message_id: m.id, user_id: userId, room_id: roomId })));
  return toMark.length;
};

/**
 * Update chat room status by admin.
 */
const updateChatRoomStatusByAdmin = async ({ chatRoomId, status }) => {
  const valid = ['active', 'inactive', 'archived', 'suspended'];
  if (!valid.includes(status)) throw new Error('Invalid status value');
  return ChatRoom.update({ status }, { where: { id: chatRoomId } });
};

/**
 * Create Google Meet meeting for a chat room.
 */
const createGoogleMeetMeeting = async (actorId, roomId, payload, role) => {
  // Dynamic import to avoid crash if google calendar service not yet built
  let googleCalendarService;
  try { googleCalendarService = (await import('../../services/googleCalendar.service')).default; } catch (e) { throw new Error('Google Calendar service not available'); }

  const tx = await sequelize.transaction();
  try {
    const hasAccess = await checkRoomAccess({ roomId, userId: actorId, role });
    if (!hasAccess) throw new Error('Access denied');

    const members = await ChatRoomMember.findAll({
      where: { room_id: roomId, status: 'active' },
      include: [{ model: User, as: 'user', attributes: ['id', 'email', 'first_name', 'last_name'] }],
    });
    const attendees = members.map((m) => m.user).filter((u) => u?.email).map((u) => ({ email: u.email }));
    if (!attendees.length) throw new Error('No participants with valid email');

    const { title, description, startTime, endTime, timezone } = payload;
    const { eventId, meetUrl, organizerEmail } = await googleCalendarService.createMeetEvent({ title, description, startTime, endTime, timezone, attendees });

    const meeting = await ChatMeeting.create({
      room_id: parseInt(roomId, 10), created_by_id: parseInt(actorId, 10), created_by_type: role,
      meeting_type: 'google_meet', meeting_link: meetUrl, title, description,
      start_time: startTime, end_time: endTime, timezone, external_event_id: eventId,
      organizer_email: organizerEmail, status: 'scheduled',
    }, { transaction: tx });

    const newMessage = await ChatMessage.create({
      room_id: parseInt(roomId, 10), sender_id: parseInt(actorId, 10), by_admin: role === 'admin',
      message: meetUrl, message_type: 'google_meet', privacy_masked: false, meeting_type: 'google_meet',
    }, { transaction: tx });

    await meeting.update({ chat_message_id: newMessage.id }, { transaction: tx });
    await ChatRoom.update({ updated_at: new Date() }, { where: { id: roomId } });
    await tx.commit();

    const complete = await ChatMessage.findByPk(newMessage.id, {
      include: [
        { model: User, as: 'sender', attributes: ['id', 'first_name', 'last_name', 'email'], required: false },
        { model: Admin, as: 'adminSender', attributes: ['id', 'first_name', 'last_name', 'email'], required: false },
      ],
    });

    return { meeting, message: resolveSender(complete.toJSON()) };
  } catch (error) {
    await tx.rollback();
    throw new Error(error.message);
  }
};

export default {
  createChatRoom, createIndividualChatRoom, getAdminChatRooms, getUserChatRooms,
  getRoomMessages, sendMessage, deleteMessage, getRoomDetails, markMessagesAsRead,
  updateChatRoomStatusByAdmin, createGoogleMeetMeeting,
};
