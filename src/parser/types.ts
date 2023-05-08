import { OpenAPIv30x, OpenAPIv31x } from 'openapi-objects-types'

export type OpenAPI = OpenAPIv30x.OpenAPI | OpenAPIv31x.OpenAPI

export type SecurityRequirement = OpenAPIv30x.SecurityRequirement | OpenAPIv31x.SecurityRequirement

export type SecurityScheme = OpenAPIv30x.SecurityScheme | OpenAPIv31x.SecurityScheme

export type OAuthFlows = OpenAPIv30x.OAuthFlows | OpenAPIv31x.OAuthFlows

export type OAuthFlow = OpenAPIv30x.OAuthFlow | OpenAPIv31x.OAuthFlow

export type HttpMethod = 'get' | 'put' | 'post' | 'delete' | 'head' | 'options' | 'patch' | 'trace'

export type ApiKeySecurity = {
    type: Exclude<SecurityScheme['type'], 'http' | 'mutualTLS' | 'oauth2' | 'openIdConnect'>
    name: Exclude<SecurityScheme['name'], undefined>
    in: Exclude<SecurityScheme['in'], undefined>
    scopes: Array<string>
}

export type HttpSecurity = {
    type: Exclude<SecurityScheme['type'], 'apiKey' | 'mutualTLS' | 'oauth2' | 'openIdConnect'>
    scheme: Exclude<SecurityScheme['scheme'], undefined>
    bearerFormat?: Exclude<SecurityScheme['bearerFormat'], undefined>
    scopes: Array<string>
}

export type MutualTlsSecutity = {
    type: Exclude<SecurityScheme['type'], 'apiKey' | 'http' | 'oauth2' | 'openIdConnect'>
    scopes: Array<string>
}

export type ImplicitFlow = {
    authorizationUrl: Exclude<OAuthFlow['authorizationUrl'], undefined>
    refreshUrl?: Exclude<OAuthFlow['refreshUrl'], undefined>
    scopes: Array<keyof Exclude<OAuthFlow['scopes'], undefined>>
}

export type PasswordFlow = {
    tokenUrl: Exclude<OAuthFlow['tokenUrl'], undefined>
    refreshUrl?: Exclude<OAuthFlow['refreshUrl'], undefined>
    scopes: Array<keyof Exclude<OAuthFlow['scopes'], undefined>>
}

export type ClientCredentialsFlow = {
    tokenUrl: Exclude<OAuthFlow['tokenUrl'], undefined>
    refreshUrl?: Exclude<OAuthFlow['refreshUrl'], undefined>
    scopes: Array<keyof Exclude<OAuthFlow['scopes'], undefined>>
}

export type AuthorizationCodeFlow = {
    authorizationUrl: Exclude<OAuthFlow['authorizationUrl'], undefined>
    tokenUrl: Exclude<OAuthFlow['tokenUrl'], undefined>
    refreshUrl?: Exclude<OAuthFlow['refreshUrl'], undefined>
    scopes: Array<keyof Exclude<OAuthFlow['scopes'], undefined>>
}

export type OAuth2Security = {
    type: Exclude<SecurityScheme['type'], 'apiKey' | 'http' | 'mutualTLS' | 'openIdConnect'>
    flows: {
        implicit?: ImplicitFlow
        password?: PasswordFlow
        clientCredentials?: ClientCredentialsFlow
        authorizationCode?: AuthorizationCodeFlow
    }
    scopes: Array<string>
}

export type OpenIdConnectSecurity = {
    type: Exclude<SecurityScheme['type'], 'apiKey' | 'http' | 'mutualTLS' | 'oauth2'>
    openIdConnectUrl: Exclude<SecurityScheme['openIdConnectUrl'], undefined>
    scopes: Array<string>
}

export type OperationSecurity = {
    secured: boolean
    optional: boolean
    securities: Array<Record<string, ApiKeySecurity | HttpSecurity | MutualTlsSecutity | OAuth2Security | OpenIdConnectSecurity>>
}

export type Securities = Record<string, ApiKeySecurity | HttpSecurity | MutualTlsSecutity | OAuth2Security | OpenIdConnectSecurity>

export type GetRootSecurity = (schema: OpenAPI) => Array<SecurityRequirement>

export type GetOperationSecurity = (schema: OpenAPI, path: string, operation: HttpMethod) => Array<SecurityRequirement>

export type GetImplicitFlow = (flows: OAuthFlows) => ImplicitFlow | undefined

export type GetPasswordFlow = (flows: OAuthFlows) => PasswordFlow | undefined

export type GetClientCredentialsFlow = (flows: OAuthFlows) => ClientCredentialsFlow | undefined

export type GetAuthorizationCodeFlow = (flows: OAuthFlows) => AuthorizationCodeFlow | undefined

export type GetFlowScopes = (flows: OAuthFlows) => Array<string>

export type SetSecurity = (schema: OpenAPI, requirement: SecurityRequirement) => Securities

export type OperationsExits = (schema: OpenAPI, path: string, operation: HttpMethod) => boolean

export type SetOperationSecurity = (schema: OpenAPI, path: string, operation: HttpMethod) => OperationSecurity | null

