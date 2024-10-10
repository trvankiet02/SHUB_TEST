import e, { Request, Response, NextFunction } from "express";
import multer from "multer";
import xlsx from "xlsx";
import fs from "fs";
import moment from "moment";
import Transaction from "../models/transactions";
import { json } from "stream/consumers";
import { log } from "console";

let lastUploadedData: Transaction[] = [];
let latestFilePath = "";

const upload = multer({
  dest: "uploads/",
});

export const welcome = (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send("Welcome to the API");
};

export const uploadFile = (req: Request, res: Response, next: NextFunction) => {
  upload.single("file")(req, res, (err) => {
    const file = req.file;

    latestFilePath = file.path;

    try {
      const workbook = xlsx.readFile(file.path);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData: Transaction[] = xlsx.utils.sheet_to_json(sheet, {
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

export const getTransactions = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { startTime, endTime } = req.query;

  if (typeof startTime !== "string" || typeof endTime !== "string") {
    return res.status(400).send("Missing required parameters");
  }

  const filteredData = lastUploadedData.filter((transaction: Transaction) => {
    const transactionTime = moment(transaction.gio, "HH:mm:ss");
    return transactionTime.isBetween(
      moment(startTime, "HH:mm:ss"),
      moment(endTime, "HH:mm:ss"),
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
