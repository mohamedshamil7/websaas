"use server"

import { Lane, Prisma } from "@prisma/client"
import { db } from "../db"
import { v4 } from "uuid"

export const upsertLane = async (lane: Prisma.LaneUncheckedCreateInput) => {
    let order: number
  
    if (!lane.order) {
      const lanes = await db.lane.findMany({
        where: {
          pipelineId: lane.pipelineId,
        },
      })
  
      order = lanes.length
    } else {
      order = lane.order
    }
  
    const response = await db.lane.upsert({
      where: { id: lane.id || v4() },
      update: lane,
      create: { ...lane, order },
    })
  
    return response
  }

  export const deleteLane = async (laneId: string) => {
    const resposne = await db.lane.delete({ where: { id: laneId } })
    return resposne
  }
  
  export const updateLanesOrder = async (lanes: Lane[]) => {
    try {
      const updateTrans = lanes.map((lane) =>
        db.lane.update({
          where: {
            id: lane.id,
          },
          data: {
            order: lane.order,
          },
        })
      )
  
      await db.$transaction(updateTrans)
      console.log('🟢 Done reordered 🟢')
    } catch (error) {
      console.log(error, 'ERROR UPDATE LANES ORDER')
    }
  }