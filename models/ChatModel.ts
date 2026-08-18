import mongoose, { Document, Schema, Model } from "mongoose";

export interface IChatAttachment {
  url: string;
  fileType: "image" | "pdf";
  fileName: string;
  fileSize: number;
  fileKey?: string;
}

export interface IChat extends Document {
  senderId: string;
  receiverId: string;
  senderName: string;
  senderEmail: string;
  receiverName: string;
  receiverEmail: string;
  gigId: string;
  message: string;
  attachment?: IChatAttachment;
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
    default: "",
  },
  attachment: {
    url: {
      type: String
    },
    fileType: {
      type: String,
      enum: ["image", "pdf"]
    },
    fileName: {
      type: String,
    },
    fileSize: {
      type: Number,
    },
    fileKey: {
      type: String
    }
  },
  timeStamp: {
    type: Date,
    default: Date.now,
  },
});

chatSchema.index({ timeStamp: 1 }, { expireAfterSeconds: 20 * 24 * 60 * 60 });

const Chat: Model<IChat> = mongoose.models.Chat || mongoose.model<IChat>("Chat", chatSchema);
export default Chat;
