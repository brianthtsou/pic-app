import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  S3Client,
  GetObjectCommand,
  GetObjectCommandInput,
} from "@aws-sdk/client-s3";

// Configure AWS SDK
const s3Client = new S3Client({
  region: "us-west-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

// Generate and return signed url
const s3Get = async (key: string): Promise<string> => {
  const getObjectParams: GetObjectCommandInput = {
    Bucket: process.env.AWS_PRIVATE_PIC_BUCKET,
    Key: key,
  };

  const command = new GetObjectCommand(getObjectParams);

  try {
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return url;
  } catch (err) {
    console.error("Error getting signed url.", err);
    return "Error getting signed url.";
  }
};

export default s3Get;
