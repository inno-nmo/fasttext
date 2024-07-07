"use client";

import { useState, useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import {
  changeUserRole,
  changeUserSuspend,
  createUser,
  resetPassword,
} from "./action";
import { $Enums, Section, User } from "@prisma/client";
import { ChangeEvent } from "react";
import { useRouter } from "next/navigation";

const initialState = {
  message: "",
};

const USERS_PER_PAGE = 12;

export default function UserManagement({
  sections,
  users,
}: {
  sections: Section[];
  users: Partial<User>[];
}) {
  const router = useRouter();
  const [addUserState, formAddUserAction] = useFormState(
    createUser,
    initialState
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.user?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleChangeRole = async (
    e: ChangeEvent<HTMLSelectElement>,
    id: string | undefined
  ) => {
    if (!id) {
      window.alert("ไม่มีข้อมูลของผู้ใช้งาน หรือข้อมูลผู้ใช้งานไม่ถูกต้อง");
      return;
    }
    const result = await changeUserRole(e.target.value as $Enums.Role, id);
    window.alert(result.message);
    if (result.err) {
      return;
    }
    router.refresh();
  };

  const handleChangeSuspend = async (id: string | undefined) => {
    if (!id) {
      window.alert("ไม่มีข้อมูลของผู้ใช้งาน หรือข้อมูลผู้ใช้งานไม่ถูกต้อง");
      return;
    }
    const result = await changeUserSuspend(id);
    window.alert(result.message);
    if (result.err) {
      return;
    }
    router.refresh();
  };

  const handleResetPassword = async (id: string | undefined) => {
    if (!id) {
      window.alert("ไม่มีข้อมูลของผู้ใช้งาน หรือข้อมูลผู้ใช้งานไม่ถูกต้อง");
      return;
    }
    const result = await resetPassword(id);
    window.alert(result.message);
    if (result.err) {
      return;
    }
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
          ระบบจัดการสิทธิ์การเข้าถึง
        </h1>

        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-150 ease-in-out"
          >
            เพิ่มผู้ใช้งาน
          </button>
          <input
            type="text"
            placeholder="ค้นหาผู้ใช้..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded-md"
          />
        </div>

        {isModalOpen && (
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold mb-4">เพิ่มผู้ใช้งาน</h2>
              <form action={formAddUserAction} className="space-y-4">
                <div>
                  <label
                    htmlFor="user"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    รหัสพนักงาน
                  </label>
                  <input
                    type="text"
                    name="user"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    ชื่อ-สกุล
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="tel"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    หมายเลขโทรศัพท์
                  </label>
                  <input
                    type="text"
                    name="tel"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="sectionId"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    แผนก
                  </label>
                  <select
                    name="sectionId"
                    defaultValue=""
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">เลือกแผนก</option>
                    {sections.map((val) => (
                      <option value={val.id} key={val.id}>
                        {val.shortName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    สิทธิ์การเข้าถึง
                  </label>
                  <select
                    name="role"
                    defaultValue="user"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="user">ผู้ใช้งานทั่วไป</option>
                    <option value="admin">Admin</option>
                    <option value="checker">ผู้ตรวจสอบเอกสาร</option>
                  </select>
                </div>
                {addUserState.message && (
                  <p className="text-red-500 text-sm">{addUserState.message}</p>
                )}
                <SubmitButton />
              </form>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-700">
            รายชื่อผู้ใช้งาน
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedUsers.map((val) => (
              <div
                key={val.id}
                className="border rounded-lg p-4 space-y-2 bg-gray-50"
              >
                <p className="font-semibold">{val.name}</p>
                <p className="text-sm text-gray-600">{val.user}</p>
                <select
                  onChange={(e) => handleChangeRole(e, val.id)}
                  defaultValue={val.role}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="user">ผู้ใช้งานทั่วไป</option>
                  <option value="admin">Admin</option>
                  <option value="manager">ผู้จัดการ หรือผู้แทน</option>
                  <option value="checker">ผู้ตรวจสอบเอกสาร</option>
                </select>
                <div className="flex justify-between items-center mt-2">
                  <button
                    onClick={() => handleChangeSuspend(val.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      val.suspend
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {val.suspend ? "Suspended" : "Active"}
                  </button>
                  <button
                    onClick={() => handleResetPassword(val.id)}
                    className="text-indigo-600 hover:text-indigo-900 text-sm"
                  >
                    รีเซ็ตรหัสผ่าน
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {/* Pagination */}
          <div className="mt-6 flex justify-center">
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
              >
                หน้าก่อนหน้า
              </button>
              <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                หน้า {currentPage} จาก {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
              >
                หน้าถัดไป
              </button>
            </nav>
          </div>
        </div>
      </div>
    </main>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full ${
        pending ? "bg-gray-300" : "bg-indigo-600 hover:bg-indigo-700"
      } text-white font-bold py-2 px-4 rounded-md transition duration-150 ease-in-out`}
    >
      {pending ? "กำลังดำเนินการ..." : "ยืนยัน"}
    </button>
  );
}
