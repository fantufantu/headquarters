import { Table, Pagination, Loading, Button } from 'musae'
import { useColumns } from './hooks'
import Editor, { type EditorRef } from '../../components/resume-template/editor'
import { useRef } from 'react'
import { useEvent } from '@aiszlab/relax'
import { useResumeTemplates } from '../../hooks/resume-template.hooks'
import { ResumeTemplate } from '../../api/resume-template.types'

const ResumeTemplates = () => {
  const { resumeTemplates, changePage, changeLimit, page, isLoading, limit, total, refetch } = useResumeTemplates()

  const editorRef = useRef<EditorRef>(null)

  const columns = useColumns({
    editorRef,
    onRemove: () => refetch(1)
  })

  const add = useEvent(() => {
    editorRef.current?.open()
  })

  return (
    <Loading className='flex flex-col gap-4' loading={isLoading}>
      <div>
        <Button onClick={add}>新增简历模板</Button>
      </div>

      <Table<ResumeTemplate> columns={columns} bordered dataSource={resumeTemplates} />

      <Pagination at={page} pageSize={limit} total={total} onChange={changePage} onPageSizeChange={changeLimit} />

      <Editor ref={editorRef} />
    </Loading>
  )
}

export default ResumeTemplates
