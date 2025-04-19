
/* -------- mock folder → items mapping -------- */
import { knowledgeTopics } from "../knowledge_data";
import KnowledgeFolderList from "./components/KnowledgeFolderList";

const KnowledgeBrowser: React.FC = () => {
  return <KnowledgeFolderList folders={knowledgeTopics} />;
};

export default KnowledgeBrowser;

