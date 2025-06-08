import { authOptions } from "@/auth-options"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import FormDocument from "./form"
import { typeMapping } from "@/lib/doctype-map"


export default async function Page({ params }: { params: { type: string } }){

    const displayType = typeMapping.get(params.type)
    if(!displayType){
        redirect("/")
    }
    
    const session = await getServerSession(authOptions)
    if(!session){
        redirect("/user/in")
    }

    // const sections = await prisma.section.findMany()
    // console.log(sections)
   
    return (
        <div>
        <FormDocument session={session} type={params.type} />
        </div>
    )
    
}