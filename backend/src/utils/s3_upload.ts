import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";

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
const s3Upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: bucketName,
    key: function (req, file, cb) {
      console.log(file);
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});

export default s3Upload;
