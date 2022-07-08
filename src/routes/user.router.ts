import express from "express";

import upload from "utils/multer";
import user from "controllers/user.controller";
import { validateJWT } from "middlewares/validate_jwt.middleware";

const router = express.Router();

router
  .post("/", user.onCreateOrLoginUser)
  .get("/", validateJWT, user.onGetAllUsers)
  .get("/:userId", validateJWT, user.onGetUserById)
  .patch("/:userId", validateJWT, user.onUpdateUser)
  .patch(
    "/:userId/upload",
    validateJWT,
    upload.single("image"),
    user.onUploadUserImage
  );

export default router;
