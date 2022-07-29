import { Request, Response } from "express";

import Friend from "models/friends.schema";
import User from "models/user.schema";

export default {
  // @desc Send request to friend => status 0 
  // @route POST /api/SERVER_VERSION/friends/:requesterId/:recipientId
  // @access Private
  onSendFriendRequest: async (request: Request, response: Response) => {
    try {
      const { requesterId, recipientId } = request.params;
      const isAllowed = await Friend.findOne({
        requesterId, 
        recipientId,
        status: { $ne: 2 } // status != 2 => declined
      })
      if (isAllowed) {
        return response.status(400).json({
          success: false,
          message: "You can only send one request to a friend"
        })
      }
      const friendRequest = await Friend.create({
        requesterId,
        recipientId,
        status: 0, // requested
      });

      return response.status(200).json(friendRequest);

    } catch (error: any) {
      console.error(error);
      return response.status(500).json(error);
    }
  },
  // @desc Accept a friend request
  // @route PATCH /api/SERVER_VERSION/friends/:requesterId/:recipientId
  // @access Private
  onAcceptFriendRequest: async (request: Request, response: Response) => {
    try {
      const { requesterId, recipientId } = request.params;
      const acceptedFriendRequest = await Friend.findOneAndUpdate({ 
          requesterId,
          recipientId,
          status: 0
        },
        { status: 1 },
        { new: true });

      const user1 = await User.findOne({ _id: requesterId })
      if (user1) {
        const newFriend = { friendId: recipientId, status: 1 }
        user1.friends = [...user1.friends, newFriend]
        user1.save()
      }

      const user2 = await User.findOne({ _id: recipientId })  
      if (user2) {
        const newFriend = { friendId: requesterId, status: 1 }
        user2.friends = [...user2.friends, newFriend]
        user2.save()
      } else {
        return response.status(400).json({
          success: false,
          message: "User not found"
        })
      }

      return response.status(200).json(acceptedFriendRequest);

    } catch (error: any) {
      console.error(error);
      return response.status(500).json(error);
    }
  },
  // @desc Decline a friend request
  // @route PATCH /api/SERVER_VERSION/friends/:requesterId
  // @access Private
  onDeclineFriendRequest: async (request: Request, response: Response) => {
    try {
      const { requesterId } = request.params;
      const { userId } = request.body;
      const declinedFriendRequest = await Friend.findOneAndUpdate({ 
          requesterId,
          recipientId: userId,
          status: 0
        },
        { status: 2 }, //'declined',
        { new: true });
      return response.status(200).json(declinedFriendRequest);
    } catch (error: any) {
      console.error(error);
      return response.status(500).json(error);
    }
  },
  // @desc Delete a friend
  // @route DELETE /api/SERVER_VERSION/friends/:deleteUid
  // @access Private
  onRemoveFriend: async (request: Request, response: Response) => {
    try {
      const friendToRemove = request.params.deleteUid;
      const userId = request.body.userId
      const user = await User.findByIdAndUpdate(
        { _id: userId },
        { $pull: { friends: { friendId: friendToRemove } } },
        { new: true }
        );
      // remove from friends collection
      await Friend.findOneAndDelete(
        { $or: [{ requesterId: userId, recipientId: friendToRemove }, { requesterId: friendToRemove, recipientId: userId }] }
        );
      return response.status(200).json(user);
    } catch (error) {
      console.error(error);
      return response.status(500).json(error);
    }
  },
  // @desc Cancel a friend request
  // @route PATCH /api/SERVER_VERSION/friends/:recipientId
  // @access Private
  onCancelFriendRequest: async (request: Request, response: Response) => {
    try {
      const { recipientId } = request.params;
      const userId = request.body.userId
      const canceledFriendRequest = await Friend.findOneAndUpdate({ 
          requesterId: userId,
          recipientId,
          status: 0
        },
        { status: 3 }, //'canceled',
        { new: true });
      return response.status(200).json(canceledFriendRequest);
    } catch (error) {
      console.error(error);
      return response.status(500).json(error);
    }
  },
  // @desc Get all friends based on userId
  // @route GET /api/SERVER_VERSION/friends/:userId
  // @access Private
  onGetAllFriends: async (request: Request, response: Response) => {
     try {
      const friends = await User
        .findOne({ _id: request.params.userId })
        .populate('friends')
        .select('friends');
      return response.status(200).json(friends);
     } catch (error) {
      console.error(error);
      return response.status(500).json(error);
     }
  },
  // @desc Get all incoming requests based on userId
  // @route GET /api/SERVER_VERSION/friends/incoming/:userId
  // @access Private
  onGetAllRequestsIncoming: async (request: Request, response: Response) => {
    try {
      const { userId } = request.params;
      const requests = await Friend.find({ recipientId: userId, status: 0 })
      return response.status(200).json(requests);
    } catch (error) {
      console.error(error);
      return response.status(500).json(error);
    }
  },
  // @desc Get all outgoing requests based on userId
  // @route GET /api/SERVER_VERSION/friends/outgoing/:userId
  // @access Private
  onGetAllRequestsOutgoing: async (request: Request, response: Response) => {
    try {
      const { userId } = request.params;
      const requests = await Friend.find({ requesterId: userId, status: 0 })
      return response.status(200).json(requests);
    } catch (error) {
      console.error(error);
      return response.status(500).json(error);
    }
  }
  // add cancel friend request
  // get all requests incoming
  // get all requests sent
};
