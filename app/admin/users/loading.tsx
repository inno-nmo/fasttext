import LoadingButton from "@/app/component/loading-button";

const paginatedUsers = [1,2,3,4,5,6]

export default function Loading(){
    return (
        <main className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
          ระบบจัดการสิทธิ์การเข้าถึง
        </h1>

        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <button
            disabled
            className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-150 ease-in-out"
          >
            เพิ่มผู้ใช้งาน
          </button>
          <input
            type="text"
            placeholder="ค้นหาผู้ใช้..."
            disabled
            className="px-4 py-2 border rounded-md"
          />
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-700">
            รายชื่อผู้ใช้งาน
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedUsers.map((val) => (
              <div
                key={val}
                className="border rounded-lg p-4 space-y-2 bg-gray-50"
              >
                <p className="font-semibold animate-pulse">-</p>
                <p className="text-sm text-gray-600 animate-pulse">-</p>
                <select
                  disabled
                  defaultValue=""
                  className="mt-1 animate-pulse block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">-</option>
                </select>
                <div className="flex justify-between items-center mt-2">
                  <button
                    disabled
                    className={`px-3 py-1 rounded-full animate-pulse text-xs font-medium bg-green-100 text-green-800`}
                  >
                    -
                  </button>
                  <button
                    disabled
                    className="text-indigo-600 hover:text-indigo-900 text-sm"
                  >
                    รีเซ็ตรหัสผ่าน
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button
                disabled
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
              >
                หน้าก่อนหน้า
              </button>
              <span className="animate-pulse relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                - 
              </span>
              <button disabled
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
              >
                หน้าถัดไป
              </button>
            </nav>
          </div>
        </div>
      </div>
    </main>
    )
}