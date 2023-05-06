import { setOperationSecurity } from './parser'
import * as errors from './parser/errors'
import { HttpMethod, OpenAPI } from './parser/types'

const SchemaNotValid = new Error('schema must be an object')
const PathNotValid = new Error('path must be a string')
const OperationNotValid = new Error('operation must be a string with value \'get\', \'put\', \'post\', \'delete\', \'head\', \'options\', \'patch\' or \'trace\'')

/**
 * Function to retrieve security mechanism informations from an operation
 * @param schema OpenAPI specification object
 * @param path A path of the schema
 * @param operation A http request method inside the schema path
 * @returns An object like { secured: true, optional: false, securities: [ JwtOauth: { type: 'http', scheme: 'bearer', scopes: ['admin'] } ] }
 */
const getSecurity = (schema: OpenAPI, path: string, operation: HttpMethod) => {
    if (typeof schema === 'undefined') throw errors.SchemaNotProvided
    if (typeof schema !== 'object') throw SchemaNotValid
    if (typeof path === 'undefined') throw errors.PathNotProvided
    if (typeof path !== 'string') throw PathNotValid
    if (!operation) throw errors.OperationNotProvided
    if (typeof operation !== 'string') throw OperationNotValid
    operation = operation.toLowerCase() as HttpMethod
    if (!['get', 'put', 'post', 'delete', 'head', 'options', 'patch', 'trace'].includes(operation)) throw OperationNotValid
    return setOperationSecurity(schema, path, operation)
}

export = getSecurity