import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { v4 } from 'uuid';

/** Creates a user upload directory if it doesn't exist.
 * @param {string} userId- the user the dir is for.
 * @param {string} chatId- can be undefined, defaults to photos directory
 * @param {function} callback - Function that is executed after creating the dir.
 * @returns void
 */
const createUploadDirectory = async (userId, chatId, callback) => {
    let chatIdStr;
    if (chatId === undefined) {
        chatIdStr = 'photos';
    } else {
        chatIdStr = chatId;
    }
    const userDir = path.join('.', 'data-access', 'uploads', userId, chatIdStr);

    fs.stat(userDir, async (error) => {
        if (error) {
            fs.mkdirSync(userDir, { recursive: true });
            callback(userDir);
            return;
        }
        callback(userDir);
    });
};

/** Creates a multer Storage Component.
 * @param {Request} req - Content-type must be of: 'multipart/form-data'
 * @param {file} file - the file information included in the Request parameter.
 * @param {function} cb - callback function to be called when the file operation is complete.
 */
const storage = multer.diskStorage({
    destination(req, file, cb) {
        createUploadDirectory(req.userId, req.body.chatId, (userDir) => {
            cb(null, userDir);
        });
    },
    /** Generates a new random uuid for the file name */
    filename(req, file, cb) {
        cb(null, `${v4() + path.extname(file.originalname)}`);
    },
});

/** Creates a multer Storage Component.
 * @param {Request} req - Content-type must be of: 'multipart/form-data'
 * @param {file} file - the file information included in the Request parameter.
 * @param {function} cb - callback function to be called when the file operation is complete.
 */
const fileStorage = multer.diskStorage({
    destination(req, file, cb) {
        createUploadDirectory(req.userId, req.body.chatId, (userDir) => {
            cb(null, userDir);
        });
    },
    /** Keeps file name intact */
    filename(req, file, cb) {
        cb(null, `${file.originalname}`);
    },
});

const imageFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError =
            'Only image files are allowed (.jpg, .jpeg, .png, .gif).';
        return cb('Only image files are allowed.');
    }
    cb(null, true);
};

/** Creates a multer object and passes the configuration above
 * @requires [storage,fileFilter,limits] Requires a multer diskStorage component, optionally a fileFilter function and a limits object.
 * @middleware [.single('tag')] Populates the Request with the file that has the specified string tagged. eg. ['image', image]
 */
export const uploadImage = multer({
    storage,
    fileFilter: imageFilter,
    limits: { fileSize: 2048 * 2048 },
}).single('image');

export const uploadFile = multer({
    storage: fileStorage,
}).single('file');

export default { uploadImage, uploadFile };