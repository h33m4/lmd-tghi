"use server";

import { auth } from "@/auth";
import AppConfiguration from "@/lib/configuration";
import { getErrorMessage } from "@/utils/helper_functions";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const handleUpdateUserProfilePicture = async (file: File | Buffer) => {
  console.log("file in server", file);
  //   var fileName = file.name;
  //   var objectKey = `${AppConfiguration.s3BucketName}/${fileName}`;

  //   const client = new S3Client(AppConfiguration.AWSConfig);
  //   const command = new PutObjectCommand({
  //     Bucket: AppConfiguration.s3BucketName,
  //     Key: objectKey,
  //     Body: file,
  //   });

  try {
    // const response = await client.send(command);
    // console.log("res", response);
  } catch (err) {
    console.error("err", err);
    return { error: getErrorMessage(err) };
  }

  return { success: "User updated successfuly" };
};

export default handleUpdateUserProfilePicture;
