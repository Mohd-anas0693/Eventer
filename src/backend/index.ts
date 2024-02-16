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

let EventMap = StableBTreeMap< typeof EventId,typeof EventMetaData>(0);
