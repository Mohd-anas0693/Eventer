export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'createEvent' : IDL.Func(
        [
          IDL.Principal,
          IDL.Record({
            'startTime' : IDL.Text,
            'endTime' : IDL.Text,
            'name' : IDL.Text,
            'description' : IDL.Text,
          }),
        ],
        [
          IDL.Variant({
            'Ok' : IDL.Record({
              'startTime' : IDL.Text,
              'endTime' : IDL.Text,
              'name' : IDL.Text,
              'description' : IDL.Text,
            }),
            'Err' : IDL.Variant({
              'InvalidPayload' : IDL.Text,
              'NotFound' : IDL.Text,
              'AlreadyExists' : IDL.Text,
            }),
          }),
        ],
        [],
      ),
    'generateQrCode' : IDL.Func(
        [IDL.Text],
        [
          IDL.Variant({
            'Ok' : IDL.Text,
            'Err' : IDL.Variant({
              'InvalidPayload' : IDL.Text,
              'NotFound' : IDL.Text,
              'AlreadyExists' : IDL.Text,
            }),
          }),
        ],
        [],
      ),
    'getEventData' : IDL.Func(
        [IDL.Text],
        [
          IDL.Variant({
            'Ok' : IDL.Record({
              'changeStatus' : IDL.Bool,
              'eventData' : IDL.Record({
                'claimedSeats' : IDL.Vec(
                  IDL.Record({
                    'userIdentity' : IDL.Principal,
                    'seatNo' : IDL.Nat,
                    'uniqueCode' : IDL.Text,
                  })
                ),
                'qrData' : IDL.Record({
                  'generatedQr' : IDL.Vec(IDL.Text),
                  'totalQrGenerated' : IDL.Text,
                }),
              }),
              'eventInfo' : IDL.Record({
                'startTime' : IDL.Text,
                'endTime' : IDL.Text,
                'name' : IDL.Text,
                'description' : IDL.Text,
              }),
            }),
            'Err' : IDL.Variant({
              'InvalidPayload' : IDL.Text,
              'NotFound' : IDL.Text,
              'AlreadyExists' : IDL.Text,
            }),
          }),
        ],
        ['query'],
      ),
    'getEventIds' : IDL.Func(
        [IDL.Principal],
        [
          IDL.Variant({
            'Ok' : IDL.Vec(IDL.Text),
            'Err' : IDL.Variant({
              'InvalidPayload' : IDL.Text,
              'NotFound' : IDL.Text,
              'AlreadyExists' : IDL.Text,
            }),
          }),
        ],
        ['query'],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
