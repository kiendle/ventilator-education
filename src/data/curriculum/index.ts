import { gameMetadata, globalConflicts } from './game'
import { mediaAssets, sources } from './generated-data'
import { lakeMucosaIsland } from './islands/lake-mucosa'
import { interlobarDividesIsland } from './islands/interlobar-divides'
import { valleyOfPulmonaraIsland } from './islands/valley-of-pulmonara'
import { bronchialBluffsIsland } from './islands/bronchial-bluffs'
import { mountPneumonoraIsland } from './islands/mount-pneumonora'
import { alveolarHighlandsIsland } from './islands/alveolar-highlands'
import { validateCurriculumDatabase } from './validate'
import type { CurriculumActivity, CurriculumDatabase, CurriculumIsland } from './types'

export * from './types'
export { gradeActivity, gradeQuizQuestion } from './grade'

const islands: CurriculumIsland[] = [
  lakeMucosaIsland,
  interlobarDividesIsland,
  valleyOfPulmonaraIsland,
  bronchialBluffsIsland,
  mountPneumonoraIsland,
  alveolarHighlandsIsland,
]

export const curriculumDatabase: CurriculumDatabase = {
  metadata: gameMetadata,
  islands,
  sources,
  mediaAssets,
  conflicts: globalConflicts,
}

export const curriculumValidationErrors = validateCurriculumDatabase(curriculumDatabase)

export function getIsland(id: string): CurriculumIsland {
  const island = curriculumDatabase.islands.find((candidate) => candidate.id === id)
  if (!island) throw new Error(`Unknown island: ${id}`)
  return island
}

export function getActivity(activityId: string): CurriculumActivity {
  for (const island of curriculumDatabase.islands) {
    const activity = island.activities.find((candidate) => candidate.activityId === activityId)
    if (activity) return activity
  }
  throw new Error(`Unknown activity: ${activityId}`)
}
