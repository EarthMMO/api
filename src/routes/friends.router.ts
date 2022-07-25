import express from "express";

import friends from 'controllers/friends.controller';

const router = express.Router();

router.post("/:requesterId/:recipientId", friends.onSendFriendRequest)
  

export default router;
