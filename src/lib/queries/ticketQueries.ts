"use server"

import { v4 } from "uuid"
import { db } from "../db"
import { Prisma, Tag, Ticket } from "@prisma/client"

export const getTicketsWithTags = async (pipelineId: string) => {
    const response = await db.ticket.findMany({
      where: {
        Lane: {
          pipelineId,
        },
      },
      include: { Tags: true, Assigned: true, Customer: true },
    })
    return response
  }

  export const _getTicketsWithAllRelations = async (laneId: string) => {
    const response = await db.ticket.findMany({
      where: { laneId: laneId },
      include: {
        Assigned: true,
        Customer: true,
        Lane: true,
        Tags: true,
      },
    })
    return response
  }

  export const upsertTicket = async (
    ticket: Prisma.TicketUncheckedCreateInput,
    tags: Tag[]
  ) => {
    let order: number
    if (!ticket.order) {
      const tickets = await db.ticket.findMany({
        where: { laneId: ticket.laneId },
      })
      order = tickets.length
    } else {
      order = ticket.order
    }
  
    const response = await db.ticket.upsert({
      where: {
        id: ticket.id || v4(),
      },
      update: { ...ticket, Tags: { set: tags } },
      create: { ...ticket, Tags: { connect: tags }, order },
      include: {
        Assigned: true,
        Customer: true,
        Tags: true,
        Lane: true,
      },
    })
  
    return response
  }
  
  export const deleteTicket = async (ticketId: string) => {
    const response = await db.ticket.delete({
      where: {
        id: ticketId,
      },
    })
  
    return response
  }
  
  export const updateTicketsOrder = async (tickets: Ticket[]) => {
    try {
      const updateTrans = tickets.map((ticket) =>
        db.ticket.update({
          where: {
            id: ticket.id,
          },
          data: {
            order: ticket.order,
            laneId: ticket.laneId,
          },
        })
      )
  
      await db.$transaction(updateTrans)
      console.log('🟢 Done reordered 🟢')
    } catch (error) {
      console.log(error, '🔴 ERROR UPDATE TICKET ORDER')
    }
  }