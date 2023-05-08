import assert from 'assert'
import schemaRetriever from 'openapi-schema-retriever'
import generator from 'random-string-builder'
import securityRetriever from '../src'
import { getOperations, getPaths } from './utils'
import * as schemas from './specs/objects'

context('securityRetriever returns error when', () => {
    context('schema', () => {
        it('is not provided', () => {
            // Setup
            const expected = new Error('schema is not provided')
            // Exercise and verify
            assert.throws(() => securityRetriever(), expected)
        })
        it('is not an object', () => {
            // Setup
            const schema = [true, 0, ''][Math.floor(Math.random() * 3)]
            const expected = new Error('schema must be an object')
            // Exercise and verify
            assert.throws(() => securityRetriever(schema), expected)
        })
    })
    context('path', () => {
        it('is not provided', () => {
            // Setup
            const expected = new Error('path is not provided')
            // Exercise and verify
            assert.throws(() => securityRetriever({}), expected)
        })
        it('is not an string', () => {
            // Setup
            const path = [{}, 0, true][Math.floor(Math.random() * 3)]
            const expected = new Error('path must be a string')
            // Exercise and verify
            assert.throws(() => securityRetriever({}, path), expected)
        })
    })
    context('operation', () => {
        it('is not provided', () => {
            // Setup
            const expected = new Error('operation is not provided')
            // Exercise and verify
            assert.throws(() => securityRetriever({}, 'fff'), expected)
        })
        it('is not an string', () => {
            // Setup
            const operation = 'jdjjd'
            const expected = new Error('operation must be a string with value \'get\', \'put\', \'post\', \'delete\', \'head\', \'options\', \'patch\' or \'trace\'')
            // Exercise and verify
            assert.throws(() => securityRetriever({}, 'path', operation), expected)
        })
    })
})

for (let i = 1; i <= 7; i++) {
    context(`Given the specification #${i}`, () => {
        context('retrieved as js object', async () => {
            // Setup
            const schema = await schemaRetriever(schemas[`schema${i}`])
            const paths = getPaths(schema)
            context('when path not exists', () => {
                it('returns null', () => {
                    // Setup
                    const _path = (() => {
                        let result: string
                        do {
                            result = generator()
                        }
                        while (paths.includes(result))
                        return result
                    })()
                    const _operation = ['get', 'put', 'post', 'delete', 'head', 'options', 'patch', 'trace'][Math.floor(Math.random() * 8)]
                    const expected = null
                    // Exercise
                    const actual = securityRetriever(schema, _path, _operation)
                    // Verify
                    assert.strictEqual(actual, expected)
                })
            })
            context('when operation not exists', () => {
                it('returns null', () => {
                    // Setup
                    const _path = paths[Math.floor(Math.random() * paths.length)]
                    const _operation = (() => {
                        let result: string
                        do {
                            result = ['get', 'put', 'post', 'delete', 'head', 'options', 'patch', 'trace'][Math.floor(Math.random() * 8)]
                        }
                        while (getOperations(schema, _path).includes(result))
                        return result
                    })()
                    const expected = null
                    // Exercise
                    const actual = securityRetriever(schema, _path, _operation)
                    // Verify
                    assert.strictEqual(actual, expected)
                })
            })
            paths.forEach(path => {
                // Setup
                const operations = getOperations(schema, path)
                operations.forEach(operation => {
                    context(`for path '${path}' and operation '${operation}'`, () => {
                        // Exercise
                        const security = securityRetriever(schema, path, operation)
                            describe('securityRetriever returns', () => {
                                it('an object', () => {
                                    // Setup 
                                    const expected = 'object'
                                    // Exercise
                                    const actual = typeof security
                                    // Verify
                                    assert.strictEqual(actual, expected)
                                })
                                it('with properties \'secured\', \'optional\' and \'securities\'', () => {
                                    // Setup
                                    const expected = ['secured', 'optional', 'securities']
                                    // Exercise
                                    const actual = Object.keys(security)
                                    // Verify
                                    assert.deepStrictEqual(actual, expected)
                                })
                                it('\'secured\' being a boolean', () => {
                                    // Setup 
                                    const expected = 'boolean'
                                    // Exercise
                                    const actual = typeof security.secured
                                    // Verify
                                    assert.strictEqual(actual, expected)
                                })
                                it('\'optionnal\' being a boolean', () => {
                                    // Setup 
                                    const expected = 'boolean'
                                    // Exercise
                                    const actual = typeof security.optional
                                    // Verify
                                    assert.strictEqual(actual, expected)
                                })
                                it('\'securities\' being a array', () => {
                                    // Setup 
                                    const expected = true
                                    // Exercise
                                    const actual = Array.isArray(security.securities)
                                    // Verify
                                    assert.strictEqual(actual, expected)
                                })
                                context('if \'securities\' is an empty array', () => {
                                    if (security.securities.length === 0) {
                                        it('\'secured\' equals false', () => {
                                            // Setup 
                                            const expected = false
                                            // Exercise
                                            const actual = security.secured
                                            // Verify
                                            assert.strictEqual(actual, expected)
                                        })
                                    }
                                })
                                context('if \'securities\' contains an empty object', () => {
                                    if (security.securities.some(item => Object.keys(item).length === 0)) {
                                        it('\'optional\' equals true', () => {
                                            // Setup 
                                            const expected = true
                                            // Exercise
                                            const actual = security.optional
                                            // Verify
                                            assert.strictEqual(actual, expected)
                                        })
                                    }
                                })
                                context('if \'securities\' contains no empty object', () => {
                                    if (security.securities.every(item => Object.keys(item).length > 0)) {
                                        it('\'optional\' equals false', () => {
                                            // Setup 
                                            const expected = false
                                            // Exercise
                                            const actual = security.optional
                                            // Verify
                                            assert.strictEqual(actual, expected)
                                        })
                                    }
                                })
                                context('if \'securities\' is not an empty array', () => {
                                    if (security.securities.length > 0) {
                                        it('\'securities\' contains only object...', () => {
                                            // Setup 
                                            const expected = true
                                            // Exercise
                                            const actual = security.securities.every(item => typeof item === 'object')
                                            // Verify
                                            assert.strictEqual(actual, expected)
                                        })
                                        it('... whose all values have a \'type\' key', () => {
                                            // Setup 
                                            const expected = true
                                            // Exercise
                                            const actual = security.securities.every(item => Object.keys(item).every(key => Object.keys(item[key]).includes('type')))
                                            // Verify
                                            assert.strictEqual(actual, expected)
                                        })
                                        it('... whose \'type\' key has value \'apiKey\', \'http\', \'oauth2\', \'mutualTLS\' and \'openIdConnect\'', () => {
                                            // Setup 
                                            const expected = true
                                            // Exercise
                                            const actual = security.securities.every(item => Object.keys(item).every(key => ['apiKey', 'http', 'oauth2', 'mutualTLS', 'openIdConnect'].includes(item[key]['type'])))
                                            // Verify
                                            assert.strictEqual(actual, expected)
                                        })
                                    }
                                })
                            })
                    })
                })
            })
        })
        context('as json file', async () => {
            // Setup
            const schema = await schemaRetriever(`./specs/json/openapi${i}.json`, __dirname)
            const paths = getPaths(schema)
            context('when path not exists', () => {
                it('returns null', () => {
                    // Setup
                    const _path = (() => {
                        let result: string
                        do {
                            result = generator()
                        }
                        while (paths.includes(result))
                        return result
                    })()
                    const _operation = ['get', 'put', 'post', 'delete', 'head', 'options', 'patch', 'trace'][Math.floor(Math.random() * 8)]
                    const expected = null
                    // Exercise
                    const actual = securityRetriever(schema, _path, _operation)
                    // Verify
                    assert.strictEqual(actual, expected)
                })
            })
            context('when operation not exists', () => {
                it('returns null', () => {
                    // Setup
                    const _path = paths[Math.floor(Math.random() * paths.length)]
                    const _operation = (() => {
                        let result: string
                        do {
                            result = ['get', 'put', 'post', 'delete', 'head', 'options', 'patch', 'trace'][Math.floor(Math.random() * 8)]
                        }
                        while (getOperations(schema, _path).includes(result))
                        return result
                    })()
                    const expected = null
                    // Exercise
                    const actual = securityRetriever(schema, _path, _operation)
                    // Verify
                    assert.strictEqual(actual, expected)
                })
            })
            paths.forEach(path => {
                // Setup
                const operations = getOperations(schema, path)
                operations.forEach(operation => {
                    context(`for path '${path}' and operation '${operation}'`, () => {
                        // Exercise
                        const security = securityRetriever(schema, path, operation)
                            describe('securityRetriever returns', () => {
                                it('an object', () => {
                                    // Setup 
                                    const expected = 'object'
                                    // Exercise
                                    const actual = typeof security
                                    // Verify
                                    assert.strictEqual(actual, expected)
                                })
                                it('with properties \'secured\', \'optional\' and \'securities\'', () => {
                                    // Setup
                                    const expected = ['secured', 'optional', 'securities']
                                    // Exercise
                                    const actual = Object.keys(security)
                                    // Verify
                                    assert.deepStrictEqual(actual, expected)
                                })
                                it('\'secured\' being a boolean', () => {
                                    // Setup 
                                    const expected = 'boolean'
                                    // Exercise
                                    const actual = typeof security.secured
                                    // Verify
                                    assert.strictEqual(actual, expected)
                                })
                                it('\'optionnal\' being a boolean', () => {
                                    // Setup 
                                    const expected = 'boolean'
                                    // Exercise
                                    const actual = typeof security.optional
                                    // Verify
                                    assert.strictEqual(actual, expected)
                                })
                                it('\'securities\' being a array', () => {
                                    // Setup 
                                    const expected = true
                                    // Exercise
                                    const actual = Array.isArray(security.securities)
                                    // Verify
                                    assert.strictEqual(actual, expected)
                                })
                                context('if \'securities\' is an empty array', () => {
                                    if (security.securities.length === 0) {
                                        it('\'secured\' equals false', () => {
                                            // Setup 
                                            const expected = false
                                            // Exercise
                                            const actual = security.secured
                                            // Verify
                                            assert.strictEqual(actual, expected)
                                        })
                                    }
                                })
                                context('if \'securities\' contains an empty object', () => {
                                    if (security.securities.some(item => Object.keys(item).length === 0)) {
                                        it('\'optional\' equals true', () => {
                                            // Setup 
                                            const expected = true
                                            // Exercise
                                            const actual = security.optional
                                            // Verify
                                            assert.strictEqual(actual, expected)
                                        })
                                    }
                                })
                                context('if \'securities\' contains no empty object', () => {
                                    if (security.securities.every(item => Object.keys(item).length > 0)) {
                                        it('\'optional\' equals false', () => {
                                            // Setup 
                                            const expected = false
                                            // Exercise
                                            const actual = security.optional
                                            // Verify
                                            assert.strictEqual(actual, expected)
                                        })
                                    }
                                })
                                context('if \'securities\' is not an empty array', () => {
                                    if (security.securities.length > 0) {
                                        it('\'securities\' contains only object...', () => {
                                            // Setup 
                                            const expected = true
                                            // Exercise
                                            const actual = security.securities.every(item => typeof item === 'object')
                                            // Verify
                                            assert.strictEqual(actual, expected)
                                        })
                                        it('... whose all values have a \'type\' key', () => {
                                            // Setup 
                                            const expected = true
                                            // Exercise
                                            const actual = security.securities.every(item => Object.keys(item).every(key => Object.keys(item[key]).includes('type')))
                                            // Verify
                                            assert.strictEqual(actual, expected)
                                        })
                                        it('... whose \'type\' key has value \'apiKey\', \'http\', \'oauth2\', \'mutualTLS\' and \'openIdConnect\'', () => {
                                            // Setup 
                                            const expected = true
                                            // Exercise
                                            const actual = security.securities.every(item => Object.keys(item).every(key => ['apiKey', 'http', 'oauth2', 'mutualTLS', 'openIdConnect'].includes(item[key]['type'])))
                                            // Verify
                                            assert.strictEqual(actual, expected)
                                        })
                                    }
                                })
                            })
                    })
                })
            })
        })
        context('as yaml file', async () => {
            // Setup
            const schema = await schemaRetriever(`./specs/yaml/openapi${i}.yaml`, __dirname)
            const paths = getPaths(schema)
            context('when path not exists', () => {
                it('returns null', () => {
                    // Setup
                    const _path = (() => {
                        let result: string
                        do {
                            result = generator()
                        }
                        while (paths.includes(result))
                        return result
                    })()
                    const _operation = ['get', 'put', 'post', 'delete', 'head', 'options', 'patch', 'trace'][Math.floor(Math.random() * 8)]
                    const expected = null
                    // Exercise
                    const actual = securityRetriever(schema, _path, _operation)
                    // Verify
                    assert.strictEqual(actual, expected)
                })
            })
            context('when operation not exists', () => {
                it('returns null', () => {
                    // Setup
                    const _path = paths[Math.floor(Math.random() * paths.length)]
                    const _operation = (() => {
                        let result: string
                        do {
                            result = ['get', 'put', 'post', 'delete', 'head', 'options', 'patch', 'trace'][Math.floor(Math.random() * 8)]
                        }
                        while (getOperations(schema, _path).includes(result))
                        return result
                    })()
                    const expected = null
                    // Exercise
                    const actual = securityRetriever(schema, _path, _operation)
                    // Verify
                    assert.strictEqual(actual, expected)
                })
            })
            paths.forEach(path => {
                // Setup
                const operations = getOperations(schema, path)
                operations.forEach(operation => {
                    context(`for path '${path}' and operation '${operation}'`, () => {
                        // Exercise
                        const security = securityRetriever(schema, path, operation)
                            describe('securityRetriever returns', () => {
                                it('an object', () => {
                                    // Setup 
                                    const expected = 'object'
                                    // Exercise
                                    const actual = typeof security
                                    // Verify
                                    assert.strictEqual(actual, expected)
                                })
                                it('with properties \'secured\', \'optional\' and \'securities\'', () => {
                                    // Setup
                                    const expected = ['secured', 'optional', 'securities']
                                    // Exercise
                                    const actual = Object.keys(security)
                                    // Verify
                                    assert.deepStrictEqual(actual, expected)
                                })
                                it('\'secured\' being a boolean', () => {
                                    // Setup 
                                    const expected = 'boolean'
                                    // Exercise
                                    const actual = typeof security.secured
                                    // Verify
                                    assert.strictEqual(actual, expected)
                                })
                                it('\'optionnal\' being a boolean', () => {
                                    // Setup 
                                    const expected = 'boolean'
                                    // Exercise
                                    const actual = typeof security.optional
                                    // Verify
                                    assert.strictEqual(actual, expected)
                                })
                                it('\'securities\' being a array', () => {
                                    // Setup 
                                    const expected = true
                                    // Exercise
                                    const actual = Array.isArray(security.securities)
                                    // Verify
                                    assert.strictEqual(actual, expected)
                                })
                                context('if \'securities\' is an empty array', () => {
                                    if (security.securities.length === 0) {
                                        it('\'secured\' equals false', () => {
                                            // Setup 
                                            const expected = false
                                            // Exercise
                                            const actual = security.secured
                                            // Verify
                                            assert.strictEqual(actual, expected)
                                        })
                                    }
                                })
                                context('if \'securities\' contains an empty object', () => {
                                    if (security.securities.some(item => Object.keys(item).length === 0)) {
                                        it('\'optional\' equals true', () => {
                                            // Setup 
                                            const expected = true
                                            // Exercise
                                            const actual = security.optional
                                            // Verify
                                            assert.strictEqual(actual, expected)
                                        })
                                    }
                                })
                                context('if \'securities\' contains no empty object', () => {
                                    if (security.securities.every(item => Object.keys(item).length > 0)) {
                                        it('\'optional\' equals false', () => {
                                            // Setup 
                                            const expected = false
                                            // Exercise
                                            const actual = security.optional
                                            // Verify
                                            assert.strictEqual(actual, expected)
                                        })
                                    }
                                })
                                context('if \'securities\' is not an empty array', () => {
                                    if (security.securities.length > 0) {
                                        it('\'securities\' contains only object...', () => {
                                            // Setup 
                                            const expected = true
                                            // Exercise
                                            const actual = security.securities.every(item => typeof item === 'object')
                                            // Verify
                                            assert.strictEqual(actual, expected)
                                        })
                                        it('... whose all values have a \'type\' key', () => {
                                            // Setup 
                                            const expected = true
                                            // Exercise
                                            const actual = security.securities.every(item => Object.keys(item).every(key => Object.keys(item[key]).includes('type')))
                                            // Verify
                                            assert.strictEqual(actual, expected)
                                        })
                                        it('... whose \'type\' key has value \'apiKey\', \'http\', \'oauth2\', \'mutualTLS\' and \'openIdConnect\'', () => {
                                            // Setup 
                                            const expected = true
                                            // Exercise
                                            const actual = security.securities.every(item => Object.keys(item).every(key => ['apiKey', 'http', 'oauth2', 'mutualTLS', 'openIdConnect'].includes(item[key]['type'])))
                                            // Verify
                                            assert.strictEqual(actual, expected)
                                        })
                                    }
                                })
                            })
                    })
                })
            })
        })
    })
}