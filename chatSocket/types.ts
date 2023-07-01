import { WithId } from "mongodb";
import { Message, User } from "../db/types";
import { EmitEvent, ListenEvent } from "./events";
import { Socket } from "socket.io";
import { Omit, PartialBy } from "../types";

type Ack<D> = (result: { ok: false } | { ok: true; data: D }) => void;
export interface ServerToClientEvents {
  [EmitEvent.message]: (message: Message, roomId: string) => void;
}

export interface ClientToServerEvents {
  [ListenEvent.message]: (
    message: Omit<PartialBy<Message, "id">, "timestamp">,
    roomId: string | undefined,
    ack: Ack<{ roomId: string }>
  ) => void;
}

export interface InterServerEvents {}

export type SocketData = WithId<User>;

export type ChatSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export type ClientEventHandler<K extends keyof ClientToServerEvents> = (
  socket: ChatSocket
) => ClientToServerEvents[K];
