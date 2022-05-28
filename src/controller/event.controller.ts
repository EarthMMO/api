import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import Event, { IEvent } from '../services/mongodb/events.schema';
import storeInIPFS from '../utils/store_in_ipfs';
import { logger } from '../utils/logger';
import CustomError from '../exceptions/custom_error';

export const createEvent = async (request: IEvent) => {
  try {
    const eventId = uuidv4();
    const {
      name,
      description,
      website,
      numberOfMember,
      fileName,
      adminUserId,
    } = request;
    // upload file into IPFS

    //read profile pic
    const eventNFTImage = fs.readFileSync(
      path.join(`${__dirname}/../../../static`, fileName as string)
    );

    // extract binary data from the file read
    const fileBuffer = Buffer.from(eventNFTImage);

    // all the fileData to IPFS
    const ItemNFTImageHash = await storeInIPFS(fileBuffer);
    logger.debug({
      id: eventId,
      name,
      description,
      website,
      numberOfMember,
      ItemNFTImageHash,
      adminUserId,
    });
    await Event.create({
      id: eventId,
      name,
      description,
      website,
      numberOfMember: Number(numberOfMember),
      ItemNFTImageHash,
      adminUserId,
    });
    fs.unlinkSync(
      path.join(`${__dirname}/../../../static`, fileName as string)
    );
    return { eventId, ItemNFTImageHash };
  } catch (error: any) {
    if (error instanceof CustomError) throw error;
    logger.error('Error in logging the user : ', error);
    throw new CustomError('Oops! something went wrong', 500, undefined, error);
  }
};
export const updateEvent = async (eventId: string, itemEventId: string) => {
  try {
    await Event.updateOne({ id: eventId }, { itemEventId });
  } catch (error: any) {
    if (error instanceof CustomError) throw error;
    logger.error('Error in logging the user : ', error);
    throw new CustomError('Oops! something went wrong', 500, undefined, error);
  }
};

export const getEventById = async (eventId: string) => {
  try {
    const event = await Event.findOne({ id: eventId });
    return event;
  } catch (error: any) {
    if (error instanceof CustomError) throw error;
    logger.error('Error in logging the user : ', error);
    throw new CustomError('Oops! something went wrong', 500, undefined, error);
  }
};

export const getAllEvent = async () => {
  try {
    const events = await Event.find({});
    return events;
  } catch (error: any) {
    if (error instanceof CustomError) throw error;
    logger.error('Error in logging the user : ', error);
    throw new CustomError('Oops! something went wrong', 500, undefined, error);
  }
};
