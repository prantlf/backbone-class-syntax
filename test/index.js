import { ok, strictEqual } from 'node:assert'
import tehanu from 'tehanu'
import { parse } from 'meriyah'
import { generate } from 'astring'
import { updateClassDeclarations } from 'properties-to-prototype'
import { backbonePrototypeProperties, classifyBackboneClass } from '../lib/index.js'

const test = tehanu(import.meta.filename)

test('moves property by prototype properties only', () => {
  const input = `
@propertiesToPrototype('model')
class Test {
  defaults = {}
}
`
  const program = parse(input, { next: true })
  const { updated } = updateClassDeclarations(program, {
    prototypeProperties: backbonePrototypeProperties,
    ensureConstructorName: false
  })
  ok(updated)
  const actual = generate(program)
  const expected = `
class Test {}
Object.assign(Test.prototype, {
  defaults: {}
});
`
  strictEqual(actual.trim(), expected.trim())
})

test('does not move property by class classification function with unnamed default import', () => {
  const input = `
import 'backbone'
class Test extends Backbone.Model {
  defaults = {}
}
`
  const program = parse(input, { sourceType: 'module', next: true })
  const { updated } = updateClassDeclarations(program, {
    prototypeProperties: backbonePrototypeProperties,
    classifyClass: classifyBackboneClass,
    ensureConstructorName: false
  })
  ok(!updated)
  var actual = generate(program)
  const expected = `
import "backbone";
class Test extends Backbone.Model {
  defaults = {};
}
`
  strictEqual(actual.trim(), expected.trim())
})

test('does not move property by class classification function with missing named import', () => {
  const input = `
import 'backbone'
class Test extends Model {
  defaults = {}
}
`
  const program = parse(input, { sourceType: 'module', next: true })
  const { updated } = updateClassDeclarations(program, {
    prototypeProperties: backbonePrototypeProperties,
    classifyClass: classifyBackboneClass,
    ensureConstructorName: false
  })
  ok(!updated)
  var actual = generate(program)
  const expected = `
import "backbone";
class Test extends Model {
  defaults = {};
}
`
  strictEqual(actual.trim(), expected.trim())
})

test('does not move property by class classification function with unused default import', () => {
  const input = `
import Backbone from 'backbone'
class Test extends Model {
  defaults = {}
}
`
  const program = parse(input, { sourceType: 'module', next: true })
  const { updated } = updateClassDeclarations(program, {
    prototypeProperties: backbonePrototypeProperties,
    classifyClass: classifyBackboneClass,
    ensureConstructorName: false
  })
  ok(!updated)
  var actual = generate(program)
  const expected = `
import Backbone from "backbone";
class Test extends Model {
  defaults = {};
}
`
  strictEqual(actual.trim(), expected.trim())
})

test('does not move property by class classification function with unused named import', () => {
  const input = `
import { View } from 'backbone'
class Test extends Model {
  defaults = {}
}
`
  const program = parse(input, { sourceType: 'module', next: true })
  const { updated } = updateClassDeclarations(program, {
    prototypeProperties: backbonePrototypeProperties,
    classifyClass: classifyBackboneClass,
    ensureConstructorName: false
  })
  ok(!updated)
  var actual = generate(program)
  const expected = `
import {View} from "backbone";
class Test extends Model {
  defaults = {};
}
`
  strictEqual(actual.trim(), expected.trim())
})

test('does not move property by class classification function with identifier and unknown import source', () => {
  const input = `
import { Model } from 'spine'
class Test extends Model {
  defaults = {}
}
`
  const program = parse(input, { sourceType: 'module', next: true })
  const { updated } = updateClassDeclarations(program, {
    prototypeProperties: backbonePrototypeProperties,
    classifyClass: classifyBackboneClass,
    ensureConstructorName: false
  })
  ok(!updated)
  var actual = generate(program)
  const expected = `
import {Model} from "spine";
class Test extends Model {
  defaults = {};
}
`
  strictEqual(actual.trim(), expected.trim())
})

test('does not move property by class classification function with member expression and unknown import source', () => {
  const input = `
import Backbone from 'spine'
class Test extends Backbone.Model {
  defaults = {}
}
`
  const program = parse(input, { sourceType: 'module', next: true })
  const { updated } = updateClassDeclarations(program, {
    prototypeProperties: backbonePrototypeProperties,
    classifyClass: classifyBackboneClass,
    ensureConstructorName: false
  })
  ok(!updated)
  var actual = generate(program)
  const expected = `
import Backbone from "spine";
class Test extends Backbone.Model {
  defaults = {};
}
`
  strictEqual(actual.trim(), expected.trim())
})

test('moves property by class classification function with default import', () => {
  const input = `
import Backbone from 'backbone'
class Test extends Backbone.Model {
  defaults = {}
}
`
  const program = parse(input, { sourceType: 'module', next: true })
  const { updated } = updateClassDeclarations(program, {
    prototypeProperties: backbonePrototypeProperties,
    classifyClass: classifyBackboneClass,
    ensureConstructorName: false
  })
  ok(updated)
  var actual = generate(program)
  const expected = `
import Backbone from "backbone";
class Test extends Backbone.Model {}
Object.assign(Test.prototype, {
  defaults: {}
});
`
  strictEqual(actual.trim(), expected.trim())
})

test('moves property by class classification function with aliased default import', () => {
  const input = `
import * as Backbone from 'backbone'
class Test extends Backbone.Model {
  defaults = {}
}
`
  const program = parse(input, { sourceType: 'module', next: true })
  const { updated } = updateClassDeclarations(program, {
    prototypeProperties: backbonePrototypeProperties,
    classifyClass: classifyBackboneClass,
    ensureConstructorName: false
  })
  ok(updated)
  var actual = generate(program)
  const expected = `
import * as Backbone from "backbone";
class Test extends Backbone.Model {}
Object.assign(Test.prototype, {
  defaults: {}
});
`
  strictEqual(actual.trim(), expected.trim())
})

test('moves property by class classification function with named import', () => {
  const input = `
import { Model } from 'backbone'
class Test extends Model {
  defaults = {}
}
`
  const program = parse(input, { sourceType: 'module', next: true })
  const { updated } = updateClassDeclarations(program, {
    prototypeProperties: backbonePrototypeProperties,
    classifyClass: classifyBackboneClass,
    ensureConstructorName: false
  })
  ok(updated)
  var actual = generate(program)
  const expected = `
import {Model} from "backbone";
class Test extends Model {}
Object.assign(Test.prototype, {
  defaults: {}
});
`
  strictEqual(actual.trim(), expected.trim())
})

test('moves property by class classification function with custom import source', () => {
  const input = `
import { Model } from 'spine'
class Test extends Model {
  defaults = {}
}
`
  const program = parse(input, { sourceType: 'module', next: true })
  const { updated } = updateClassDeclarations(program, {
    prototypeProperties: backbonePrototypeProperties,
    classifyClass: ast => classifyBackboneClass(ast, {
      backboneSources: ['spine']
    }),
    ensureConstructorName: false
  })
  ok(updated)
  var actual = generate(program)
  const expected = `
import {Model} from "spine";
class Test extends Model {}
Object.assign(Test.prototype, {
  defaults: {}
});
`
  strictEqual(actual.trim(), expected.trim())
})

test('moves property by class classification function with custom named import', () => {
  const input = `
import { Vertebra } from 'backbone'
class Test extends Vertebra {
  defaults = {}
}
`
  const program = parse(input, { sourceType: 'module', next: true })
  const { updated } = updateClassDeclarations(program, {
    prototypeProperties: backbonePrototypeProperties,
    classifyClass: ast => classifyBackboneClass(ast, {
      backboneClassTypes: {
        Vertebra: 'model'
      }
    }),
    ensureConstructorName: false
  })
  ok(updated)
  var actual = generate(program)
  const expected = `
import {Vertebra} from "backbone";
class Test extends Vertebra {}
Object.assign(Test.prototype, {
  defaults: {}
});
`
  strictEqual(actual.trim(), expected.trim())
})
