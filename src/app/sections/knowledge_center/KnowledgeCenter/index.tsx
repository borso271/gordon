
/* -------- mock folder → items mapping -------- */
import { knowledgeTopics } from "../knowledge_data";
import KnowledgeFolderList from "./components/KnowledgeFolderList";
import SidebarLayout from "../../../../components/Layout/SidebarLayout";
const KnowledgeBrowser: React.FC = () => {
  return (
  <SidebarLayout>
  <KnowledgeFolderList folders={knowledgeTopics} />
  </SidebarLayout>
  )
};

export default KnowledgeBrowser;

