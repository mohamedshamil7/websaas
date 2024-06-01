"use server"

import { Prisma } from "@prisma/client"
import { db } from "../db"
import { v4 } from "uuid"

export const upsertTag = async (
    subaccountId: string,
    tag: Prisma.TagUncheckedCreateInput
  ) => {
    const response = await db.tag.upsert({
      where: { id: tag.id || v4(), subAccountId: subaccountId },
      update: tag,
      create: { ...tag, subAccountId: subaccountId },
    })
  
    return response
  }
  
  export const getTagsForSubaccount = async (subaccountId: string) => {
    const response = await db.subAccount.findUnique({
      where: { id: subaccountId },
      select: { Tags: true },
    })
    return response
  }
  
  export const deleteTag = async (tagId: string) => {
    const response = await db.tag.delete({ where: { id: tagId } })
    return response
  }