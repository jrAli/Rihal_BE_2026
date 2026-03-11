import multer from 'multer';

const $5MB = 5 * 1024 * 1024; // file upload limit constant

// Creating storage to store uploaded file 
const idStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/id_images/');
  },
  filename: (req, file, cb) => {
    // path format [datetime]-[original file name].[png, jpeg, webp]
    cb(null, `${Date.now()}-${file.originalname}`); 
  }
});

const attachmentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/attachments/'); 
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Checks file format  
const idFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else {cb(new Error(` ${file.mimetype} is unsupported format try uploading jpeg, png or webp`))};
}

const attachmentFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error(` ${file.mimetype} is unsupported format try uploading jpeg, png, webp or pdf`));
}

export const uploadID = multer({
  storage: idStorage,
  fileFilter: idFilter,
  limits: {fileSize: $5MB}
});

export const uploadAttachment = multer({
  storage: attachmentStorage,
  fileFilter: attachmentFilter,
  limits: { fileSize: $5MB }
});