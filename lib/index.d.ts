export const backbonePrototypeProperties: Record<string, string[]>

export function classifyBackboneClass(
  ast: {
    classDeclaration: Record<string, unknown>,
    programScope: Record<string, unknown>
  },
  options?: {
    backboneSources?: string[],
    backboneClassTypes?: Record<string, string>
  }
): {
  classType?: string,
  prototypePropertyNames?: string[]
}
