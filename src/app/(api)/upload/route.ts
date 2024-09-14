import { NextResponse } from "next/server";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { saveToDB } from "@/lib/db";

const s3 = new S3Client({
  region: process.env.BUCKET_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request) {
  const { fileName, username } = await request.json();
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
    const url = presignedGETURL;

    console.log("----------------------------reached to saveToDB");
    saveToDB({ username, url });
    return NextResponse.json({ presignedPUTURL, presignedGETURL });
  } catch (error) {
    console.error("Error generating signed URL", error);
    return NextResponse.json(
      { error: "Error generating signed URL" },
      { status: 500 }
    );
  }
}
