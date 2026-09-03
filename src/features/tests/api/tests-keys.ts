/** Centralized query keys for the tests feature. */
export const testsKeys = {
  all: ['tests'] as const,
  models: () => [...testsKeys.all, 'models'] as const,
  continue: () => [...testsKeys.all, 'continue'] as const,
  mine: () => [...testsKeys.all, 'mine'] as const,
}
