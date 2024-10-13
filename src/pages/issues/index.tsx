import { Button, Loading, Table } from 'musae'
import { useState, useCallback, useRef } from 'react'
import { queryIssues } from '../../api/issue'
import type { CosObject } from 'cos-js-sdk-v5'
import { useColumns } from './hooks'
import { useBoolean, useEvent, useMounted } from '@aiszlab/relax'
import EditableDrawer, { type EditableDrawerRef } from '../../components/issue/editable-drawer'

const Issues = () => {
  const [issues, setIssues] = useState<CosObject[]>([])
  const columns = useColumns()
  const [isLoading, { turnOn, turnOff }] = useBoolean()
  const editableDrawerRef = useRef<EditableDrawerRef>(null)

  const refetch = useEvent(async () => {
    turnOn()
    const _issues = await queryIssues().catch(() => null)
    setIssues(_issues ?? [])
    turnOff()
  })

  useMounted(async () => {
    await refetch()
  })

  const feedback = useCallback(() => {
    editableDrawerRef.current?.open()
  }, [])

  return (
    <Loading loading={isLoading} className='flex flex-col gap-4'>
      <div>
        <Button onClick={feedback}>反馈</Button>
      </div>
      <Table bordered columns={columns} dataSource={issues} />
      <EditableDrawer ref={editableDrawerRef} onSubmitted={refetch} />
    </Loading>
  )
}

export default Issues
