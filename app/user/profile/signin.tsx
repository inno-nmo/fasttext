'use client'

import SubmitButton from "@/app/component/submit-button";
import { signIn } from "next-auth/react";
import { useSearchParams } from 'next/navigation'

export default function SignIn(){
    const handleSubmit = (e:FormData)=>{
        signIn('credentials', { password: e.get('p')?.toString(),username: e.get('name')?.toString() })
    }

    const error = useSearchParams().get('error')

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-2xl">
            <form action={handleSubmit} className="space-y-4">
                <div className="form-group">    
                    <label className="block text-sm font-medium text-gray-700" htmlFor="name">ชื่อผู้ใช้</label>
                    <input className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required type="text" name="name"/>
                </div>
                <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="p">p</label>
                    <input className="mt-1 block w-full p-2 border border-gray-300 rounded-md" type="text" name="p"/>
                </div>
                <p className="text-red-400">{error&&"p ผิด ไม่สามารถเข้าได้"}</p>
                <SubmitButton/>
            </form>
        </div>
    )
}