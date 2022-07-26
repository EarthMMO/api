import express from "express";

import friends from 'controllers/friends.controller';

const router = express.Router();

router
    .post("/:requesterId/:recipientId", friends.onSendFriendRequest)
    .patch("/:requesterId/:recipientId", friends.onAcceptFriendRequest)
    .get("/:userId", friends.onGetAllFriends)
    .delete("/:deleteUid", friends.onDeleteFriend);
  

export default router;
