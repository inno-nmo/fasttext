import Link from "next/link";

export default function Loading(){
    return (
        <div className="flex flex-col gap-3 max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-xl font-bold text-center">
        ยินดีต้อนรับ
      </h1>

      <Link href="/user/waiting-docs" className="flex items-center p-4 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition duration-300">
        <p className="text-4xl mr-4">📥</p>
        <Link href="/user/waiting-docs">
          <div className="text-left">
            <h2 className="text-lg font-bold">รอเอกสารต้นฉบับ</h2>
            <p>จำนวน {'  '} ฉบับ</p>
          </div>
        </Link>
      </Link>

      <Link href="/user/returned-docs" className="flex items-center p-4 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition duration-300">
        <p className="text-4xl mr-4">📤</p>
        <Link href="/user/returned-docs">
          <div className="text-left">
            <h2 className="text-lg font-bold">เอกสารส่งคืน/แก้ไข</h2>
            <p>จำนวน {'  '} ฉบับ</p>
          </div>
        </Link>
      </Link>

      <Link href="/user/cancel-docs" className="flex items-center p-4 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition duration-300">
        <p className="text-4xl mr-4">❌</p>
        <Link href="/user/cancel-docs">
          <div className="text-left">
            <h2 className="text-lg font-bold">เอกสารถูกยกเลิก</h2>
            <p>จำนวน {'  '} ฉบับ</p>
          </div>
        </Link>
      </Link>

      <Link href="/user/all-docs" className="flex items-center p-4 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600 transition duration-300">
        <p className="text-4xl mr-4">📂</p>
        <Link href="/user/all-docs">
          <div className="text-left">
            <h2 className="text-lg font-bold">เอกสารของคุณทั้งหมด</h2>
            <p>จำนวน {'  '} ฉบับ</p>
          </div>
        </Link>
      </Link>
    </div>
    )
}