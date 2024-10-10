"use client";

import React, { useState } from "react";
import Transaction from "@/models/transactions";
import moment from "moment";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./DataTable";

const FileUploader: React.FC = () => {
  const [data, setData] = useState<Transaction[]>([]);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  const columns = React.useMemo<ColumnDef<Transaction>[]>(
    () => [
      {
        accessorKey: "stt",
        cell: (info) => info.getValue(),
        header: () => "STT",
      },
      {
        accessorKey: "ngay",
        cell: (info) => info.getValue(),
        header: () => "Ngày",
      },
      {
        accessorKey: "gio",
        cell: (info) => info.getValue(),
        header: () => "Giờ",
      },
      {
        accessorKey: "tram",
        cell: (info) => info.getValue(),
        header: () => "Trạm",
      },
      {
        accessorKey: "tru_bom",
        cell: (info) => info.getValue(),
        header: () => "Trực bom",
      },
      {
        accessorKey: "mat_hang",
        cell: (info) => info.getValue(),
        header: () => "Mặt hàng",
      },
      {
        accessorKey: "so_luong",
        cell: (info) => info.getValue(),
        header: () => "Số lượng",
      },
      {
        accessorKey: "don_gia",
        cell: (info) => info.getValue(),
        header: () => "Đơn giá",
      },
      {
        accessorKey: "thanh_tien",
        cell: (info) => info.getValue(),
        header: () => "Thanh tiền",
      },
      {
        accessorKey: "tt_thanh_toan",
        cell: (info) => info.getValue(),
        header: () => "Trạng thái thanh toán",
      },
      {
        accessorKey: "ma_khach_hang",
        cell: (info) => info.getValue(),
        header: () => "Mã khách hàng",
      },
      {
        accessorKey: "ten_khach_hang",
        cell: (info) => info.getValue(),
        header: () => "Tên khách hàng",
      },
      {
        accessorKey: "loai_khach_hang",
        cell: (info) => info.getValue(),
        header: () => "Loại khách hàng",
      },
      {
        accessorKey: "ngay_thanh_toan",
        cell: (info) => info.getValue(),
        header: () => "Ngày thanh toán",
      },
      {
        accessorKey: "nhan_vien",
        cell: (info) => info.getValue(),
        header: () => "Nhân viên",
      },
      {
        accessorKey: "bien_so_xe",
        cell: (info) => info.getValue(),
        header: () => "Biển số xe",
      },
      {
        accessorKey: "tt_hoa_don",
        cell: (info) => info.getValue(),
        header: () => "Trạng thái hoa đơn",
      },
    ],
    [],
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile); // Lưu file vào state
      console.log("selectedFile", selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Vui lòng chọn file để upload!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8080/api/v1/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Lỗi khi upload file!");
      }

      // Nếu upload thành công, đọc dữ liệu từ file và cập nhật state
      const data = await response.json();
      setData(data); // Giả sử server trả về dữ liệu ở định dạng JSON
      console.log(data);
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra. Vui lòng thử lại!");
    }
  };

  const calculateTotal = () => {
    const total = data.reduce((sum, transaction) => {
      const transactionTime = moment(transaction.gio, "HH:mm:ss");
      const amount = transaction.thanh_tien;

      if (transactionTime && amount) {
        if (
          transactionTime.isBetween(
            moment(startTime, "HH:mm:ss"),
            moment(endTime, "HH:mm:ss"),
            undefined,
            "[]",
          )
        ) {
          return sum + amount;
        }
      }
      return sum;
    }, 0);

    alert(`Tổng thành tiền trong khoảng thời gian là: ${total}`);
  };

  return (
    <div className="p-4 bg-gray-100">
      <div className="mb-4">
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
        />
        <button
          onClick={handleUpload}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Upload File
        </button>
      </div>
      <div className="mb-4">
        <input
          type="time"
          placeholder="HH:mm:ss"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="mr-2 px-2 py-1 border border-gray-300 rounded-lg focus:outline-none"
        />
        <input
          type="time"
          placeholder="HH:mm:ss"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded-lg focus:outline-none"
        />
        <button
          onClick={calculateTotal}
          className="ml-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Tính Tổng Thành Tiền
        </button>
      </div>
      <DataTable data={data} columns={columns} />
    </div>
  );
};

export default FileUploader;
