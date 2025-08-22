import AWS from "aws-sdk";
import 'dotenv/config';
import connectDB from "./connectdb";


const s3 = new AWS.S3({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_KEY!,
    secretAccessKey: process.env.AWS_SECRET!,
  },
});

console.log("Region:", s3.config.region);
console.log("Key length:", process.env.AWS_KEY?.length);
console.log("Secret length:", process.env.AWS_SECRET?.length);


export const uploadToS3 = (
  buffer: Buffer,
  userid : string,
  originalName: string,
  mimeType: string
) => {
  const folder = "resumes";
  const params = {
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: `${folder}/${userid}-${originalName}`, 
    Body: buffer,
    ContentType: mimeType,
  };


  return s3.upload(params).promise();
};
