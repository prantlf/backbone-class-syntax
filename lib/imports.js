function isAnonymousImport(importNode) {
  // import "some"
  return importNode.specifiers.length === 0
}

function isImportDefault(importNode) {
  // import some from "some"
  return importNode.specifiers.length === 1 &&
    importNode.specifiers[0].type === 'ImportDefaultSpecifier'
}

function isImportAllAs(importNode) {
  // import * as some from "some"
  return importNode.specifiers.length === 1 &&
    importNode.specifiers[0].type !== 'ImportDefaultSpecifier' &&
    !importNode.specifiers[0].imported
}

function isBackboneSource(node, backboneSources) {
  const { source } = node
  if (source.type === 'Literal') {
    const { value } = source
    return backboneSources.includes(value)
  }
}

export function isBackboneDefaultImport(name, programScope, backboneSources) {
  const { body } = programScope
  for (const node of body) {
    if (node.type === 'ImportDeclaration') {
      if (!isBackboneSource(node, backboneSources)) continue
      // import "some"
      if (isAnonymousImport(node)) {
      }
      // import some from "some"
      // import * as some from "some"
      else if (isImportDefault(node) || isImportAllAs(node)) {
        const { local } = node.specifiers[0]
        if (local.type === 'Identifier' && local.name === name) {
          return true
        }
      }
    }
  }
}

export function getBackboneNamedImport(name, programScope, backboneSources) {
  const { body } = programScope
  for (const node of body) {
    if (node.type === 'ImportDeclaration') {
      if (!isBackboneSource(node, backboneSources)) continue
      // import "some"
      if (isAnonymousImport(node)) {
      }
      // import some from "some"
      // import * as some from "some"
      else if (isImportDefault(node) || isImportAllAs(node)) {
      }
      // import { x, y, z } from "xyz"
      else {
        const specifiers = node.specifiers.map(({ imported, local }) => ({ imported, local }))
        for (const specifier of specifiers) {
          const { imported, local } = specifier
          /* c8 ignore next */
          if (imported.type !== 'Identifier' || local.type !== 'Identifier') continue
          if (local.name === name) {
            return imported.name
          }
        }
      }
    }
  }
}
