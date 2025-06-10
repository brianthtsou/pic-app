import multer from "multer";
import multerS3 from "multer-s3";
import {
  S3Client,
  GetObjectCommand,
  GetObjectCommandInput,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const bucketName = process.env.AWS_PRIVATE_PIC_BUCKET;
if (!bucketName) {
  throw new Error("AWS_PRIVATE_PIC_BUCKET environment variable is not set");
}

// Configure AWS SDK
const s3Client = new S3Client({
  region: "us-west-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

// Configure multer to use S3
export const s3Upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: bucketName,
    key: function (req, file, cb) {
      console.log("Uploading file:");
      console.log("Field Name:", file.fieldname);
      console.log("Original Name:", file.originalname);
      console.log("MIME Type:", file.mimetype);
      console.log("Size:", file.size);
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});

export const s3Get = async (key: string): Promise<string> => {
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
