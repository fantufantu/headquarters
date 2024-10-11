import { Loading, Table } from 'musae'
import { useState } from 'react'
import { queryIssues } from '../../api/issue'
import type { CosObject } from 'cos-js-sdk-v5'
import { useColumns } from './hooks'
import { useBoolean, useMounted } from '@aiszlab/relax'

const Issues = () => {
  const [issues, setIssues] = useState<CosObject[]>([])
  const columns = useColumns()
  const [isLoading, { turnOn, turnOff }] = useBoolean()

  useMounted(async () => {
    turnOn()
    const _issues = await queryIssues().catch(() => null)
    setIssues(_issues ?? [])
    turnOff()
  })

  return (
    <Loading loading={isLoading}>
      <Table bordered columns={columns} dataSource={issues} />
    </Loading>
  )
}

export default Issues
