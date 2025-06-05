import mongoose, { Document, Schema, Model } from "mongoose";

export interface IChat extends Document {
  senderId: string;
  receiverId: string;
  senderName: string;
  senderEmail: string;
  receiverName: string;
  receiverEmail: string;
  gigId: string;
  message: string;
  timeStamp: Date;
}

const chatSchema: Schema<IChat> = new mongoose.Schema({
  senderId: {
    type: String,
    required: true,
  },
  receiverId: {
    type: String,
    required: true,
  },
  senderName: {
    type: String,
    required: true,
  },
  senderEmail: {
    type: String,
    required: true,
  },
  receiverName: {
    type: String,
    required: true,
  },
  receiverEmail: {
    type: String,
    required: true,
  },
  gigId: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timeStamp: {
    type: Date,
    default: Date.now,
  },
});

// documents older than 20 days will be deleted automatically
chatSchema.index({ timeStamp: 1 }, { expireAfterSeconds: 20 * 24 * 60 * 60 });

const Chat: Model<IChat> = mongoose.models.Chat || mongoose.model<IChat>("Chat", chatSchema);
export default Chat;
