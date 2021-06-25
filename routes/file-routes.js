import { Router } from 'express';
import {
    postFile,
    removeFile,
    getFile,
    getChatFilesList,
    getPhoto,
} from '../controllers/file-controller.js';
import auth from '../auth/auth.js';

const router = Router();

router.post('/file', auth, postFile);
router.delete('/file', auth, removeFile);
router.get('/file/:fileKey', auth, getFile);
router.get('/file/all/:chatId', auth, getChatFilesList);
router.get('/photo/:photoKey', getPhoto);

export default router;
