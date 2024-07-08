import { authOptions } from "@/auth-options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import clientpromise from "@/lib/mongo";
import { ObjectId } from "mongodb";

type TypeDocsCount = {
  waitingDocs: number;
  returnedDocs: number;
  cancelDocs: number;
  totalDocs: number;
};

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session || !session.pea) {
    redirect("/user/profile");
  }

  const typeDocsCount = await getTypeDocsCount(session.pea.id);

  return (
    <div className="flex flex-col gap-3 max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-xl font-bold text-center">
        ยินดีต้อนรับ {session.pea.name}
      </h1>

      <Link href="/user/waiting-docs" className="flex items-center p-4 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition duration-300">
        <p className="text-4xl mr-4">📥</p>
        <div>
          <div className="text-left">
            <h2 className="text-lg font-bold">รอเอกสารต้นฉบับ</h2>
            <p>จำนวน {typeDocsCount.waitingDocs} ฉบับ</p>
          </div>
        </div>
      </Link>

      <Link href="/user/returned-docs" className="flex items-center p-4 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition duration-300">
        <p className="text-4xl mr-4">📤</p>
        <div>
          <div className="text-left">
            <h2 className="text-lg font-bold">เอกสารส่งคืน/ตีกลับ</h2>
            <p>จำนวน {typeDocsCount.returnedDocs} ฉบับ</p>
          </div>
        </div>
      </Link>

      <Link href="/user/cancel-docs" className="flex items-center p-4 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition duration-300">
        <p className="text-4xl mr-4">❌</p>
        <div>
          <div className="text-left">
            <h2 className="text-lg font-bold">เอกสารถูกยกเลิก</h2>
            <p>จำนวน {typeDocsCount.cancelDocs} ฉบับ</p>
          </div>
        </div>
      </Link>

      <Link href="/user/all-docs" className="flex items-center p-4 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600 transition duration-300">
        <p className="text-4xl mr-4">📂</p>
        <div>
          <div className="text-left">
            <h2 className="text-lg font-bold">เอกสารของคุณทั้งหมด</h2>
            <p>จำนวน {typeDocsCount.totalDocs} ฉบับ</p>
          </div>
        </div>
      </Link>
    </div>
  );
}

async function getTypeDocsCount(id: string) {
  console.log(id);
  try {
    const mongoClient = await clientpromise;
    await mongoClient.connect();
    const typeDocsCount = (await mongoClient
      .db("nmo")
      .collection("Status")
      .aggregate([
        {
          $group: {
            _id: "$documentId",
            name: {
              $last: "$name",
            },
            date: {
              $last: "$date",
            },
            updatedByUserId: {
              $last: "$updatedByUserId",
            },
          },
        },
        {
          $lookup: {
            from: "Document",
            localField: "_id",
            foreignField: "_id",
            as: "result",
          },
        },
        {
          $unwind: {
            path: "$result",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $match: {
            "result.userId": new ObjectId(id),
          },
        },
        {
          $facet: {
            waitingDocs: [
              {
                $match: {
                  name: "รอเอกสารต้นฉบับ",
                },
              },
              {
                $set: {
                  count: 1,
                },
              },
            ],
            returnedDocs: [
              {
                $match: {
                  name: "เอกสารส่งคืน/ตีกลับ",
                },
              },
              {
                $set: {
                  count: 1,
                },
              },
            ],
            cancelDocs: [
              {
                $match: {
                  name: "ยกเลิก",
                },
              },
              {
                $set: {
                  count: 1,
                },
              },
            ],
            totalDocs: [
              {
                $set: {
                  count: 1,
                },
              },
            ],
          },
        },
        {
          $project: {
            waitingDocs: {
              $cond: {
                if: {
                  $eq: [
                    {
                      $size: "$waitingDocs",
                    },
                    0,
                  ],
                },
                then: 0,
                else: {
                  $sum: "$waitingDocs.count",
                },
              },
            },
            returnedDocs: {
              $cond: {
                if: {
                  $eq: [
                    {
                      $size: "$returnedDocs",
                    },
                    0,
                  ],
                },
                then: 0,
                else: {
                  $sum: "$returnedDocs.count",
                },
              },
            },
            cancelDocs: {
              $cond: {
                if: {
                  $eq: [
                    {
                      $size: "$cancelDocs",
                    },
                    0,
                  ],
                },
                then: 0,
                else: {
                  $sum: "$cancelDocs.count",
                },
              },
            },
            totalDocs: {
              $cond: {
                if: {
                  $eq: [
                    {
                      $size: "$totalDocs",
                    },
                    0,
                  ],
                },
                then: 0,
                else: {
                  $sum: "$totalDocs.count",
                },
              },
            },
          },
        },
      ])
      .toArray()) as unknown as TypeDocsCount[];
    await mongoClient.close();
    if (typeDocsCount.length == 0) {
      return {
        waitingDocs: 0,
        returnedDocs: 0,
        cancelDocs: 0,
        totalDocs: 0,
      };
    }
    return typeDocsCount[0];
  } catch (e) {
    console.log(e);
    return {
      waitingDocs: 0,
      returnedDocs: 0,
      cancelDocs: 0,
      totalDocs: 0,
    };
  }
}
