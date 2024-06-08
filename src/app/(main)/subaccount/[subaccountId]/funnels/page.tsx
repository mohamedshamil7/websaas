
import React from 'react'
import { Plus } from 'lucide-react'
import FunnelForm from '@/components/forms/funnel-form'
import { getFunnels } from '@/lib/queries/funnelqueries'
import { columns } from './columns'
import BlurPage from '@/components/global/blurpage'
import FunnelsDataTable from './data-table'

const Funnels = async ({ params }: { params: { subaccountId: string } }) => {
  const funnels = await getFunnels(params.subaccountId)
  if (!funnels) return null

  return (
    <BlurPage>
      <FunnelsDataTable
        actionButtonText={
          <>
            <Plus size={15} />
            Create Funnel
          </>
        }
        modalChildren={
          <FunnelForm subAccountId={params.subaccountId}></FunnelForm>
        }
        filterValue="name"
        columns={columns}
        data={funnels}
      />
    </BlurPage>
  )
}

export default Funnels