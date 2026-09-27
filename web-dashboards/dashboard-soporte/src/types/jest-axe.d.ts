import type { Assertion } from 'vitest'

declare module 'vitest' {
    interface Assertion<T = unknown> {
        toHaveNoViolations(): void
    }
    interface AsymmetricMatchersContaining {
        toHaveNoViolations(): void
    }
}

export interface AxeResults {
    violations: ReadonlyArray<{
        id: string
        impact?: string
        description: string
        nodes: ReadonlyArray<unknown>
    }>
}

export function axe(node: Element): Promise<AxeResults>
export function configureAxe(...options: unknown[]): typeof axe
// eslint-disable-next-line no-explicit-any
export const toHaveNoViolations: any
