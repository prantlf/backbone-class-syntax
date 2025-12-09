# backbone-class-syntax

Helps moving well-known properties from classes inherited from Backbone and Marionette classes to object prototypes.

Works together with JavaScript AST processor hooks in [requirejs-esm] and [requirejs-esm-preprocessor] via [properties-to-prototype], for example.

## Synopsis

Move the well-known properties from class instances descended from `Backbone.Model` to the class prototype and preserve the class name after minification:

```js
import { Model } from 'backbone'

class User extends Model {
  defaults: {
    name: 'unnamed'
  }
}
```

The result:

```js
import { Model } from 'backbone'

class User extends Model {}

Object.assign(Class.prototype, {
  defaults: {
    name: 'unnamed'
  }
})

Object.defineProperty(Class.prototype.constructor, 'name', {
  value: 'User'
})
```

## Installation

This module can be installed using a `NPM` package manager:

```sh
npm i backbone-class-syntax
```

## API

Call `updateClassDeclarations` with `backbonePrototypeProperties` and `classifyBackboneClass` to update an AST of a script:

```js
import { readFile } from 'node:fs/promises'
import { parse } from 'meriyah'
import { generate } from 'astring'
import { updateClassDeclarations } from 'properties-to-prototype'
import { backbonePrototypeProperties, classifyBackboneClass } from 'backbone-class-syntax'

const input = await readFile('index.js', 'utf8')
const program = parse(input, { sourceType: 'module', next: true })
const { updated } = updateClassDeclarations(program, {
  prototypeProperties: backbonePrototypeProperties,
  classifyClass: classifyBackboneClass
})
if (updated) {
  const output = generate(program)
}
```

### classifyBackboneClass

```ts
classifyBackboneClass(
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
```

Default value of `backboneSources`:

```js
['backbone', 'marionette']
```

Default value of `backboneClassTypes`:

```js
{
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
  Application:'application'
}
```

### backboneClassTypes

```js
{
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
```

### backboneClassTypesBySuffixes

```js
{
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
```

### backbonePrototypeProperties

```js
{
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
```

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Lint and test your code.

## License

Copyright (c) 2025 Ferdinand Prantl

Licensed under the MIT license.

[requirejs-esm]: https://www.npmjs.com/package/requirejs-esm
[requirejs-esm-preprocessor]: https://www.npmjs.com/package/requirejs-esm-preprocessor
[properties-to-prototype]: https://www.npmjs.com/package/properties-to-prototype
