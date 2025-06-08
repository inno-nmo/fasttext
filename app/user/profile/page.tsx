import { authOptions } from "@/auth-options"
import {getServerSession} from "next-auth"
import { redirect } from "next/navigation"
import Profile from "./profile"
import prisma from "@/lib/prisma"

export default async function Page(){
    const session = await getServerSession(authOptions)
    if(!session || !session.pea){
        redirect("/user/in")
    }
    const sections = await prisma.section.findMany({
        select: {
            id: true,
            name: true,
            shortName: true
        },
        where: {
            name: {
                not: "admin"
            }
        }
    })
    await prisma.$disconnect()
    return (
        <div>
            <Profile session={session} sections={sections}/>
        </div>
    )
}