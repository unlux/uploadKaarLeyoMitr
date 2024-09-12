import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { config } from "dotenv";

// const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
// const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

// if (!accessKeyId || !secretAccessKey) {
//   throw new Error(
//     "AWS credentials are not defined in the environment variables."
//   );
// }
// Create an S3 client with the necessary credentials
const s3 = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const UploadFunction = async () => {
  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME!,
    Key: "hello-s3.txt",
    Body: "Hello S3!",
  });

  const signedURL = getSignedUrl(s3, command, {
    expiresIn: 60,
  });

  console.log(signedURL);

  try {
    const response = await s3.send(command);
    console.log(response);
  } catch (err) {
    console.error(err);
  }
};
