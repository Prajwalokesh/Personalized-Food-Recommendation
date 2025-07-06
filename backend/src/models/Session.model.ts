import mongoose from "mongoose";
import { SessionDocument, SessionModel } from "../types/Session";

const sessionSchema = new mongoose.Schema<SessionDocument, SessionModel>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: Number(process.env.SESSION_EXPIRY_TIME_IN_SECONDS) || 0,
    },
  },
  {
    strict: "throw",
  },
);

const Session = mongoose.model<SessionDocument, SessionModel>(
  "Session",
  sessionSchema,
);
export default Session;
