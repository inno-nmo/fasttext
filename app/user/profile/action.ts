"use server"

import { authOptions } from "@/auth-options"
import prisma from "@/lib/prisma"
import {getServerSession} from "next-auth"
import { redirect } from "next/navigation"
import bcrypt from "bcrypt"


export async function changeProfile(prevState: {message: string, err: boolean}, formData: FormData) {
    try{
        const name = formData.get("name")?.toString()
        const tel = formData.get("tel")?.toString()
        const sectionId = formData.get("sectionId")?.toString()
        if(!name || !tel || !sectionId){
            return {
                message: "กรุณากรอกข้อมูลให้ครบถ้วน",
                err: true
            }
        }
        const session = await getServerSession(authOptions)
        if(!session || !session.pea){
            redirect("/user/in")
        }
        const updateUser = await prisma.user.update({
            where: {
                id : session.pea.id
            },
            data: {
                name,tel,sectionId
            }
        })
        return {
            message: "success",
            err: false
        }
    }catch(e){
        return {
            message: "เกิดข้อผิดพลาดจากระบบ",
            err: true
        }
    }
}

export async function changePassword(prevState: {message: string, err: boolean}, formData: FormData) {
    try{
        const newPassword = formData.get("newPassword")?.toString()
        const oldPassword = formData.get("oldPassword")?.toString()
        const confirmedPassword = formData.get("confirmedPassword")?.toString()
        if(!newPassword || !confirmedPassword || !oldPassword || newPassword!=confirmedPassword){
            return {
                message: "ยืนยันรหัสผ่านไม่ตรงกัน",
                err: false
            }
        }

        const session = await getServerSession(authOptions)
        if(!session || !session.pea){
            redirect("/user/in")
        }
        const user = await prisma.user.findFirst({
            where: {
                id: session.pea.id
            },
            select: {
                hashedPassword: true
            }
        })

        if(!user){
            await prisma.$disconnect()
            return {
                message: "user ของคุณไม่มีในระบบ",
                err: true
            }
        }

        console.log(user.hashedPassword)

        if(!(await bcrypt.compare(oldPassword,user.hashedPassword))){
            await prisma.$disconnect()
            return {
                message: "รหัสผ่านของคุณไม่ถูกต้อง",
                err: true
            }
        }

        const updateUser = await prisma.user.update({
            where: {
                id: session.pea.id
            },
            data: {
                hashedPassword: await bcrypt.hash(newPassword, 12)
            }
        })
        return {
            message: "success",
            err: false
        }
    }catch(e){
        return {
            message: "เกิดข้อผิดพลาดจากระบบ",
            err: true
        }
    }
    
}

