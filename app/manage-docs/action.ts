"use server"

import { authOptions } from "@/auth-options"
import clientPromise from "@/lib/mongo"
import prisma from "@/lib/prisma"
import { getNextStatus } from "@/lib/status-state"
import { Status,Document } from "@prisma/client"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

type DocStatus = {
    id: string,
    name: string,
    date : Date,
    note: string
}

export type DocsWithStatus = {
    id:string,
    docNo:number,
    year:string,
    type:string,
    name:string,
    amount:number,
    note:string,
    status: DocStatus[],
    user: {
        name: string,
        user: string,
        tel: string
    },
    fromSection: {
        name: string,
        shortName: string
    }
}

async function getDocsByLatestStatus(status:string,type:string):Promise<DocsWithStatus[]>{
    const mongoClient = await clientPromise
    await mongoClient.connect()
    const docs = await mongoClient.db("nmo").collection("Status").aggregate(
        [
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
              $match: {
                name: status,
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
              $project: {
                _id: "$result._id",
                docNo: "$result.docNo",
                type: "$result.type",
                year: "$result.year",
                name: "$result.name",
                amount: "$result.amount",
                note: "$result.note",
                userId: "$result.userId",
                fromSectionId: "$result.fromSectionId",
              },
            },
            {
              $lookup: {
                from: "Status",
                localField: "_id",
                foreignField: "documentId",
                pipeline: [
                  {
                    $sort: {
                      date: -1,
                    },
                  },
                  {
                    $project: {
                      id: {
                        $toString: "$_id",
                      },
                      _id: 0,
                      name: 1,
                      date: 1,
                      note: 1,
                    },
                  },
                ],
                as: "status",
              },
            },
            {
              $lookup: {
                from: "User",
                localField: "userId",
                foreignField: "_id",
                pipeline: [
                  {
                    $project: {
                      _id: 0,
                      hashedPassword: 0,
                      sectionId: 0,
                      role: 0,
                      suspend: 0,
                    },
                  },
                ],
                as: "user",
              },
            },
            {
              $unwind: {
                path: "$user",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $lookup: {
                from: "Section",
                localField: "fromSectionId",
                foreignField: "_id",
                pipeline: [
                  {
                    $project: {
                      _id: 0,
                    },
                  },
                ],
                as: "fromSection",
              },
            },
            {
              $unwind: {
                path: "$fromSection",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                _id: 0,
                id: {
                  $toString: "$_id",
                },
                docNo: 1,
                type: 1,
                name: 1,
                amount: 1,
                note: 1,
                status: 1,
                user: 1,
                fromSection: 1,
                year:1
              },
            },
            {
              $match: {
                type: {
                  $regex: type == "all"?"":type
                }
              }
            },
            {
              $sort: {
                docNo: 1
              }
            }
          ]
    ).toArray() as unknown as DocsWithStatus[]
    await mongoClient.close()
    return docs
}

export async function searchDocsByStatus(formData:FormData):Promise<{docs : DocsWithStatus[],nextStatus:string[]}> {
    const status = formData.get("status")?.toString()
    const type = formData.get("type")?.toString()
    if(!status || !type){
        return {
          docs: [],
          nextStatus: []
        }
    }
    const docs = await getDocsByLatestStatus(status,type)
    const nextStatus = getNextStatus(status)
    return {
      docs,
      nextStatus
    }
}


export async function setNewStatus(formData:FormData):Promise<{err:boolean,message:string}>{
  
  const session = await getServerSession(authOptions)
  if(!session || !session.pea){
    redirect("/user/in")
  }

  const status = formData.get("status")?.toString()
  if(!status){
    return {
      err: true,
      message: "โปรดเลือกสถานะ"
    }
  }

  const note = formData.get("note")?.toString()
  
  const date = new Date()

  let create:(Pick<Status,"date"|"documentId"|"name"|"note"|"updatedByUserId">)[] = []
  const selectedIds = formData.getAll("ids")
  for(const id of selectedIds){
    create.push({
      date,
      note: note?note:"-",
      name: status,
      documentId: id.toString(),
      updatedByUserId: session.pea.id
    })
  }
  if(create.length==0){
    return {
      err : true,
      message: "โปรดเลือกเอกสาร"
    }
  }
  const resultCreate = await prisma.status.createMany({
    data: create
  })
  await prisma.$disconnect()
  return {
    err: false,
    message: "เปลี่ยนสถานะสำเร็จ"
  }
}