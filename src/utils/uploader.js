import multer from "multer";
const upload = multer({dest: 'uploads/'});

const uploader = upload.single('file');

export default uploader;

