import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface _SERVICE {
  'createEvent' : ActorMethod<
    [
      Principal,
      {
        'startTime' : string,
        'endTime' : string,
        'name' : string,
        'description' : string,
      },
    ],
    {
        'Ok' : {
          'startTime' : string,
          'endTime' : string,
          'name' : string,
          'description' : string,
        }
      } |
      {
        'Err' : { 'InvalidPayload' : string } |
          { 'NotFound' : string } |
          { 'AlreadyExists' : string }
      }
  >,
  'generateQrCode' : ActorMethod<
    [string],
    { 'Ok' : string } |
      {
        'Err' : { 'InvalidPayload' : string } |
          { 'NotFound' : string } |
          { 'AlreadyExists' : string }
      }
  >,
  'getEventIds' : ActorMethod<
    [Principal],
    { 'Ok' : Array<string> } |
      {
        'Err' : { 'InvalidPayload' : string } |
          { 'NotFound' : string } |
          { 'AlreadyExists' : string }
      }
  >,
  'getIdentity' : ActorMethod<[], string>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: ({ IDL }: { IDL: IDL }) => IDL.Type[];
