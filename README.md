# OpenAPI Security Retriever

Typescript package to retrieve security mechanism information from an operation and in compliance with an OpenApi specification. For 3.1.x and 3.0.x OpenAPI versions.

## Installation
```typescript
npm install openapi-security-retriever 
```
or
```typescript
yarn add openapi-security-retriever
```

## Usage
```typescript
import securityRetriever from 'openapi-security-retriever'
import schemaRetriever from 'openapi-schema-retriever'

let schema

const main = async () => {

    /* First, by schemaRetriever, get, check and parse the openapi specification that can be an object or an file path string.
     * If the specification input is a file path string, a second argument standing for the current working directory is mandatory.
     * We recommend to use '__dirname' as second argument.
     * The file must be either a json, a yaml or a yml file. 
     * specBuilder returns an object in accordance with OpenAPI scpecification.
    */
    const schema = await schemaRetriever('./openapi.yaml', __dirname)

    /*
     * securityRetriever takes 3 mandatory arguments: an OpenAPI specification object, a string as a schema path, and a string as a http request method.
    */
    const security = securityRetriever(schema, '/products', 'get')

    console.log(security) // => { secured: true, optional: false, securities: [ JwtOauth: { type: 'http', scheme: 'bearer', scopes: ['admin'] } ] }
}

main()
```

## Output structure

The output of the module, once called, is an object whose the structure is:
```typescript
{
    secured: boolean, // indicates whether the operation requires authentication
    optional: boolean, // indicates whether authentication is optional or mandatory
    securities: [Object] // gives list of security mechanisms
}
```
The above-mentioned Object is structured as follows:
```typescript
{
    {name}: {
                type: 'apiKey',
                name: string,
                in: string,
                scopes: [string]
            } | {
                type: 'http',
                scheme: string,
                bearerFormat?: string,
                scopes: [string]
            } | {
                type: 'oauth2',
                flows: {
                        implicit: {
                                    authorizationUrl: string,
                                    refreshUrl?: string,
                                    scopes: [string]
                                  },
                        password: {
                                    tokenUrl: string,
                                    refreshUrl?: string,
                                    scopes: [string]
                                  },
                        clientCredentials: {
                                    tokenUrl: string,
                                    refreshUrl?: string,
                                    scopes: [string]
                                  },
                        authorizationCode: {
                                    authorizationUrl: string,
                                    tokenUrl: string,
                                    refreshUrl?: string,
                                    scopes: [string]
                                  }
                       },
                scopes: [string]
            } | {
                type: 'openIdConnect',
                openIdConnectUrl: securityScheme.openIdConnectUrl,
                scopes: [string]
            }
}
```

## License
This package is licensed under the [MIT License](https://opensource.org/licenses/mit).

## Contact
If you have any questions or issues, please contact the package maintainer at ekoulemaneng@gmail.com.
