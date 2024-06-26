"use server"

import { clerkClient, currentUser } from "@clerk/nextjs/server"
import { db } from "../db"
import { redirect } from "next/navigation"
import { Role, User } from "@prisma/client"
import { saveActivityLogsNotification } from "./logQueries"

export const getAuthUserDetails = async ()=>{
    const user = await currentUser()
    if(!user) return

    const userData = await db.user.findUnique({
        where:{email:user.emailAddresses[0].emailAddress},
        include:{
            Agency:{
                include:{
                    SidebarOption: true,
                    SubAccount:{
                        include:{
                            SidebarOption: true
                        }
                    }
                }
            },
            Permissions: true
        }
    })

    return userData
}


export const createTeamUser = async (agencyId: string, user: User) => {
    if (user.role === 'AGENCY_OWNER') return null
    const response = await db.user.create({ data: { ...user } })
    return response
  }


export const verifyAndAcceptInvitation = async () => {
    const user = await currentUser()
    if (!user) return redirect('/sign-in')
    
    const invitationExists = await db.invitation.findUnique({
      where: {
        email: user.emailAddresses[0].emailAddress,
        status: 'PENDING',
      },
    })
  
    if (invitationExists) {
      const userDetails = await createTeamUser(invitationExists.agencyId, {
        email: invitationExists.email,
        agencyId: invitationExists.agencyId,
        avatarUrl: user.imageUrl,
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        role: invitationExists.role,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      await saveActivityLogsNotification({
        agencyId: invitationExists?.agencyId,
        description: `Joined`,
        subaccountId: undefined,
      })
  
      if (userDetails) {
        await clerkClient.users.updateUserMetadata(user.id, {
          privateMetadata: {
            role: userDetails.role || 'SUBACCOUNT_USER',
          },
        })
  
        await db.invitation.delete({
          where: { email: userDetails.email },
        })
  
        return userDetails.agencyId
      } else return null
    } else {
      const agency = await db.user.findUnique({
        where: {
          email: user.emailAddresses[0].emailAddress,
        },
      })
      return agency ? agency.agencyId : null
    }
  }


  export const initUser = async (newUser: Partial<User>) => {
    const user = await currentUser()
    if (!user) return
  
    const userData = await db.user.upsert({
      where: {
        email: user.emailAddresses[0].emailAddress,
      },
      update: newUser,
      create: {
        id: user.id,
        avatarUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
        name: `${user.firstName} ${user.lastName}`,
        role: newUser.role || 'SUBACCOUNT_USER',
      },
    })
  
    await clerkClient.users.updateUserMetadata(user.id, {
      privateMetadata: {
        role: newUser.role || 'SUBACCOUNT_USER',
      },
    })
  
    return userData
  }
  

  export const getUserPermissions = async (userId: string) => {
    const response = await db.user.findUnique({
      where: { id: userId },
      select: { Permissions: { include: { SubAccount: true } } },
    })
  
    return response
  }

  export const changeUserPermissions = async (
    permissionId: string | undefined,
    userEmail: string,
    subAccountId: string,
    permission: boolean
  ) => {
    try {
      const response = await db.permissions.upsert({
        where: { id: permissionId },
        update: { access: permission },
        create: {
          access: permission,
          email: userEmail,
          subAccountId: subAccountId,
        },
      })
      return response
    } catch (error) {
      console.log('🔴Could not change persmission', error)
    }
  }


  export const updateUser = async (user: Partial<User>) => {
    const response = await db.user.update({
      where: { email: user.email },
      data: { ...user },
    })
  
    await clerkClient.users.updateUserMetadata(response.id, {
      privateMetadata: {
        role: user.role || 'SUBACCOUNT_USER',
      },
    })
  
    return response
  }

  export const deleteUser = async (userId: string) => {
    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: {
        role: undefined,
      },
    })
    const deletedUser = await db.user.delete({ where: { id: userId } })
  
    return deletedUser
  }
  
  export const getUser = async (id: string) => {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    })
  
    return user
  }


  export const __getUsersWithAgencySubAccountPermissionsSidebarOptions = async (
    agencyId: string
  ) => {
    return await db.user.findFirst({
      where: { Agency: { id: agencyId } },
      include: {
        Agency: { include: { SubAccount: true } },
        Permissions: { include: { SubAccount: true } },
      },
    })
  }


  export const sendInvitation = async (
    role: Role,
    email: string,
    agencyId: string
  ) => {
    const resposne = await db.invitation.create({
      data: { email, agencyId, role },
    })
  
    try {
      const invitation = await clerkClient.invitations.createInvitation({
        emailAddress: email,
        redirectUrl: process.env.NEXT_PUBLIC_URL,
        publicMetadata: {
          throughInvitation: true,
          role,
        },
      })
    } catch (error) {
      console.log(error)
      throw error
    }
  
    return resposne
  }


  