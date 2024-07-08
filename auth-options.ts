import { PrismaClient } from "@prisma/client"
import { NextAuthOptions, Session, User } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt"
import { JWT } from "next-auth/jwt";


const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "รหัสพนักงาน", type: "text", placeholder: "เช่น: 501855" },
        password: { label: "รหัสผ่าน", type: "password", placeholder: "รหัสผ่านเริ่มต้น 87654321" }
      },
      async authorize(credentials, req) {
        if(!credentials){
          return null
        }

        if(credentials.username == "admin"){
          const findAdmin = await prisma.user.findFirst({
            where: {
              user: "admin"
            },
          })
          if(!findAdmin){
            const createAdminSection = await prisma.section.create({
              data: {
                name: "admin",
                shortName: "admin"
              }
            })
            const createAdminUser = await prisma.user.create({
              data: {
                name: "admin",
                user: "admin",
                tel: "admin",
                role: "admin",
                hashedPassword: await bcrypt.hash(process.env.NEXTAUTH_SUPERADMINPASSWORD as string, 12),
                sectionId: createAdminSection.id
              },
              select: {
                id: true,
                user: true,
                hashedPassword: true,
                name: true,
                tel: true,
                section: true,
                role: true,
                suspend: true
              },
            })
            const {id,name,user,tel,role,section} = createAdminUser
            await prisma.$disconnect()
            return {id,name,user,tel,role,section}
          }
          
        }
        const resultFindUser = await prisma.user.findUnique({
          where: {
            user: credentials.username,
          },
          select: {
            id: true,
            user: true,
            hashedPassword: true,
            name: true,
            tel: true,
            section: true,
            role: true,
            suspend: true
          },
        });

        if (!resultFindUser || !resultFindUser.hashedPassword || !resultFindUser.name || resultFindUser.suspend || !(await bcrypt.compare(credentials.password, resultFindUser.hashedPassword))) {
          await prisma.$disconnect()
          return null
        } 
        const {id,name,user,tel,role,section} = resultFindUser
        await prisma.$disconnect()
        return {id,name,user,tel,role,section}
      }
    })
  ],
  session: {
    strategy: 'jwt' as const,
  },
  pages: {
    signIn: '/user/profile',
    signOut: '/user/out'
  },
  callbacks: {
    jwt: async ({ token, user }:{token:JWT, user:User}) => {
      if (user) {
        token.pea = user
      }
      return token
    },
    session: async ({ session, token }:{session: Session,token:JWT}) => {
      if(!token.pea){
        return session
      }
      const findUser = await prisma.user.findFirst({
        where: {
          id: token.pea.id
        },
        select : {
          id: true,
          user: true,
          name: true,
          tel: true,
          section: true,
          role: true,
          suspend: true
        }
      })
      await prisma.$disconnect()
      if(!findUser || findUser.suspend){
        return session
      }
      const {id,name,user,tel,role,section} = findUser
      session.pea = {id,name,user,tel,role,section}
      return session
    }
  },
};