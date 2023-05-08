import { HttpMethod, OpenAPI } from '../src/parser/types'
import * as errors from '../src/parser/errors'

export const getPaths = (schema: OpenAPI): Array<string> => {
    if (!schema) throw errors.SchemaNotProvided
    const paths = schema.paths
    if (!paths) throw errors.NoPathInSchema
    return Object.keys(paths)
}

export const getOperations = (schema: OpenAPI, path: string): Array<HttpMethod> => {
    if (!schema) throw errors.SchemaNotProvided
    if (!path) throw errors.PathNotProvided
    const operations: Array<HttpMethod> = []
    if (!schema.paths) throw errors.NoPathInSchema
    const pathItem = schema.paths[path]
    if (!pathItem) return operations
    for (const key in pathItem) {
        if (['get', 'put', 'post', 'delete', 'head', 'options', 'patch', 'trace'].includes(key.toLowerCase())) operations.push(key.toLowerCase() as HttpMethod)
    }
    return operations
}