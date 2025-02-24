import mongoose, { Schema, Document } from "mongoose";

/**
 * Interface representing a message in the system.
 * Extends the Mongoose Document type for database operations.
 */
export interface Message extends Document {
  /** The content of the message */
  content: string;
  /** Timestamp when the message was created */
  createdAt: Date;
}

/**
 * Mongoose schema for the Message model.
 * Defines the structure and validation rules for messages.
 */
const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true, // Message content cannot be empty
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set to current timestamp when created
  },
});

/**
 * Interface representing a user in the system.
 * Extends the Mongoose Document type for database operations.
 */
export interface User extends Document {
  username: string;
  email: string;
  password: string;
  /** Verification code for email confirmation */
  verifyCode: string;
  /** Expiration timestamp for the verification code */
  verifyCodeExpiry: Date;
  /** Indicates if the user's email is verified */
  isVerified: boolean;
  /** Controls whether the user can receive messages */
  isAcceptingMessages: boolean;
  /** Array of messages received by the user */
  messages: Message[];
}

/**
 * Mongoose schema for the User model.
 * Defines the structure, validation rules, and relationships for users.
 */
const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Ensures usernames are unique across the system
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures email addresses are unique
  },
  password: {
    type: String,
    required: true, // Password is mandatory for authentication
  },
  verifyCode: {
    type: String,
    // Optional field for email verification process
  },
  verifyCodeExpiry: {
    type: Date,
    // Timestamp for verification code expiration
  },
  isVerified: {
    type: Boolean,
    default: false, // Users start as unverified
  },
  isAcceptingMessages: {
    type: Boolean,
    default: true, // Users can receive messages by default
  },
  messages: [MessageSchema], // Embedded array of messages using MessageSchema
});

/**
 * Mongoose model for User.
 * Uses existing model if available, otherwise creates a new one.
 * This prevents model recompilation errors in development.
 */
const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
