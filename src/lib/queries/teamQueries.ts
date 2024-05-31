"use server"

import { db } from "../db"

export const getTeamMembers = async(agencyId: string)=>{

   const response =  await db.user.findMany({
        where: {
            Agency: {
                id: agencyId,
            },
        },
        include: {
            Agency: { include: { SubAccount: true } },
            Permissions: { include: { SubAccount: true } },
        },
    })
    
    return response
}