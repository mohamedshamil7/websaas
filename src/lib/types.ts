import { Notification, Prisma, Role } from "@prisma/client"

export type NotificationWithUser =
  | ({
      User: {
        id: string
        name: string
        avatarUrl: string
        email: string
        createdAt: Date
        updatedAt: Date
        role: Role
        agencyId: string | null
      }
    } & Notification)[]
  | undefined

//   export type TicketDetails = Prisma.PromiseReturnType<
//   typeof _getTicketsWithAllRelations
// >