import express from "express";

import event from "controllers/event.controller";
import upload from "utils/multer";
import { validateJWT } from "middlewares/validate_jwt.middleware";

const router = express.Router();

router
  .post("/", validateJWT, upload.single("image"), event.onCreateEvent)
  .get("/", validateJWT, event.onGetAllEvents)
  .get("/:eventId", validateJWT, event.onGetEventById)
  .patch("/:eventId", validateJWT, event.onUpdateEvent);

export default router;
