import { Request, Response, NextFunction } from "express";

export const validateTransactionQuery = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { startTime, endTime } = req.query;

  if (typeof startTime !== "string" || typeof endTime !== "string") {
    return res.status(400).send("Missing required parameters");
  }

  next();
};

export const validateUpload = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // validate file is exists, file is xlsx file, file size not more than 50MB
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  if (req.file.size > 50 * 1024 * 1024) {
    return res.status(400).send("File size exceeds limit of 50MB.");
  }
  if (
    req.file.mimetype !==
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    return res.status(400).send("Only xlsx files are allowed.");
  }

  next();
};
