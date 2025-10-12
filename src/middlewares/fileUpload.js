// middlewares/fileUpload.js
const multer = require("multer");
const path = require("path");

module.exports = function (UPLOADS_FOLDER) {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, UPLOADS_FOLDER);
    },
    filename: (req, file, cb) => {
      const fileExt = path.extname(file.originalname);
      const filename =
        file.originalname
          .replace(fileExt, "")
          .toLowerCase()
          .split(" ")
          .join("-") +
        "-" +
        Date.now();

      cb(null, filename + fileExt);
    },
  });

  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 200 * 1024 * 1024, // 200 MB
    },
    fileFilter: (req, file, cb) => {
      const isImage = /thumbnail/i.test(file.fieldname);
      const isVideo = /videoFile/i.test(file.fieldname);

      if (isImage) {
        // Accept images
        if (
          ["image/jpeg", "image/png", "image/webp", "image/avif", "image/heic", "image/heif", "image/gif"]
            .includes(file.mimetype)
        ) {
          cb(null, true);
        } else {
          cb(new Error("Only image formats are allowed!"));
        }
      } else if (isVideo) {
        // Accept videos
        if (
          ["video/mp4", "video/webm", "video/ogg"].includes(file.mimetype)
        ) {
          cb(null, true);
        } else {
          cb(new Error("Only video formats are allowed!"));
        }
      } else {
        cb(null, true); // allow other fields (optional)
      }
    }

  });

  return upload;
};
