import DocumentTable from "@/app/component/docs-table";
import { authOptions } from "@/auth-options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import SearchDocs from "./search-form";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session || !session.pea) {
    redirect("/user/in");
  }

  
  return (
    <div className="flex flex-col gap-3">
      <h1>เอกสารของคุณทั้งหมด</h1>
      <SearchDocs session={session} />      
    </div>
  );
}
