import * as yup from "yup";
import { MessageType } from "../db/types.js";
import { addNoUknownTest } from "../utils/yuputil.js";
import { ListenMessageEventData } from "./types.js";

const listenMessageSchema: yup.SchemaOf<ListenMessageEventData> = yup
  .object({
    message: yup
      .object({
        id: yup.string().notRequired(),
        content: yup.string().required(),
        type: yup.mixed().oneOf(Object.values(MessageType)).required(),
        receiverId: yup.string().required(),
        senderId: yup.string().required(),
      })
      .required(),
    roomId: yup.string().notRequired(),
  })
  .required();

const Schema = {
  listenMessageSchema: addNoUknownTest(listenMessageSchema),
};

export default Schema;
