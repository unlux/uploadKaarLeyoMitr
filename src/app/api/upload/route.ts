import { config } from "dotenv";
import { NextResponse } from "next/server";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.BUCKET_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// async function uploadtos3(file: Buffer, fileName: string) {
//   const fileBuffer = file;
//   console.log("fileName: " + fileName);

//   const params = {
//     Bucket: process.env.BUCKET_NAME!,
//     Key: `${fileName}+${Date.now()}`,
//     Body: fileBuffer,
//     // ContentType: "image",
//   };
//   const putCommand = new PutObjectCommand(params);
// }

export async function POST(request: Request) {
  const { fileName } = await request.json();
  const uniqueKey = `${fileName}+${Date.now()}`;

  const putCommand = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME!,
    Key: uniqueKey,
  });

  try {
    const presignedPUTURL = await getSignedUrl(s3, putCommand, {
      expiresIn: 3600,
    });

    const getCommand = new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME!,
      Key: uniqueKey,
    });
    const presignedGETURL = await getSignedUrl(s3, getCommand, {
      expiresIn: 3600,
    });

    return NextResponse.json({ presignedPUTURL, presignedGETURL });
  } catch (error) {
    console.error("Error generating signed URL", error);
    return NextResponse.json(
      { error: "Error generating signed URL" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "this is working man ",
  });
}
