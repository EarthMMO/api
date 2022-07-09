import fs from "fs";
import path from "path";
import { Request, Response } from "express";
import { UserRequest } from "middlewares/validate_jwt.middleware";
import { v4 as uuidv4 } from "uuid";

import Event, { IEvent } from "models/event.schema";
import storeInIPFS from "utils/store_in_ipfs";

export interface EventResponse {
  id: string;
  name: string;
  numberOfMember: number;
  ItemNFTImageHash: string;
  adminUserId: string;
  itemEventId: string;
}

const sanitizeEventResponse = (event: IEvent): EventResponse => {
  const _event: any = event;
  delete _event._id;
  return _event;
};

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
      const ItemNFTImageHash = await storeInIPFS(fileBuffer);

      const event = await Event.create({
        id: uuidv4(),
        name,
        description,
        itemName,
        itemDescription,
        website,
        numberOfMember: Number(numberOfMember),
        ItemNFTImageHash,
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
      const sanitizedEvents = events.map((event: any) =>
        sanitizeEventResponse(event)
      );
      return response.status(200).json(sanitizedEvents);
    } catch (error: any) {
      console.error(error);
      return response.status(500).json(error);
    }
  },
  onGetEventById: async (request: Request, response: Response) => {
    try {
      const event = await Event.findOne({ id: request.params.eventId });
      const sanitizedEvent = sanitizeEventResponse(event!);
      return response.status(200).json(sanitizedEvent);
    } catch (error: any) {
      console.error(error);
      return response.status(500).json(error);
    }
  },
  onUpdateEvent: async (request: Request, response: Response) => {
    try {
      const event = await Event.updateOne(
        { id: request.params.eventId },
        { itemEventId: request.body.itemEventId }
      );
      response.status(200).json(event);
    } catch (error: any) {
      console.error(error);
      return response.status(500).json(error);
    }
  },
};
