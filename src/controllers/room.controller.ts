import { Request, Response } from "express";

import Message from "models/message.schema";
import Room from "models/room.schema";
import User from "models/user.schema";
import { UserRequest } from "middlewares/validate_jwt.middleware";

export default {
  initiate: async (request: UserRequest, response: Response) => {
    try {
      const { userIds, type } = request.body;
      const chatInitiator = request.userDetails?.id as string;
      const allUserIds = [...userIds, chatInitiator];
      const chatRoom = await Room.initiateChat(allUserIds, type, chatInitiator);
      return response.status(200).json({ success: true, chatRoom });
    } catch (error) {
      console.error(error);
      return response.status(500).json({ success: false, error: error });
    }
  },
  getRecentConversation: async (request: UserRequest, response: Response) => {
    try {
      const currentLoggedUser = request.userDetails?.id as string;
      const options = {
        page: parseInt(request.query.page) || 0,
        limit: parseInt(request.query.limit) || 10,
      };
      const rooms = await Room.getChatRoomsByUserId(currentLoggedUser);
      const roomIds = rooms.map((room) => room._id);
      const recentConversation = await Message.getRecentConversation(
        roomIds,
        options,
        currentLoggedUser
      );
      return response
        .status(200)
        .json({ success: true, conversation: recentConversation });
    } catch (error) {
      console.error(error);
      return response.status(500).json({ success: false, error: error });
    }
  },
  getConversationByRoomId: async (request: Request, response: Response) => {
    try {
      const { roomId } = request.params;
      const room = await Room.getChatRoomByRoomId(roomId);
      if (!room) {
        return response.status(400).json({
          success: false,
          message: "No room exists for this id",
        });
      }
      const users = await User.find({ _id: { $in: room.userIds } });
      const options = {
        page: parseInt(request.query.page) || 0,
        limit: parseInt(request.query.limit) || 10,
      };
      const conversation = await Message.getConversationByRoomId(
        roomId,
        options
      );
      return response.status(200).json({
        success: true,
        conversation,
        users,
      });
    } catch (error) {
      console.error(error);
      return response.status(500).json({ success: false, error });
    }
  },
  postMessage: async (request: UserRequest, response: Response) => {
    try {
      const { roomId } = request.params;
      const messagePayload = {
        messageText: request.body.messageText,
      };
      const currentLoggedUser = request.userDetails?.id as string;
      const message = await Message.createMessageInChatRoom(
        roomId,
        messagePayload,
        currentLoggedUser
      );
      return response.status(200).json({ success: true, message });
    } catch (error) {
      console.error(error);
      return response.status(500).json({ success: false, error: error });
    }
  },
  markConversationReadByRoomId: async (
    request: UserRequest,
    response: Response
  ) => {
    try {
      const { roomId } = request.params;
      const room = await Room.getChatRoomByRoomId(roomId);
      if (!room) {
        return response.status(400).json({
          success: false,
          message: "No room exists for this id",
        });
      }

      const currentLoggedUser = request.userDetails?.id as string;
      const result = await Message.markMessageRead(roomId, currentLoggedUser);
      return response.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error(error);
      return response.status(500).json({ success: false, error });
    }
  },
};
