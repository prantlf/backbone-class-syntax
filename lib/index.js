import { isBackboneDefaultImport, getBackboneNamedImport } from './imports.js'

const defaultBackboneSources = ['backbone', 'marionette']

const defaultBackboneClassTypes = {
  Model: 'model',
  Collection: 'collection',
  Router: 'router',
  View: 'view',
  ItemView: 'view',
  CollectionView: 'view',
  CompositeView: 'view',
  LayoutView: 'view',
  Behavior: 'behavior',
  Controller: 'controller',
  Object: 'controller',
  Application:'application'
}

export const backbonePrototypeProperties = {
  model: [
    'cidPrefix', 'defaults', 'idAttribute', 'url', 'urlRoot'
  ],
  collection: [
    'cidPrefix', 'model', 'comparator'
  ],
  view: [
    'cidPrefix', 'options', 'tagName', 'className', 'attributes', 'template',
    'el', 'ui', 'regions', 'behaviors', 'templateContext', 'templateHelpers',
    'events', 'modelEvents', 'collectionEvents', 'triggers',
    'childViewContainer', 'childView', 'childViewOptions',
    'childViewEventPrefix', 'childViewEvents', 'childViewTriggers',
    'emptyView', 'emptyViewOptions',
    'viewComparator', 'sortWithCollection', 'reorderOnSort', 'viewFilter'
  ],
  behavior: [
    'options', 'behaviors', 'ui', 'childViewEvents', 'childViewTriggers',
    'events', 'modelEvents', 'collectionEvents', 'triggers'
  ],
  router: [
    'routes', 'appRoutes', 'controller'
  ],
  controller: [
    'cidPrefix', 'options', 'channelName', 'radioEvents', 'radioRequests'
  ],
  application: [
    'cidPrefix', 'region', 'regionClass'
  ]
}

export const backboneClassTypes = {
  model: [
    /Model$/
  ],
  collection: [
    /Collection$/
  ],
  view: [
    /View$/
  ],
  behavior: [
    /Behavior$/
  ],
  router: [
    /Router$/
  ],
  controller: [
    /Controller$/, /Object$/
  ],
  application: [
    /Application$/
  ]
}

export const backboneClassTypesBySuffixes = {
  model: [
    'Model'
  ],
  collection: [
    'Collection'
  ],
  view: [
    'View'
  ],
  behavior: [
    'Behavior'
  ],
  router: [
    'Router'
  ],
  controller: [
    'Controller', 'Object'
  ],
  application: [
    'Application'
  ]
}

function getClassNameFromImportedMemberExpression(superClass, programScope, backboneSources) {
  const { object, property } = superClass
  if (object.type === 'Identifier' && property.type === 'Identifier') {
    const { name } = object
    if (isBackboneDefaultImport(name, programScope, backboneSources)) {
      return property.name
    }
  }
}

function getClassNameFromImportedIdentifier(superClass, programScope, backboneSources) {
  const { name } = superClass
  const importedName = getBackboneNamedImport(name, programScope, backboneSources)
  return importedName
}

export function classifyBackboneClass(ast, options = {}) {
  const { classDeclaration, programScope } = ast;
  const {
    backboneSources = defaultBackboneSources,
    backboneClassTypes = defaultBackboneClassTypes
  } = options
  const { superClass } = classDeclaration
  let classType
  if (superClass) {
    const { type } = superClass
    let className
    if (type === 'Identifier') {
      className = getClassNameFromImportedIdentifier(superClass, programScope, backboneSources)
    } else if (type === 'MemberExpression') {
      className = getClassNameFromImportedMemberExpression(superClass, programScope, backboneSources)
    }
    classType = backboneClassTypes[className]
  }
  return { classType }
}
