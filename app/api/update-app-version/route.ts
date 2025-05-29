import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const key = authHeader.split(" ")[1];
  const validKey = process.env.NEXT_PUBLIC_UPDATE_DB_KEY; // Replace with your actual key

  if(key != validKey){
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
      const r1 = await prisma.status.updateMany({
        where: {
          name: {
            in: [
              "รับเอกสารต้นฉบับ",
              "กำลังตรวจสอบเอกสาร",
              "เอกสารตรวจสอบผ่านเรียบร้อย",
              "กำลังดำเนินการเข้าระบบ",
              "ดำเนินการประมวลผลในระบบ SAP",
              "พบปัญหาในระบบ SAP",
              "ใบสำคัญจ่ายรอเสนอ หผ.",
              "ใบสำคัญจ่ายรอเสนอ ผจก.",
              "เอกสารตรวจไม่ผ่าน",
            ],
          },
        },
        data: {
          name: "รับเอกสารต้นฉบับ",
        },
      });

      const r2 = await prisma.status.updateMany({
        where: {
          name: {
            in: ["ใบสำคัญจ่ายรอเบิกจ่ายเงินสด/เช็ค", "เบิกจ่ายเสร็จสิ้น"],
          },
        },
        data: {
          name: "เสร็จสิ้นรอเบิกจ่าย/รอโอนเงิน",
        },
      });

      const r3 = await prisma.status.updateMany({
        where: {
          name: "เอกสารส่งคืน/ตีกลับ"
        },
        data: {
          name: "เอกสารส่งคืน/แก้ไข",
        },
      })

      return NextResponse.json({ message: "success" }, { status: 200 });
    } catch (e) {
      return NextResponse.json({ message: "error" }, { status: 500 });
    }
}
