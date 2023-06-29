import { WithId } from "mongodb";
import { Message, User } from "../db/types";
import { EmitEvent, ListenEvent } from "./events";

type Ack<D> = (result: { ok: false } | { ok: true; data: D }) => void;
export interface ServerToClientEvents {
  [EmitEvent.message]: (message: Message, roomId: string) => void;
}

export interface ClientToServerEvents {
  [ListenEvent.message]: (
    message: Message,
    roomId: string | undefined,
    ack: Ack<{ roomId: string }>
  ) => void;
}

export interface InterServerEvents {}

export type SocketData = WithId<User>;
