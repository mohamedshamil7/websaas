"use server"

import { db } from "../db"

export const getDomainContent = async (subDomainName: string) => {
    const response = await db.funnel.findUnique({
      where: {
        subDomainName,
      },
      include: { FunnelPages: true },
    })
    return response
  }
  