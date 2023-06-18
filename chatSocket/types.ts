import { WithId } from "mongodb";
import { User } from "../db/types";

export interface ServerToClientEvents {}

export interface ClientToServerEvents {}

export interface InterServerEvents {}

export type SocketData = WithId<User>;
