import { NextFunction, Request, Response } from "express";
import multer from "multer";
import login from "../utils/loginRedirection.js";

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./pfp");
  },

  filename: (req, file, callback) => {
    callback(null, `picture${Date.now()}${file.originalname}`);
  }
});

async function upload(req: Request, res: Response, next: NextFunction) {
  if (!login(res)) return;

  const upload = multer({
    storage,
    fileFilter: (req, file, callback) => {
      const splitted = file.originalname.split(".");
      const extension = splitted[splitted.length - 1];

      if (!(extension === "png" || extension === "jpg" || extension === "jpeg" || extension === "webp")) {
        callback(new Error("please submit an image"));
        return;
      };
      callback(null, true);
    }
  });
  const middleware = upload.single("pfp");

  try {
    await middleware(req, res, next);
  } catch (error) {
    res.status(500).send({
      message: "error when uploading pfp, please try again later"
    });
    console.log(error);
  };
  return;
};

export default upload;
