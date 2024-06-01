"use server"

import { Prisma } from "@prisma/client"
import { db } from "../db"
import { v4 } from "uuid"

export const getFirstPipelineDetails = async(subAccountId: string)=>{
    const response = await db.pipeline.findFirst({
        where: { subAccountId: subAccountId },
      })
      return response
}

export const getPipelineDetails = async (pipelineId: string) => {
    const response = await db.pipeline.findUnique({
      where: {
        id: pipelineId,
      },
    })
    return response
  }

  export const getAllPipelines  = async (subaccountId: string)=>{
    const response = await db.pipeline.findMany({
        where: { subAccountId: subaccountId },
      })

      return response
  }


  export const getLanesWithTicketAndTags = async (pipelineId: string) => {
    const response = await db.lane.findMany({
      where: {
        pipelineId,
      },
      orderBy: { order: 'asc' },
      include: {
        Tickets: {
          orderBy: {
            order: 'asc',
          },
          include: {
            Tags: true,
            Assigned: true,
            Customer: true,
          },
        },
      },
    })
    return response
  }

  export const upsertPipeline = async (
    pipeline: Prisma.PipelineUncheckedCreateWithoutLaneInput
  ) => {
    const response = await db.pipeline.upsert({
      where: { id: pipeline.id || v4() },
      update: pipeline,
      create: pipeline,
    })
  
    return response
  }

  export const deletePipeline = async (pipelineId: string) => {
    const response = await db.pipeline.delete({
      where: { id: pipelineId },
    })
    return response
  }