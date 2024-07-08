import DocumentTable from "@/app/component/docs-table";
import { authOptions } from "@/auth-options";
import { getDocsWithLatestStatusAndUserId } from "@/lib/mongo-get-docs";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Page() {
    const session = await getServerSession(authOptions)
    if(!session || !session.pea){
        redirect("/user/profile")
    }
    const documentsWithStatus = await getDocsWithLatestStatusAndUserId("ยกเลิก",session.pea.id)
    return(
        <div className="flex flex-col gap-3">
            <h1>เอกสารถูกยกเลิก</h1>
            <h4>จำนวน {documentsWithStatus.length} ฉบับ</h4>
            <DocumentTable session={session} documentsWithStatus={documentsWithStatus}/>
        </div>
    )    
}

