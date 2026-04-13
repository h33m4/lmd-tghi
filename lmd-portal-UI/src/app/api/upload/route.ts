import { auth } from "@/auth";
import handleUpdateUserProfilePicture from "@/lib/actions/auth/handleUpdateUserProfilePicture";
import AppConfiguration from "@/lib/configuration";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const user = await auth();
  if (data.get("uploadType") === "profile-picture") {
    const file: File = data.get("file") as File;
    const bytes = await file.arrayBuffer();
    const PicBuffer: Buffer = Buffer.from(bytes);

    // extract file extension and rename file with user name
    const fileExt = file.type.substring(file.type.lastIndexOf("/") + 1);
    const username = user?.user.name?.replace(/\s/g, "");

    const objectKey = `profile-pictures/${username}.${fileExt}`;

    // upload to s3
    const client = new S3Client(AppConfiguration.AWSConfig);
    const command = new PutObjectCommand({
      Bucket: AppConfiguration.s3BucketName,
      Key: objectKey,
      Body: PicBuffer,
    });

    const response = await client.send(command);
    console.log("res", response);
    const profileLink = `${process.env.LMD_S3BUCKETLINK}${objectKey}`;
    console.log("here, ", profileLink);

    return NextResponse.json({ success: profileLink });
  }

  return NextResponse.json({ success: true });
}
