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

const USERNAME = process.env.USERNAME;
const MAX_FILE_SIZE = process.env.MAX_FILE_SIZE;

export async function POST(request: Request) {
  const { fileName, username, fileSize } = await request.json();
  const uniqueKey = `${fileName}+${Date.now()}`;

  //file size check
  if (Number(fileSize) > (parseInt(MAX_FILE_SIZE!) ?? 0) * 1024 * 1024) {
    return NextResponse.json(
      {
        message: "NO, NO NO NO. file too big",
      },
      { status: 405 }
    );
  }
  //username check
  if (username != USERNAME) {
    return NextResponse.json(
      {
        message: `NO, NO NO NO. ur not ${process.env.USERNAME}`,
      },
      { status: 403 }
    );
  }

  const putCommand = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME!,
    Key: uniqueKey,
  });

  try {
    const presignedPUTURL = await getSignedUrl(s3, putCommand, {
      expiresIn: 3600, // change the PUT expiry time here
    });

    const getCommand = new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME!,
      Key: uniqueKey,
    });

    const presignedGETURL = await getSignedUrl(s3, getCommand, {
      expiresIn: 36000, // change the GET expiry time here
    });

    const url = presignedGETURL;
    console.log("----------------------------reached to saveToDB");
    saveToDB({ username, url });
    return NextResponse.json({
      presignedPUTURL,
      presignedGETURL,
      message: "worked",
    });
  } catch (error) {
    console.error("Error generating signed URL", error);
    return NextResponse.json(
      { message: "Error generating signed URL" },
      { status: 500 }
    );
  }
}
