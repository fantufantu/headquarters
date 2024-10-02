import { ContributionCalendar } from 'musae'

const Home = () => {
  return (
    <div>
      <div>文章浏览量</div>
      <div>最近更新</div>
      <div>
        <ContributionCalendar year={2024} />
      </div>

      <div>想要更多数据分析，请提交工单</div>
    </div>
  )
}

export default Home
