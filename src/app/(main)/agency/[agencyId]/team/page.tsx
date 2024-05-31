import { getAgencyDetails } from '@/lib/queries/agencyQueries'
import { getTeamMembers } from '@/lib/queries/teamQueries'
import { currentUser } from '@clerk/nextjs/server'
import React from 'react'
import DataTable from './data-table'
import { Plus } from 'lucide-react'
import { columns } from './columns'
import SendInvitation from '@/components/forms/send-invitation'

type Props = {
    params:{agencyId: string}
}

const TeamPage = async ({params}: Props) => {
    const authUser = currentUser()

    const teamMembers =await  getTeamMembers(params.agencyId)
    if (!authUser) return null

    const agencyDetails = await getAgencyDetails(params.agencyId)
    if (!agencyDetails) return

  return (
    <DataTable 
    actionButtonText={
        <>
          <Plus size={15} />
          Add
        </>
    }
    modalChildren={<SendInvitation agencyId={agencyDetails.id} />}
    filterValue="name"
    columns={columns}
    data={teamMembers}
    >

    </DataTable>
  )
}

export default TeamPage