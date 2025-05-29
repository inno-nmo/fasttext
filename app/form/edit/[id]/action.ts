"use server"

import { authOptions } from "@/auth-options"
import { getLastestDocNumber } from "@/lib/get-latest-docNo"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

export async function editDocument(prevState: {message: string, err: boolean}, formData: FormData) {
    const session = await getServerSession(authOptions)
  if(!session || !session.pea){
      redirect("/user/profile")
  }

  const id = formData.get("id")?.toString()
  const findDoc = await prisma.document.findFirst({
    where :{
        id
    },
    select : {
        status: {
            orderBy: {
                date: "desc"
            },
            select: {
                name: true
            }
        },
        id: true,
        docNo: true,
        year: true,
        amount: true,
        note: true,
        name: true,
        type: true,
        user: {
            select: {
                id: true,
                name: true,
            }
        },
        fromSection: {
            select : {
                name: true
            }
        }
    }
})

  if(!findDoc || findDoc.status.length == 0 || findDoc.status[0].name != "เอกสารส่งคืน/แก้ไข" || findDoc.user.id != session.pea.id ){
    return {
        err: true,
        message: "ไม่พบเอกสาร หรือเอกสารนี้ไม่สามารถแก้ไขได้"
    }
}

  const name = formData.get("name")?.toString()
  if(!name){
    return {
      message: "กรุณาใส่ชื่อเอกสาร",
      err: true
    }
  }
  let note = formData.get("note")?.toString()
  if(!note){
    note = "-"
  }

  const amountStr = formData.get("amount")?.toString()
  if(!amountStr || !/^\d+(\.\d{1,2})?$/.test(amountStr)){
    return {
      message: "กรุณาใส่จำนวนเงินให้ถูกต้อง (ไม่มีลูกน้ำ และทศนิยมไม่เกิน 2 ตำแหน่ง)",
      err: true
    }
  }

  let amount = parseFloat(amountStr)

  const data = {
    name,
    note,
    amount,
  }

  const {newDocNo,yearSuffix} = await getLastestDocNumber()

  // สร้างเอกสารใหม่
  const updatedDocument = await prisma.document.update({
    where: {
        id
    },
    data: {
      ...data,
      docNo: newDocNo,
      year: yearSuffix,
      date: new Date()
    },
    select: {
      status:true,
      id: true,
      docNo: true,
      year: true
    }
  });

  const newStatus = await prisma.status.create({
    data: {
        name: "รอเอกสารต้นฉบับ",
        date: new Date(),
        documentId: updatedDocument.id,
        updatedByUserId: session.pea.id
    }
  })
  return {
    err: false,
    message: updatedDocument.id
  }
    
}