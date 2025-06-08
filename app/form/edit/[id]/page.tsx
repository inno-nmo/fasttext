import { authOptions } from "@/auth-options"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import FormDocument from "./form"

export default async function Page({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)
    if(!session || !session.pea){
        redirect("/user/in")
    }

    const doc = await prisma.document.findFirst({
        where :{
            id: params.id
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
    if(!doc || doc.status.length == 0 || doc.status[0].name != "เอกสารส่งคืน/แก้ไข" || doc.user.id != session.pea.id ){
        redirect("/")
    }
    return(
        <div>
            แก้ไขเอกสาร
            <FormDocument doc={doc} />
        </div>
    )
}