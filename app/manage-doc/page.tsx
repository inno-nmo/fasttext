import { authOptions } from "@/auth-options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import SearchDocs from "./search-docs";
import { StarIcon, DocumentIcon } from "@heroicons/react/24/outline";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session || !session.pea) {
    redirect("/user/profile");
  }

  return (
    <div className="p-6 sm:p-10">
      <div className="flex items-center mb-2">
        <DocumentIcon className="h-8 w-8 text-blue-500 mr-2" />
        <h1 className="text-3xl font-bold text-gray-800">จัดการเอกสาร</h1>
      </div>
      <p className="text-gray-600 mb-8">ค้นหาและจัดการเอกสารรายบุคคล</p>

      <div className="flex items-center mb-4">
        <StarIcon className="h-6 w-6 text-gray-400 mr-2" />
        <h2 className="text-xl font-semibold text-gray-700">ค้นหาเอกสาร</h2>
      </div>
      <SearchDocs session={session} />
    </div>
  );
}
