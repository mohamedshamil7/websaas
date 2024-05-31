"use server"

import { db } from "../db"
import { CreateMediaType } from "../types"

export const getMedia = async (subaccountId: string) => {
    const mediafiles = await db.subAccount.findUnique({
      where: {
        id: subaccountId,
      },
      include: { Media: true },
    })
    return mediafiles
  }

  export const createMedia = async (
    subaccountId: string,
    mediaFile: CreateMediaType
  ) => {
    const response = await db.media.create({
      data: {
        link: mediaFile.link,
        name: mediaFile.name,
        subAccountId: subaccountId,
      },
    })
  
    return response
  }

  export const deleteMedia = async (mediaId: string) => {
    const response = await db.media.delete({
      where: {
        id: mediaId,
      },
    })
    return response
  }