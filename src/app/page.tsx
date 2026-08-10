import { curriculumDatabase } from '@/data/curriculum'
import { AppFlow } from './components/AppFlow'
export default function Home() {
  return <AppFlow islands={curriculumDatabase.islands} initialScreen="dashboard" showScreenPicker={false} />
}
