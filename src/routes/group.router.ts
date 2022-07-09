import express from "express";

import group from "controllers/group.controller";
import { validateJWT } from "middlewares/validate_jwt.middleware";

const router = express.Router();

router
  .post("/", validateJWT, group.onCreateGroup)
  .get("/", validateJWT, group.onGetAllGroups)
  .get("/:groupId", validateJWT, group.onGetGroupById)
  .patch("/:groupId", validateJWT, group.onJoinOrLeaveGroup);

export default router;
