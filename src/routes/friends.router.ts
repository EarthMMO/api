import express from "express";

import friends from 'controllers/friends.controller';
import { validateJWT } from "middlewares/validate_jwt.middleware";

const router = express.Router();

router
    .post("/send/:requesterId/:recipientId", validateJWT, friends.onSendFriendRequest)
    .patch("/accept/:requesterId/:recipientId", validateJWT, friends.onAcceptFriendRequest)
    .patch("/decline/:requesterId", validateJWT, friends.onDeclineFriendRequest)
    .patch("/cancel/:recipientId", validateJWT, friends.onCancelFriendRequest)
    .delete("/remove:deleteUid", validateJWT, friends.onRemoveFriend)
    .get("/:userId", validateJWT, friends.onGetAllFriends)
  

export default router;
