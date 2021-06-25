/** @module FileController */
import User from '../models/User.js';
import File from '../models/File.js';
import { uploadImage, uploadFile } from '../data-access/storage.js';
import {
    uploadS3File,
    getS3FileReadStream,
    deleteS3File,
} from '../data-access/s3.js';
import unlinkFile from '../utils/unlinkFile.js';

/** Post photo - updates (or adds new) currently logged in user's photo. It is meant to operate on protected routes only.
 *  @param {string} photoType - requires photoType URL parameter equal to 'profilePhoto' or 'backgroundImage'.
 */
export const postPhoto = async (req, res) => {
    uploadImage(req, res, async (fileError) => {
        try {
            if (req.fileValidationError) {
                throw Error(req.fileValidationError);
            }
            if (!req.file) {
                throw Error('Please select an image to upload.');
            }
            if (fileError) {
                throw Error(fileError);
            }
            const { userId } = req;
            const { photoType } = req.params;
            const user = await User.findOne({
                where: { id: userId },
            });
            const oldPhoto = user[photoType];
            if (oldPhoto) {
                const fileKey = oldPhoto.replace('/photo/', '');
                await deleteS3File(fileKey);
            }
            const newUpload = await uploadS3File(req.file);
            await unlinkFile(req.file.path);
            await user.update({
                [photoType]: `/photo/${newUpload.key}`,
            });
            res.sendStatus(200);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    });
};

/** Remove photo - removes currently logged in user's photo. It is meant to operate on protected routes only.
 *  @param {string} photoType - requires photoType URL parameter equal to 'profilePhoto' or 'backgroundImage'
 */
export const removePhoto = async (req, res) => {
    const { userId } = req;
    const { photoType } = req.params;
    const user = await User.findOne({
        where: { id: userId },
    });
    const photo = user[photoType];
    if (photo) {
        const fileKey = photo.replace('/photo/', '');
        await deleteS3File(fileKey);
        await user.update({
            [photoType]: null,
        });
        res.sendStatus(200);
        return;
    }
    res.status(400).json({
        error: 'Could not remove photo as it does not exist.',
    });
};

/** Get photo - responds with a photo (profile, background) of a particular user
 * defined by the user ID. */
export const getPhoto = async (req, res) => {
    try {
        const { photoKey } = req.params;
        const readStream = await getS3FileReadStream(photoKey);
        readStream.pipe(res);
    } catch (err) {
        res.status(400).json({
            error: 'Could not find photo as it does not exist.',
        });
    }
};

/** Post file - uploads any chat file to the S3 bucket. It is meant to operate
 *  on protected routes only.
 *  @param {String} chatId - requires a chat ID passed in the request body.
 *  @param {file} file - requires a file attached to the request itself (it
 *  should be done automatically thanks to multer).
 */
export const postFile = async (req, res) => {
    uploadFile(req, res, async (fileError) => {
        try {
            if (req.fileValidationError) {
                throw Error(req.fileValidationError);
            }
            if (!req.file) {
                throw Error('Please select a file to upload.');
            }
            if (fileError) {
                throw Error(fileError);
            }
            const { chatId } = req.body;
            const fileName = req.file.path.split(/[\\/]/).pop();
            const newUpload = await uploadS3File(req.file);
            await unlinkFile(req.file.path);
            const databaseFile = await File.create({
                fileName,
                uri: `/file/${newUpload.key}`,
                ChatId: chatId,
            });
            res.send(databaseFile);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    });
};

/** Remove file - removes a particular file based on the file ID. It is meant to operate on protected routes only.
 * @param {UUID} fileId - requires the ID of the file to be removed passed in the request body.
 */
export const removeFile = async (req, res) => {
    const { fileId } = req.body;
    const file = File.findOne({
        where: {
            id: fileId,
        },
    });
    if (file) {
        const fileKey = file.uri.replace('/file/', '');
        await deleteS3File(fileKey);
        await (await file).destroy();
        res.sendStatus(200);
        return;
    }
    res.status(400).json({
        error: 'Could not remove file as it does not exist.',
    });
};

/** Get file - responds with a file uploaded to the S3 bucket. */
export const getFile = async (req, res) => {
    try {
        const { fileKey } = req.params;
        const readStream = await getS3FileReadStream(fileKey);
        readStream.pipe(res);
    } catch (err) {
        res.status(400).json({
            error: 'Could not find file as it does not exist.',
        });
    }
};

/** Get chat files list - responds with data (IDs, URIs) of all files uploaded to a particular chat defined by the chat ID. It is meant to operate on protected routes only.
 * @param {uuid} chatId - requires a chat ID passed as URL parameter.
 */
export const getChatFilesList = async (req, res) => {
    try {
        const { chatId } = req.params;
        const files = await File.findAll({
            where: { ChatId: chatId },
        });
        res.send(files);
    } catch (err) {
        res.status(400).json({
            error: 'Could not find any files.',
        });
    }
};
