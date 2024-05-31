import { Notification, Prisma, Role } from "@prisma/client"
import { __getUsersWithAgencySubAccountPermissionsSidebarOptions, getAuthUserDetails, getUserPermissions } from "./queries/userQueries"
import { getMedia } from "./queries/mediaQueries"

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