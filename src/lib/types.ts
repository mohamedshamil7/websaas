import { Contact, Lane, Notification, Prisma, Role, Tag, Ticket, User } from "@prisma/client"
import { __getUsersWithAgencySubAccountPermissionsSidebarOptions, getAuthUserDetails, getUserPermissions } from "./queries/userQueries"
import { getMedia } from "./queries/mediaQueries"
import { z } from "zod"
import { getPipelineDetails } from "./queries/pipelineQueries"
import { _getTicketsWithAllRelations, getTicketsWithTags } from "./queries/ticketQueries"

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

  export type UserWithPermissionsAndSubAccounts = Prisma.PromiseReturnType<
  typeof getUserPermissions
>

export type AuthUserWithAgencySigebarOptionsSubAccounts =
  Prisma.PromiseReturnType<typeof getAuthUserDetails>




  export type UsersWithAgencySubAccountPermissionsSidebarOptions =
  Prisma.PromiseReturnType<
    typeof __getUsersWithAgencySubAccountPermissionsSidebarOptions
  >

  export type GetMediaFiles = Prisma.PromiseReturnType<typeof getMedia>

  export type CreateMediaType = Prisma.MediaCreateWithoutSubaccountInput

  export type TicketAndTags = Ticket & {
    Tags: Tag[]
    Assigned: User | null
    Customer: Contact | null
  }
  

  export type LaneDetail = Lane & {
    Tickets: TicketAndTags[]
  }

  export const CreatePipelineFormSchema = z.object({
    name: z.string().min(1),
  })

  export const LaneFormSchema = z.object({
    name: z.string().min(1),
  })

  export type PipelineDetailsWithLanesCardsTagsTickets = Prisma.PromiseReturnType<
  typeof getPipelineDetails
>

export type TicketWithTags = Prisma.PromiseReturnType<typeof getTicketsWithTags>

const currencyNumberRegex = /^\d+(\.\d{1,2})?$/

export const TicketFormSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  value: z.string().refine((value) => currencyNumberRegex.test(value), {
    message: 'Value must be a valid price.',
  }),
})

export type TicketDetails = Prisma.PromiseReturnType<
  typeof _getTicketsWithAllRelations
>

// export type PricesList = Stripe.ApiList<Stripe.Price>
