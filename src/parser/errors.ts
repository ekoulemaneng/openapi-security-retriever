export const SchemaNotProvided = new Error('schema is not provided')

export const PathNotProvided = new Error('path is not provided')

export const OperationNotProvided = new Error('operation is not provided')

export const NoPathInSchema = new Error('there is no path in the schema')

export const SchemaContainsNotPath = new Error('schema doesn\'t contains this path')

export const PathContainsNotOperation = new Error('path doesn\'t contains this operation')

export const SecurityRequirementNotProvided = new Error('security requirement is not provided')

export const NoComponentsFound = new Error('no components field is found in the schema')

export const NoSecuritySchemesFound = new Error('no security schemes field is found in the components field')

export const FlowsNotProvided = new Error('flows are not provided')