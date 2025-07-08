import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { UserDocument, UserModel } from "../types/User";

const userSchema = new mongoose.Schema<UserDocument, UserModel>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 32,
    },
    lastName: {
      type: String,
      trim: true,
      default: "",
      maxlength: 32,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 24,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 64,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 128,
    },
  },
  {
    timestamps: true,
    strict: "throw",
    statics: {
      findByEmail(email: string) {
        return this.findOne({ email });
      },
      findByUsername(username: string) {
        return this.findOne({ username });
      },
    },
    methods: {
      comparePassword(candidatePassword: string) {
        return bcrypt.compare(candidatePassword, this.password);
      },
    },
  },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  return next();
});

const User = mongoose.model<UserDocument, UserModel>("User", userSchema);
export default User;
