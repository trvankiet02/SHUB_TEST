import e, { Request, Response, NextFunction } from "express";
import multer from "multer";
import xlsx from "xlsx";
import fs from "fs";
import moment from "moment";
import ITransaction from "../models/transactions";

let lastUploadedData: ITransaction[] = [];
let latestFilePath = "";
const MAX_FILE_SIZE = 50 * 1024 * 1024;

const upload = multer({
  dest: "uploads/",
});

export const welcome = (req: Request, res: Response) => {
  res.status(200).send("Welcome to the API");
};

export const uploadFile = (req: Request, res: Response) => {
  console.log(req.file);
  upload.single("file")(req, res, (err) => {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    if (req.file.size > MAX_FILE_SIZE) {
      return res.status(400).send("File size exceeds limit of 50MB.");
    }
    if (
      req.file.mimetype !==
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      return res.status(400).send("Only xlsx files are allowed.");
    }

    const file: Express.Multer.File = req.file;

    latestFilePath = file.path;

    try {
      const workbook = xlsx.readFile(file.path);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData: ITransaction[] = xlsx.utils.sheet_to_json(sheet, {
        range: 8,
        header: [
          "stt",
          "ngay",
          "gio",
          "tram",
          "tru_bom",
          "mat_hang",
          "so_luong",
          "don_gia",
          "thanh_tien",
          "tt_thanh_toan",
          "ma_khach_hang",
          "ten_khach_hang",
          "loai_khach_hang",
          "ngay_thanh_toan",
          "nhan_vien",
          "bien_so_xe",
          "tt_hoa_don",
        ],
      });

      lastUploadedData = jsonData;

      fs.unlinkSync(file.path);
      res.json(jsonData);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error processing file");
    }
  });
};

export const getTransactions = (req: Request, res: Response) => {
  const { startTime, endTime } = req.query;

  if (typeof startTime !== "string" || typeof endTime !== "string") {
    return res.status(400).send("Missing required parameters");
  }

  const startTimeMoment = moment(startTime, "HH:mm:ss");
  const endTimeMoment = moment(endTime, "HH:mm:ss");

  if (!startTimeMoment.isValid() || !endTimeMoment.isValid()) {
    return res.status(400).send("Invalid time format");
  }

  const filteredData = lastUploadedData.filter((transaction: ITransaction) => {
    const transactionTime = moment(transaction.gio, "HH:mm:ss");
    return transactionTime.isBetween(
      startTimeMoment,
      endTimeMoment,
      undefined,
      "[]",
    );
  });

  const totalAmount = filteredData.reduce(
    (total, transaction) => total + transaction.thanh_tien,
    0,
  );

  res.json({ tong_thanh_tien: totalAmount });
};
