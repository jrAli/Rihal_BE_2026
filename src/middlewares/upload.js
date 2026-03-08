import multer from 'multer';

const $5MB = 5 * 1024 * 1024; // file upload limit constant

// Creating storage to store uploaded file 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/id_images/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = "";
    // path format [datetime]-[original file name].[png, jpeg, webp]
    cb(null, `${Date.now()}-${file.originalname}`); 
  }
});

// Checks file format  
const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error(` ${file.mimetype} is unsupported format try uploading jpeg, png or webp`));
}

export const uploadImage = multer({
  storage,
  fileFilter,
  limits: {fileSize: $5MB}
});

