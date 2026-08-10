import { curriculumDatabase } from "@/data/curriculum";
import { AppFlow } from "../components/AppFlow";

export default function FlowPage() {
  return <AppFlow islands={curriculumDatabase.islands} />;
}
