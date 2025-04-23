import dotenv from "dotenv";
dotenv.config();

import connectDb from "@/Database/connection";
import result from "../Database/Models/result";
import amqp from "amqplib";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResult {
  public_id: string;
  bytes: number;
  duration?: number;
  secure_url: string;
  [key: string]: any;
}

const uploadVideoToCloudinary = (buffer: Buffer<ArrayBuffer>):Promise<UploadApiResponse | undefined> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "video",
        folder: "video-upload",
        transformation: [{ quality: "auto", fetch_format: "mp4" }],
      },
      (error, result) => {
        if (error) {
          return reject("Error uploading video to Cloudinary");
        }
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

const startConsumer = async () => {
  try {
    await connectDb();
    const connection = await amqp.connect(process.env.RABBITMQ_URL!);
    const channel = await connection.createChannel();
    const queue = "video_upload_queue";

    await channel.assertQueue(queue, { durable: true });

    console.log("Waiting for video upload tasks...");

    channel.consume(queue, async (msg) => {
      if (msg) {
        const messageContent = JSON.parse(msg.content.toString());
        const { buffer: base64Buffer, resultId } = messageContent;
        const buffer = Buffer.from(base64Buffer, 'base64')
        try {
          const uploadedVideoDetails = await uploadVideoToCloudinary(buffer);
          console.log("Video uploaded successfully:",);
          if (uploadedVideoDetails) {
            await result.updateOne({ _id: resultId }, { videoUrl: uploadedVideoDetails.secure_url });
          }
          channel.ack(msg);
        } catch (error) {
          console.error("Error uploading video:", error, "omkkar");
          channel.nack(msg, false, true);
        }
      }
    });
  } catch (error) {
    console.error("Error connecting to RabbitMQ:", error);
  }
};

startConsumer();
