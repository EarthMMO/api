import fs from "fs";
import path from "path";
import { Request, Response } from "express";
import { UserRequest } from "middlewares/validate_jwt.middleware";

import Event from "models/event.schema";
import storeInIPFS from "utils/store_in_ipfs";

export interface EventResponse {
  _id: string;
  adminUserId: string;
  itemEventId: string;
  itemNFTImageHash: string;
  name: string;
  numberOfMember: number;
}

export default {
  onCreateEvent: async (
    request: UserRequest & { file?: any },
    response: Response
  ) => {
    try {
      const fileName = request?.file?.filename;
      const adminId = request.userDetails?.id as string;
      const {
        name,
        description,
        itemName,
        itemDescription,
        website,
        numberOfMember,
      } = request.body;
      // upload file into IPFS

      //read profile pic
      const eventNFTImage = fs.readFileSync(
        path.join(`${__dirname}/../../../static`, fileName as string)
      );

      // extract binary data from the file read
      const fileBuffer = Buffer.from(eventNFTImage);

      // all the fileData to IPFS
      const itemNFTImageHash = await storeInIPFS(fileBuffer);

      const event = await Event.create({
        name,
        description,
        itemName,
        itemDescription,
        website,
        numberOfMember: Number(numberOfMember),
        itemNFTImageHash,
        adminUserId: adminId,
      });

      fs.unlinkSync(
        path.join(`${__dirname}/../../../static`, fileName as string)
      );

      return response.status(200).json(event);
    } catch (error: any) {
      console.error(error);
      return response.status(500).json(error);
    }
  },
  onGetAllEvents: async (request: Request, response: Response) => {
    try {
      const events = await Event.find();
      return response.status(200).json(events);
    } catch (error: any) {
      console.error(error);
      return response.status(500).json(error);
    }
  },
  onGetEventById: async (request: Request, response: Response) => {
    try {
      const event = await Event.findOne({ _id: request.params.eventId });
      return response.status(200).json(event);
    } catch (error: any) {
      console.error(error);
      return response.status(500).json(error);
    }
  },
  onUpdateEvent: async (request: Request, response: Response) => {
    try {
      const event = await Event.updateOne(
        { _id: request.params.eventId },
        { itemEventId: request.body.itemEventId }
      );
      response.status(200).json(event);
    } catch (error: any) {
      console.error(error);
      return response.status(500).json(error);
    }
  },
};
