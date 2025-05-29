// tableColumns.tsx
import { dateFormat } from "@/lib/date-format";
import { DocumentWithStatus } from "@/lib/types";
import Link from "next/link";
import { Session } from "next-auth";

export const getColumns = (session: Session) => [
  {
    name: "เลขที่เอกสาร",
    selector: (row: DocumentWithStatus) => `${row.docNo}/${row.year}`,
    sortable: true,
  },
  {
    name: "วันที่",
    selector: (row: DocumentWithStatus) => dateFormat(row.date),
    sortable: true,
  },
  {
    name: "ประเภทเอกสาร",
    selector: (row: DocumentWithStatus) => row.type,
    sortable: true,
  },
  {
    name: "ชื่อเอกสาร",
    selector: (row: DocumentWithStatus) => row.name,
    sortable: true,
  },
  {
    name: "จำนวนเงิน",
    selector: (row: DocumentWithStatus) => row.amount,
    sortable: true,
  },
  {
    name: "เจ้าของเอกสาร",
    selector: (row: DocumentWithStatus) => row.user.name,
    sortable: true,
  },
  {
    name: "สถานะปัจจุบัน",
    selector: (row: DocumentWithStatus) =>
      row.status.length !== 0 && row.status[0].name,
    sortable: true,
  },
  {
    name: "การดำเนินการ",
    cell: (row: DocumentWithStatus) => (
      <>
        <Link href={`/history/${row.id}`}>
          {session.pea &&
            ["admin", "checker"].includes(session.pea.role) &&
            "จัดการ/"}
          ดูประวัติ เอกสาร
        </Link>
        {row.status.length !== 0 &&
          row.status[0].name === "เอกสารส่งคืน/แก้ไข" &&
          session.pea?.user === row.user.user && (
            <Link href={`/form/edit/${row.id}`}>แก้ไขเอกสาร</Link>
          )}
      </>
    ),
  },
];