import * as errors from "./errors";
import { GetAuthorizationCodeFlow, GetClientCredentialsFlow, GetFlowScopes, GetImplicitFlow, GetOperationSecurity, GetPasswordFlow, GetRootSecurity, OperationSecurity, Securities, SecurityScheme, SetOperationSecurity, SetSecurity } from "./types";

export const getRootSecurity: GetRootSecurity = (schema) => {
    if (!schema) throw errors.SchemaNotProvided
    const security = schema.security
    if (!security) return []
    return security
}

export const getOperationSecurity: GetOperationSecurity = (schema, path, method) => {
    if (!schema) throw errors.SchemaNotProvided
    if (!path) throw errors.PathNotProvided
    if (!method) throw errors.OperationNotProvided
    const paths = schema.paths
    if (!paths) throw errors.NoPathInSchema
    const pathItem = paths[path]
    if (!pathItem) throw errors.SchemaContainsNotPath
    const operation = pathItem[method]
    if (!operation) throw errors.PathContainsNotOperation
    const rootSecurity = getRootSecurity(schema)
    const operationSecurity = operation.security
    if (!operationSecurity) return rootSecurity
    return operationSecurity
}

export const getImplicitFlow: GetImplicitFlow = (flows) => {
    if (!flows) throw errors.FlowsNotProvided
    const flow = flows.implicit
    if (!flow) return undefined
    const authorizationUrl = flow.authorizationUrl
    if (!authorizationUrl) return undefined
    const refreshUrl = flow.refreshUrl
    const _scopes = flow.scopes
    if (!_scopes) return undefined
    const scopes = Object.keys(_scopes)
    return { authorizationUrl, refreshUrl, scopes }
}

export const getPasswordFlow: GetPasswordFlow = (flows) => {
    if (!flows) throw errors.FlowsNotProvided
    const flow = flows.password
    if (!flow) return undefined
    const tokenUrl = flow.tokenUrl
    if (!tokenUrl) return undefined
    const refreshUrl = flow.refreshUrl
    const _scopes = flow.scopes
    if (!_scopes) return undefined
    const scopes = Object.keys(_scopes)
    return { tokenUrl, refreshUrl, scopes }
}

export const getClientCredentialsFlow: GetClientCredentialsFlow = (flows) => {
    if (!flows) throw errors.FlowsNotProvided
    const flow = flows.clientCredentials
    if (!flow) return undefined
    const tokenUrl = flow.tokenUrl
    if (!tokenUrl) return undefined
    const refreshUrl = flow.refreshUrl
    const _scopes = flow.scopes
    if (!_scopes) return undefined
    const scopes = Object.keys(_scopes)
    return { tokenUrl, refreshUrl, scopes }
}

export const getAuthorizationCodeFlow: GetAuthorizationCodeFlow = (flows) => {
    if (!flows) throw errors.FlowsNotProvided
    const flow = flows.authorizationCode
    if (!flow) return undefined
    const authorizationUrl = flow.authorizationUrl
    if (!authorizationUrl) return undefined
    const tokenUrl = flow.tokenUrl
    if (!tokenUrl) return undefined
    const refreshUrl = flow.refreshUrl
    const _scopes = flow.scopes
    if (!_scopes) return undefined
    const scopes = Object.keys(_scopes)
    return { authorizationUrl, tokenUrl, refreshUrl, scopes }
}

export const getFlowScopes: GetFlowScopes = (flows) => {
    if (!flows) throw errors.FlowsNotProvided
    const implicit = getImplicitFlow(flows)
    if (typeof implicit !== 'undefined') return implicit.scopes
    const password = getPasswordFlow(flows)
    if (typeof password !== 'undefined') return password.scopes
    const clientCredentials = getClientCredentialsFlow(flows)
    if (typeof clientCredentials !== 'undefined') return clientCredentials.scopes
    const authorizationCode = getAuthorizationCodeFlow(flows)
    if (typeof authorizationCode !== 'undefined') return authorizationCode.scopes
    return []
}

export const setSecurity: SetSecurity = (schema, requirement) => {
    if (!schema) throw errors.SchemaNotProvided
    if (!requirement) throw errors.SecurityRequirementNotProvided
    const components = schema.components
    if (!components) throw errors.NoComponentsFound
    const securitySchemes = components.securitySchemes
    if (!securitySchemes) throw errors.NoSecuritySchemesFound
    const securities: Securities = {}
    for (const name in requirement) {
        if (!name) continue
        let scopes = requirement[name]
        if (!scopes) scopes = []
        const securityScheme = securitySchemes[name] as SecurityScheme
        if (!securityScheme) continue
        if (securityScheme.type === 'apiKey') {
            if (!securityScheme.name) continue
            if (!securityScheme.in) continue
            securities[name] = {
                type: 'apiKey',
                name: securityScheme.name,
                in: securityScheme.in,
                scopes
            }
        }
        else if (securityScheme.type === 'http') {
            if (!securityScheme.scheme) continue
            securities[name] = {
                type: 'http',
                scheme: securityScheme.scheme,
                bearerFormat: securityScheme.bearerFormat,
                scopes
            }
        }
        else if (securityScheme.type === 'mutualTLS') securities[name] = { type: 'mutualTLS', scopes: requirement[name] ?? [] }
        else if (securityScheme.type === 'oauth2') {
            if (!securityScheme.flows) continue
            securities[name] = {
                type: 'oauth2',
                flows: {
                    implicit: getImplicitFlow(securityScheme.flows),
                    password: getPasswordFlow(securityScheme.flows),
                    clientCredentials: getClientCredentialsFlow(securityScheme.flows),
                    authorizationCode: getAuthorizationCodeFlow(securityScheme.flows)
                },
                scopes: (() => {
                    const flows = securityScheme.flows
                    if (!flows) return scopes
                    return scopes.filter(item => getFlowScopes(flows).includes(item))}
                )() 
            }
        }
        else if (securityScheme.type === 'openIdConnect') {
            if (!securityScheme.openIdConnectUrl) continue
            securities[name] = {
                type: 'openIdConnect',
                openIdConnectUrl: securityScheme.openIdConnectUrl,
                scopes
            }
        }
    }
    return securities
}

export const setOperationSecurity: SetOperationSecurity = (schema, path, method) => {
    if (!schema) throw errors.SchemaNotProvided
    if (!path) throw errors.PathNotProvided
    if (!method) throw errors.OperationNotProvided
    const security: OperationSecurity = {
        secured: false,
        optional: false,
        securities: []
    }
    const operationSecurity = getOperationSecurity(schema, path, method)
    if (operationSecurity.length > 0 && operationSecurity.some(item => Object.keys(item).length > 0)) security.secured = true
    if (operationSecurity.some(item => Object.keys(item).length === 0)) security.optional = true
    security.securities = operationSecurity.filter(item => Object.keys(item).length > 0).map (item => setSecurity(schema, item))
    return security
}
