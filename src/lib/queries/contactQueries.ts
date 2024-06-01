"use server"

import { db } from "../db"

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