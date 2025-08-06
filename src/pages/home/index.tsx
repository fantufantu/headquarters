import { useQuery } from "@apollo/client";
import { ContributionCalendar } from "musae";
import { ARTICLE_CONTRIBUTIONS } from "../../api/article";
import dayjs from "dayjs";

const Home = () => {
  const { data: { articleContributions = [] } = {} } = useQuery(ARTICLE_CONTRIBUTIONS, {
    variables: {
      filter: {
        from: dayjs().startOf("days").subtract(1, "years").toDate(),
        to: dayjs().startOf("days").toDate(),
      },
    },
  });

  return (
    <div>
      <div>文章浏览量</div>
      <div>最近更新</div>
      <div>
        <ContributionCalendar
          year={2024}
          contributions={articleContributions.map((item) => ({
            contributedAt: dayjs(item.contributedAt),
            count: item.count,
          }))}
        />
      </div>

      <div>想要更多数据分析，请提交工单</div>
    </div>
  );
};

export default Home;
