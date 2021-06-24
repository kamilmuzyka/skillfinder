import fs from 'fs';
import S3 from 'aws-sdk/clients/s3.js';
import dotenv from 'dotenv';

dotenv.config();

/** Create a new S3 instance. */
const s3 = new S3({
    region: process.env.AWS_BUCKET_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
});

/** Uploads a file to the S3 bucket. */
export const uploadS3File = async (file) => {
    try {
        const fileStream = fs.createReadStream(file.path);
        const uploadParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Body: fileStream,
            Key: file.filename,
        };
        return s3.upload(uploadParams).promise();
    } catch (error) {
        throw Error('Failed to upload the file.');
    }
};

/** Uploads a file to the S3 bucket. */
export const deleteS3File = async (fileKey) => {
    try {
        const deleteParams = {
            Key: fileKey,
            Bucket: process.env.AWS_BUCKET_NAME,
        };
        return s3.deleteObject(deleteParams);
    } catch (error) {
        throw Error('Failed to delete the file.');
    }
};

/** Downloads a file from the S3 bucket. */
export const getS3FileReadStream = async (fileKey) => {
    try {
        const downloadParams = {
            Key: fileKey,
            Bucket: process.env.AWS_BUCKET_NAME,
        };
        return s3.getObject(downloadParams).createReadStream();
    } catch (error) {
        throw Error('Failed to fetch the file.');
    }
};
