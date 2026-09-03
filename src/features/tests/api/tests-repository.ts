import type { TestModel } from '@/api-types'
import { api } from '@/lib/api-client'

/** Contract `useTestModels` depends on (DIP). */
export type TestsRepository = {
  models: () => Promise<TestModel[]>
}

export const testsRepository: TestsRepository = {
  models: () => api.get<TestModel[]>('/test-models'),
}
