import { useParams } from "react-router-dom";
import { GroupDetail } from "../../features/groupDetail";
import PageContainer from "../PageContainer";

function GroupDetailPage() {
  const { groupId } = useParams();
  return (
    <PageContainer>
      <GroupDetail groupId={String(groupId)} />
    </PageContainer>
  );
}

export default GroupDetailPage;
