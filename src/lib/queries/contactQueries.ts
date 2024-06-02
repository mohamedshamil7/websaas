"use server"

import { Prisma } from "@prisma/client"
import { db } from "../db"
import { v4 } from "uuid"

export const searchContacts = async (searchTerms: string) => {
    const response = await db.contact.findMany({
      where: {
        name: {
          contains: searchTerms,
        },
      },
    })
    return response
  }

  export const upsertContact = async (
    contact: Prisma.ContactUncheckedCreateInput
  ) => {
    const response = await db.contact.upsert({
      where: { id: contact.id || v4() },
      update: contact,
      create: contact,
    })
    return response
  }