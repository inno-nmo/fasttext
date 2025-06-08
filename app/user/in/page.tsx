import SignIn from "./signin";
import { authOptions } from "@/auth-options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function SignInPage(){
    const session = await getServerSession(authOptions)
        if(session){
            redirect("/")
        }
    return <SignIn/>
}