"use client";
import React from "react";
import DataTable from "react-data-table-component";
import { getColumns } from "./tableColumns";
import DocumentCard from "./documentCard";
import { DocumentWithStatus } from "@/lib/types";
import { Session } from "next-auth";
import { typeMapping } from "@/lib/doctype-map";
import Link from "next/link";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

export default function DocumentTable({
  documentsWithStatus,
  session,
}: {
  documentsWithStatus: DocumentWithStatus[];
  session: Session;
}) {
  const columns = getColumns(session);

  const paginationComponentOptions = {
    rowsPerPageText: "จำนวนรายการ",
    rangeSeparatorText: "ถึง",
    selectAllRowsItem: true,
    selectAllRowsItemText: "ทั้งหมด",
  };

  const TypeCell: React.FC<{ row: DocumentWithStatus }> = ({ row }) => (
    <span>{typeMapping.get(row.type) || row.type}</span>
  );

  const ActionCell: React.FC<{ row: DocumentWithStatus }> = ({ row }) => {
    if (row.status.length !== 0 && row.status[0].name === "เอกสารส่งคืน/แก้ไข" &&
      session.pea?.user === row.user.user) {
      return (
        <Link
          href={`/form/edit/${row.id}`}
          className="inline-flex items-center justify-center bg-greencut hover:bg-greencut1 text-white font-bold py-2 px-4 rounded shadow-lg transition-all duration-300"
        >
          <PencilSquareIcon className="h-5 w-5 mr-1" />
          รอการแก้ไข
        </Link>
      );
    } else {
      return (
        <Link
          href={`/history/${row.id}`}
          className="inline-flex items-center justify-center bg-yellow-600 hover:bg-yellow-300 text-white font-bold py-2 px-4 rounded shadow-lg transition-all duration-300"
        >
          ดำเนินการ
        </Link>
      );
    }
  };

  const enhancedColumns = columns.map((column) => {
    if (column.name === "ประเภทเอกสาร") {
      return {
        ...column,
        cell: (row: DocumentWithStatus) => <TypeCell row={row} />,
        sortable: true,
      };
    }
    if (column.name === "การดำเนินการ") {
      return {
        ...column,
        cell: (row: DocumentWithStatus) => <ActionCell row={row} />,
        sortable: false,
      };
    }
    return column;
  });

  return (
    <div className="p-3">
      <div className="hidden md:block overflow-x-auto">
        <DataTable
          fixedHeader
          columns={enhancedColumns}
          data={documentsWithStatus}
          pagination
          paginationComponentOptions={paginationComponentOptions}
          responsive
          highlightOnHover
          striped
          customStyles={{
            headCells: {
              style: {
                backgroundColor: "#EBF4FF",
                color: "#1D4ED8",
                fontWeight: "bold",
              },
            },
            cells: {
              style: {
                paddingLeft: "20px",
                paddingRight: "20px",
              },
            },
          }}
        />
      </div>
      <div className="block md:hidden">
        {documentsWithStatus.map((document) => (
          <DocumentCard
            key={document.id}
            document={document}
            session={session}
          />
        ))}
      </div>
    </div>
  );
}
