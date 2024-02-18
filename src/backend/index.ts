import {
  query,
  update,
  text,
  Record,
  Principal,
  nat,
  Vec,
  bool,
  StableBTreeMap,
  Canister,
  Result,
  Variant,
  Err,
  Ok,
} from "azle";
import { v4 as uuidv4 } from "uuid";
import { hexGenerate } from "./utils";
// import { Principal as principal } from "@dfinity/principal#fbebce";
const EventId = text;
const UserIdentity = Principal;

const SeatInfo = Record({
  userIdentity: UserIdentity,
  seatNo: nat,
  uniqueCode: text,
});

const EventInfo = Record({
  name: text,
  description: text,
  startTime: text,
  endTime: text,
});
const QrData = Record({
  generatedQr: Vec(text),
  totalQrGenerated: text,
});
const EventData = Record({
  claimedSeats: Vec(SeatInfo),
  qrData: QrData,
});
const EventMetaData = Record({
  eventInfo: EventInfo,
  eventData: EventData,
  changeStatus: bool,
});
const ErrorMessage = Variant({
  NotFound: text,
  AlreadyExists: text,
  InvalidPayload: text,
});
const EventIdArray = Vec(EventId);

type EventId = typeof EventId.tsType;
type EventData = typeof EventData.tsType;
type EventMetaData = typeof EventMetaData.tsType;
type UserIdentity = typeof UserIdentity.tsType;

let eventDataMap = StableBTreeMap<EventId, EventMetaData>(0);
let userIdXEventIdMap = StableBTreeMap<UserIdentity, [text]>(0);

export default Canister({
  createEvent: update(
    [UserIdentity, EventInfo],
    Result(EventInfo, ErrorMessage),
    (userIdentity, event) => {
      if (typeof event !== "object" || Object.keys(event).length === 0) {
        return Err({ InvalidPayload: "invalid payload" });
      }

      const eventId = uuidv4();

      const eventIdsOpt = userIdXEventIdMap.get(userIdentity);

      if (
        eventIdsOpt.Some?.length !== undefined &&
        eventIdsOpt.Some?.length > 0
      ) {
        eventIdsOpt.Some?.push(eventId);
        userIdXEventIdMap.insert(userIdentity, eventIdsOpt.Some);
      } else {
        userIdXEventIdMap.insert(userIdentity, [eventId]);
      }

      const qrData = {
        generatedQr: [],
        totalQrGenerated: "0",
      };
      const eventData = {
        claimedSeats: [],
        qrData,
      };

      const eventMetaData: EventMetaData = {
        eventInfo: event,
        eventData,
        changeStatus: false,
      };
      eventDataMap.insert(eventId, eventMetaData);

      return Ok(event);
    }
  ),
  getEventIds: query(
    [UserIdentity],
    Result(EventIdArray, ErrorMessage),
    (UserIdentity) => {
      let eventIds = userIdXEventIdMap.get(UserIdentity);
      if (eventIds.Some !== undefined && eventIds.Some?.length > 0) {
        return Ok(eventIds.Some);
      } else {
        return Err({ NotFound: "No event found for the user" });
      }
    }
  ),
  generateQrCode: update([EventId], Result(text, ErrorMessage), (eventId) => {
    const eventMetaData = eventDataMap.get(eventId);
    if (eventMetaData.Some === undefined) {
      return Err({ NotFound: "Event not found" });
    }
    const hexCode = hexGenerate();
    const qrData = eventMetaData.Some.eventData.qrData;
    qrData.generatedQr.push(hexCode);
    qrData.totalQrGenerated = qrData.generatedQr.length.toString();
    console.log(eventMetaData);
    eventDataMap.insert(eventId, eventMetaData.Some);
    return Ok(hexCode);
  }),

  getEventData: query(
    [EventId],
    Result(EventMetaData, ErrorMessage),
    (eventId) => {
      const eventMetaData = eventDataMap.get(eventId);
      if (eventMetaData.Some === undefined) {
        return Err({ NotFound: "Event not found" });
      }
      return Ok(eventMetaData.Some);
    }
  ),
});
