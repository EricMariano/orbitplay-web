import { useQuery } from '@tanstack/react-query'
import { testsKeys } from './tests-keys'
import { testsRepository, type TestsRepository } from './tests-repository'

/** List reusable test models. */
export function useTestModels(repository: TestsRepository = testsRepository) {
  return useQuery({
    queryKey: testsKeys.models(),
    queryFn: () => repository.models(),
  })
}
