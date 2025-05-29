import React from "react";
import { dateFormat } from "@/lib/date-format";
import { DocumentWithStatus } from "@/lib/types";
import Link from "next/link";
import { Session } from "next-auth";
import {
  DocumentTextIcon,
  CalendarIcon,
  UserIcon,
  CurrencyDollarIcon,
  TagIcon,
  ClipboardDocumentCheckIcon,
  PencilSquareIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

const typeMapping = new Map([
  ["benefit", "สวัสดิการ"],
  ["procurement", "จัดซื้อจัดจ้าง"],
  ["thousand", "จัดซื้อจัดจ้างเกิน 1 แสน"],
  ["guarantee", "คืนค่าประกัน"],
]);

const DocumentCard = ({
  document,
  session,
}: {
  document: DocumentWithStatus;
  session: Session;
}) => {
  return (
    <div className="bg-white shadow-lg rounded-xl p-6 mb-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">{`${document.docNo}/${document.year}`}</h2>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold flex items-center">
          <TagIcon className="h-4 w-4 mr-1" />
          {typeMapping.get(document.type) || document.type}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center">
          <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-gray-600">{dateFormat(document.date)}</span>
        </div>
        <div className="flex items-center">
          <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-gray-600">{document.user.name}</span>
        </div>
        <div className="flex items-center">
          <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-gray-600">{document.name}</span>
        </div>
        <div className="flex items-center">
          <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-gray-600">
            {document.amount.toLocaleString()} บาท
          </span>
        </div>
        <div className="flex items-center col-span-2">
          <ClipboardDocumentCheckIcon className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-gray-600">
            {document.status.length !== 0
              ? document.status[0].name
              : "ไม่มีสถานะ"}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <Link
          href={`/history/${document.id}`}
          className="text-blue-500 hover:text-blue-700 transition-colors duration-300 flex items-center"
        >
          <EyeIcon className="h-5 w-5 mr-1" />
          {session.pea && ["admin", "checker"].includes(session.pea.role)
            ? "จัดการ/ดูประวัติเอกสาร"
            : "ดูประวัติเอกสาร"}
        </Link>
        {document.status.length !== 0 &&
          document.status[0].name === "เอกสารส่งคืน/แก้ไข" &&
          session.pea?.user === document.user.user && (
            <Link
              href={`/form/edit/${document.id}`}
              className="text-green-500 hover:text-green-700 transition-colors duration-300 flex items-center"
            >
              <PencilSquareIcon className="h-5 w-5 mr-1" />
              แก้ไขเอกสาร
            </Link>
          )}
      </div>
    </div>
  );
};

export default DocumentCard;
