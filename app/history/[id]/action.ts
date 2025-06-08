"use server"

import { authOptions } from "@/auth-options"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { getWebexPeople, sendWebexMessage } from "@/lib/webex"



export async function changeStatus(preverse:{err:boolean,message:string},formData:FormData) {
    const id = formData.get("id")?.toString()
    const name = formData.get("name")?.toString()
    const note = formData.get("note")?.toString()
    if(!id || !name){
        return {
            err: true,
            message: "กรุณากรอกข้อมูลให้ครบถ้วน"
        }
    }
    const session = await getServerSession(authOptions)
    if(!session || !session.pea){
        redirect ("/user/in")
    }

    if(!['admin','checker'].includes(session.pea.role)){
        return {
            err: true,
            message: "คุณไม่มีสิทธิ์ในการเปลี่ยนแปลงสถานะเอกสาร"
        }
    }

    try{
        const status = await prisma.status.create({
            data : {
                name: name,
                date: new Date(),
                documentId: id,
                note,
                updatedByUserId: session.pea.id
            }
        })
        if(status.name == 'เสร็จสิ้นรอเบิกจ่าย/รอโอนเงิน'){
            //TODO: ส่งแจ้งเตือน Webex
            try {
                const document = await prisma.document.findFirst({
                    where: {
                        id: status.documentId
                    }
                })

                const owner = await prisma.user.findFirst({
                    where: {
                        id: document?.userId
                    }
                })

                const {items: people} = await getWebexPeople(owner?.name || "")
                if(people.length > 0 && people[0].displayName == session.pea.name){
                    const text = `เอกสารเลขที่ ${document?.docNo}/${document?.year} ${document?.name} จำนวนเงิน ${document?.amount} บาท ดำเนินการเสร็จสิ้น`
                    await sendWebexMessage({
                        personalId: people[0].id,
                        text: text})
                }
            }
            catch(e){
                console.log(e)
            }
        }
        await prisma.$disconnect()
        return {
            err: false,
            message: "success"
        }
        
    }catch(e){
        return {
            err: true,
            message: "เกิดข้อผิดพลาดจาก server"
        }
    }
}

export async function deleteStatus(statusId:string) {
    const session = await getServerSession(authOptions)
    if(!session || !session.pea){
        redirect ("/user/in")
    }

    if(!['admin','checker'].includes(session.pea.role)){
        return {
            err: true,
            message: "คุณไม่มีสิทธิ์ในการเปลี่ยนแปลงสถานะเอกสาร"
        }
    }
    const findStatus = await prisma.status.findFirst({
        where: {
            id: statusId
        }
    })
    if(!findStatus || findStatus.name == "รอเอกสารต้นฉบับ"){
        return {
            err: true,
            message: "ไม่สามารถลบสถานะ 'รอเอกสารต้นฉบับได้' หรือหาสถานะนี้ของเอกสารนี้ไม่เจอ"
        }
    }
    const resultDelete = await prisma.status.delete({
        where: {
            id: statusId
        }
    })
    await prisma.$disconnect()
    return {
        err: false,
        message: "ลบสถานะนี้สำเร็จ"
    }
    
}