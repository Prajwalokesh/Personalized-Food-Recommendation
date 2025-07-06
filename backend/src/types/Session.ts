import mongoose from "mongoose";

export interface SessionBase {
  userId: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}

// For instance methods
export interface SessionDocument extends mongoose.Document, SessionBase {}

// For static methods
export interface SessionModel extends mongoose.Model<SessionDocument> {}
