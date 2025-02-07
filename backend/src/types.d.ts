import { File } from "multer";

export interface MulterS3File extends File {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  bucket: string;
  key: string;
  acl: string;
  contentType: string;
  contentDisposition: null;
  contentEncoding: null;
  storageClass: string;
  serverSideEncryption: null;
  metadata: undefined;
  location: string;
  etag: string;
  versionId: undefined;
}
