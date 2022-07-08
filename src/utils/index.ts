import Event, { IEvent } from "models/event.schema";
import { NFT } from "models/user.schema";

export const fetchEventNFTHashes = (NFTs: NFT[]) => {
  const promises = NFTs.map(async (nft: NFT) => {
    console.log({ id: nft.eventId });
    const event = (await Event.findOne({
      id: nft.eventId,
    })) as IEvent;
    return event.ItemNFTImageHash as any;
  });
  return Promise.all(promises);
};
