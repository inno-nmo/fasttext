import { getServerSession } from "next-auth";
import SignOut from "./out";
import { redirect } from "next/navigation";

export default async function Page(){
    const session = await getServerSession()
    if(!session){
        redirect('/user/in')
    }

    return (
        <SignOut/>
    )
}