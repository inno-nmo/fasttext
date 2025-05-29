import { $Enums, Status } from "@prisma/client"
import prisma from "./prisma"
import { Document } from "@prisma/client"
export type ChangeStatus = {
    name: string
    role?: $Enums.Role
    specific?: string
}

export function getNextStatus(current:string):string[]{
    const next = nextStatusMap.get(current)
    if(!next){
        return []
    }
    return next
}

export function getNextStatusArr(current: string){
    let lists = nextStatusMap.get(current)
    if(!lists){
        return []
    }
    let listStr : string[] = []
    for (const o of lists){
        o&&listStr.push(o)
    }
    return listStr
}

// export const allStatusList : string[] = [
//     "รอเอกสารต้นฉบับ",
//     "รับเอกสารต้นฉบับ", /
//     "กำลังตรวจสอบเอกสาร", /
//     "เอกสารตรวจสอบผ่านเรียบร้อย", /
//     "เอกสารตรวจไม่ผ่าน", /
//     "กำลังดำเนินการเข้าระบบ", /
//     "ดำเนินการประมวลผลในระบบ SAP", /
//     "พบปัญหาในระบบ SAP", /
//     "ใบสำคัญจ่ายรอเสนอ หผ.", /
//     "ใบสำคัญจ่ายรอเสนอ ผจก.", /
//     "ใบสำคัญจ่ายรอเบิกจ่ายเงินสด/เช็ค",/
//     "เบิกจ่ายเสร็จสิ้น",/
//     "ยกเลิก",/
//     "เอกสารส่งคืน/ตีกลับ"/
// ]

// export const nextStatusMap = new Map([
//     ["รอเอกสารต้นฉบับ",['รับเอกสารต้นฉบับ','ยกเลิก']],
//     ["รับเอกสารต้นฉบับ",['กำลังตรวจสอบเอกสาร','ยกเลิก']],
//     ["กำลังตรวจสอบเอกสาร",['เอกสารตรวจไม่ผ่าน','เอกสารตรวจสอบผ่านเรียบร้อย','ยกเลิก']],
//     ["เอกสารตรวจไม่ผ่าน",['เอกสารส่งคืน/ตีกลับ','ยกเลิก']],
//     ["เอกสารตรวจสอบผ่านเรียบร้อย",['กำลังดำเนินการเข้าระบบ','ยกเลิก']],
//     ["กำลังดำเนินการเข้าระบบ",['ดำเนินการประมวลผลในระบบ SAP']],
//     ["ดำเนินการประมวลผลในระบบ SAP",['ใบสำคัญจ่ายรอเสนอ หผ.','พบปัญหาในระบบ SAP','ยกเลิก']],
//     ["พบปัญหาในระบบ SAP",["ใบสำคัญจ่ายรอเสนอ หผ.",'ยกเลิก']],
//     ["ใบสำคัญจ่ายรอเสนอ หผ.",['ใบสำคัญจ่ายรอเสนอ ผจก.','หผ. ตรวจสอบไม่ผ่าน','ยกเลิก']],
//     ["หผ. ตรวจสอบไม่ผ่าน",["ใบสำคัญจ่ายรอเสนอ ผจก.",'ยกเลิก']],
//     ["ใบสำคัญจ่ายรอเสนอ ผจก.",['ใบสำคัญจ่ายรอเบิกจ่ายเงินสด/เช็ค','ผจก. ตรวจสอบไม่ผ่าน','ยกเลิก']],
//     ["ผจก. ตรวจสอบไม่ผ่าน",["ใบสำคัญจ่ายรอเบิกจ่ายเงินสด/เช็ค",'ยกเลิก']],
//     ["ใบสำคัญจ่ายรอเบิกจ่ายเงินสด/เช็ค",['เบิกจ่ายเสร็จสิ้น','ยกเลิก']],
//     ["เบิกจ่ายเสร็จสิ้น",['ยกเลิก']],
// ])

export const allStatusList : string[] = [
    "รอเอกสารต้นฉบับ",
    "รับเอกสารต้นฉบับ",
    "เสร็จสิ้นรอเบิกจ่าย/รอโอนเงิน",
    "ยกเลิก",
    "เอกสารส่งคืน/แก้ไข"
]

export const nextStatusMap = new Map([
    ["รอเอกสารต้นฉบับ",['รับเอกสารต้นฉบับ','ยกเลิก']],
    ["รับเอกสารต้นฉบับ",['เสร็จสิ้นรอเบิกจ่าย/รอโอนเงิน','เอกสารส่งคืน/แก้ไข','ยกเลิก']],
    ["เสร็จสิ้นรอเบิกจ่าย/รอโอนเงิน",['ยกเลิก']],
])

// export async function setNextStatusState(document:Partial<Document> & {status: Status[], nextStatus: NextStatus[]},status:Status){
//     await prisma.nextStatus.deleteMany({
//         where: {
//           documentId: document.id
//         }
//     })
//     const nextStatusArr = getNextStatusArr(status.name)
//     for(const n of nextStatusArr){
//         if(n.role){
//           const data = {
//             name: n.name,
//             role: n.role,
//             documentId: status.documentId
//           }
//           await prisma.nextStatus.create({
//             data
//           })
//         }
//         else if(n.specific){
//           const obj = document.status.find(o => o.name == n.specific)
//           if(obj){
//             const data = {
//               name: n.name,
//               userId : obj.updatedByUserId,
//               documentId : status.documentId
//             }
//             await prisma.nextStatus.create({
//               data
//             })
//           }
//         }
//       }
// }