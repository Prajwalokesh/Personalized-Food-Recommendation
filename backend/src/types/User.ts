import mongoose from "mongoose";

export interface UserBase {
  firstName: string;
  lastName?: string;
  username: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// For instance methods
export interface UserDocument extends mongoose.Document, UserBase {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// For static methods
export interface UserModel extends mongoose.Model<UserDocument> {
  findByEmail(email: string): Promise<UserDocument | null>;
  findByUsername(username: string): Promise<UserDocument | null>;
}
