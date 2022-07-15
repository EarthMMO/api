import express from "express";

import room from "controllers/room.controller";
import { validateJWT } from "middlewares/validate_jwt.middleware";

const router = express.Router();

router
  .post("/initiate", validateJWT, room.initiate)
  .get("/", validateJWT, room.getRecentConversation)
  .get("/:roomId", validateJWT, room.getConversationByRoomId)
  .post("/:roomId/message", validateJWT, room.postMessage)
  .put("/:roomId/mark-read", validateJWT, room.markConversationReadByRoomId);

export default router;
