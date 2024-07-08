'use client'

import { Session } from "next-auth";
import Link from "next/link";
import { useFormStatus, useFormState } from "react-dom";
import { changePassword } from "./action";
import {useRouter} from "next/navigation"
import { RefAttributes, useEffect, useRef } from "react";
import { Section } from "@prisma/client";
import SubmitButton from "@/app/component/submit-button";

const initialState = {
    err: false,
    message: ""
}

export default function Profile({session,sections}:{session:Session,sections:Section[]}){
    const router = useRouter()
    const [passState, passAction] = useFormState(changePassword,initialState)
    const [profileState, profileAction] = useFormState(changePassword,initialState)
    const passFormRef = useRef<HTMLFormElement>(null)

    useEffect(()=>{
        if(passState.message == "success" || profileState.message == "success"){
            passFormRef.current?.reset()
            router.refresh()
        }
        
    },[passState,profileState])

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                แก้ไขข้อมูลส่วนตัว
            </h2>
            <form action={profileAction} className="space-y-4">
                <div className="form-group">    
                    <label className="block text-sm font-medium text-gray-700" htmlFor="name">ชื่อผู้ใช้</label>
                    <input className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required type="text" name="name" defaultValue={session.pea?.name}/>
                </div>
                <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="tel">หมายเลขโทรศัพท์</label>
                    <input className="mt-1 block w-full p-2 border border-gray-300 rounded-md" type="text" name="tel" defaultValue={session.pea?.tel}/>
                </div>
                <div className="form-group">
                <label  htmlFor="sectionId" className="block text-sm font-medium text-gray-700">สังกัด</label>
                <select name="sectionId" defaultValue="" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                    <option value="">โปรดเลือกแผนก</option>
                    {sections.map((val)=> (<option value={val.id} key={val.id}>{val.shortName}</option>))}
                </select>
                </div>
                {profileState.err&&<span className="block text-sm font-medium text-red-400">{profileState.message}</span>}
                {!profileState.err && profileState.message!="" &&<span className="block text-sm font-medium text-green-400">เปลี่ยนข้อมูลผู้ใช้งานสำเร็จ</span>}
                <SubmitButton/>
            </form>
            <h2 className="text-2xl font-bold mt-6 mb-6 text-center text-gray-800">
                แก้ไขรหัสผ่าน
            </h2>
            <form ref={passFormRef} action={passAction} className="space-y-4 mb-6">
                <div className="form-group"> 
                    <label className="block text-sm font-medium text-gray-700" htmlFor="oldPassword">รหัสผ่านเดิม</label>
                    <input className="mt-1 block w-full p-2 border border-gray-300 rounded-md" type="password" name="oldPassword" required/>
                </div>
                <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="newPassword">รหัสผ่านใหม่</label>
                    <input className="mt-1 block w-full p-2 border border-gray-300 rounded-md" type="password" name="newPassword" required/>
                </div>
                <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="confirmedPassword">ยืนยันรหัสผ่าน</label>
                    <input className="mt-1 block w-full p-2 border border-gray-300 rounded-md" type="password" name="confirmedPassword" required/>
                </div>
                {passState.err&&<span className="block text-sm font-medium text-red-400">{passState.message}</span>}
                {!passState.err&&passState.message!=""&&<span className="block text-sm font-medium text-green-400">เปลี่ยนรหัสผ่านสำเร็จ</span>}
                <SubmitButton/>
            </form>
            <Link className="mx-auto w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md" href={"/"}> กลับหน้าหลัก </Link>
        </div>
    )
}
