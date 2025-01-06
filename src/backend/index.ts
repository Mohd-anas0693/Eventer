import {
  query,
  update,
  text,
  Record,
  Principal,
  nat,
  Vec,
  Tuple,
  bool,
  StableBTreeMap,
  Canister,
  Result,
  Variant,
} from "azle";
const EventId = text;
const UserIdentity = Principal;
const SeatInfo = Record({
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
  claimedSeats: Vec(UserIdentity),
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

type EventId = typeof EventId.tsType;
type EventInfo = typeof EventInfo.tsType;
type QrData = typeof QrData.tsType;
type EventData = typeof EventData.tsType;
type EventMetaData = typeof EventMetaData.tsType;

let EventMap = StableBTreeMap<EventId, EventMetaData>(0);

export default Canister({
  createEvent: update([EventInfo],Result(EventInfo,ErrorMessage),(event) =>{
  }),
});
