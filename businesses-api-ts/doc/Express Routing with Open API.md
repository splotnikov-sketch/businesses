# Express Routing with Open API 3.0 and Swagger UI/Editor

## Simple application

- Install express npm, and its TypeScript definitions: `npm install express @types/express`
  When we develop with TypeScript, it requires TypeScript definitions. Sometimes the definitions are delivered with a package itself. Sometimes you need to install an additional package with the definitions as we did with @types/express above. And rarely, definition don’t exist. In this case we can define them ourselves
- Create server.ts file in src/utils folder with the following content:

```ts
import express from 'express'
import { Express } from 'express-serve-static-core'

export async function createServer(): Promise<Express> {
  const server = express()
  server.get('/', (req, res) => {
    res.send('Hello world!!!')
  })
  return server
}
```

- Update src/app.ts file:

```ts
import { createServer } from './utils/server'

createServer()
  .then((server) => {
    server.listen(3000, () => {
      console.info(`Listening on http://localhost:3000`)
    })
  })
  .catch((err) => {
    console.error(`Error: ${err}`)
  })
```

- Run the server:
  `npm run dev`

## Open API 3.0 Integration

For the REST API description and for documentation purpose we will be using [Open API 3.0 format](https://swagger.io/docs/specification/basic-structure/), [Swagger Editor](https://swagger.io/tools/swagger-editor/), and [Swagger UI (Viewer)](https://swagger.io/tools/swagger-ui/).

- Create **_config_** folder in the root of the project and save **_openapi.yml_** file:

```yml
openapi: 3.0.3
info:
  title: Simple API example
  description: Simple API example API declaration
  termsOfService: http://swagger.io/terms/
  contact:
    email: splotnikov@gmail.com
  license:
    name: MIT
    url: https://opensource.org/licenses/MIT
  version: 1.0.0
externalDocs:
  description: Find out more about Swagger
  url: http://swagger.io
servers:
  - url: /api/v1

tags:
  - name: greeting
    description: Greeting APIs

paths:
  /hello:
    get:
      description: Returns 'Hello <name>/stranger!!!' to the caller
      tags:
        - greeting
      operationId: hello
      parameters:
        - name: name
          required: false
          in: query
          description: The name of a caller
          schema:
            type: string
      responses:
        200:
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/HelloResponse'
components:
  schemas:
    HelloResponse:
      type: object
      additionalProperties: false
      required:
        - message
      properties:
        message:
          type: string
```

The config defines a root path **_/api/v1_** with a single entry point **_GET /hello_** with an optional parameter **_name_** in the request query and a json response as `{ “message”: string }`.

## Swagger Editor

To edit the Open API config in Yaml format, you need an editor, which can validate your input and give a visualize your API.

Unless you often work offline, or confidentiality is your concern, you can use [online version](https://editor.swagger.io/) of the editor. We will be using a local version of the editor which are running with [docker](https://www.docker.com/), an application level virtualization container.

To run an offline version of the editor:

- Download and install the [docker](https://www.docker.com/get-started/).
- Create **_scripts_** folder in the root of the project, and **_scripts/open_swagger_editor.sh_** file in it.
- Give executable permissions to the file: `chmod +x scripts/open_swagger_editor.sh`
- Copy the following code into the file:

```sh
#!/bin/sh
#
# Give executable permissions to the file:
#    chmod +x scripts/open_swagger_editor.sh
# Usage: run from project directory: ./scripts/open_swagger_editor.sh
# Description: run docker with openapi.yml & open browser with swagger editor
# Requirements: docker
#

. $(dirname "$0")/common.sh

# run swagger-editor container with the yaml, if not running yet
# opening specific file doesn't work with editor
name='swagger-editor'
command -v docker >/dev/null 2>&1 || { echo >&2 "'docker' is not install installed. Aborting."; exit 1; }
[[ $(docker ps -f "name=$name" --format '{{.Names}}') == $name ]] ||
docker run --rm -d -p 8044:8080 --name "$name" -e SWAGGER_JSON=/config/openapi.yml -v $(PWD)/config:/config swaggerapi/swagger-editor

wait_container_to_be_running "$name" & sleep 2

# start swagger-ui in browser
start http://localhost:8044
```

- Create **_common.sh_** in the same scripts folder and copy into the file:

```sh
wait_container_to_be_running() {
match=$1
until docker ps | grep -qm 1 $match;
  do
    echo "waiting docker '$match' container to be running..."
    sleep 0.1
  done
}
```

- We can run the editor now: `./scripts/open_swagger_editor.sh`

## Swagger UI (Viewer)

- Download and install the [docker](https://www.docker.com/get-started/).
- Create **_scripts_** folder in the root of the project, and **_scripts/open_swagger_ui.sh_** file in it.
- Give executable permissions to the file: `chmod +x scripts/open_swagger_ui.sh`
- Copy the following code into the file:

```sh
#!/bin/sh
#
# Give executable permissions to the file:
#    chmod +x scripts/open_swagger_ui.sh
# Usage: run from project directory: ./scripts/open_swagger_ui.sh
# Description: run docker with openapi.yml & open browser with swagger ui
# Requirements: docker
#

. $(dirname "$0")/common.sh

# run swagger-ui container with the yaml, if not running yet
name='swagger-ui'
command -v docker >/dev/null 2>&1 || { echo >&2 "'docker' is not install installed. Aborting."; exit 1; }
[[ $(docker ps -f "name=$name" --format '{{.Names}}') == $name ]] ||
docker run --rm -d -p 8045:8080 --name "$name" -e SWAGGER_JSON=/config/openapi.yml -v $(PWD)/config:/config swaggerapi/swagger-ui

wait_container_to_be_running "$name" & sleep 2

# start swagger-ui in browser
start http://localhost:8045
```

- Run the editor: `./scripts/open_swagger_ui.sh`

## Integration with Express

We need to add **_config/openapi.yml_** file to an express server

`npm install connect express-openapi-validator swagger-routes-express validator yamljs @types/validator @types/yamljs`

Not all JavaScript packages have TypeScript declarations, and **_swagger-routes-express_** is one of them. Compiler won’t work without the declaration file. Create a folder **_types/swagger-routes-express_** in the root of the project, and file **_index.d.ts_** with this content:

```ts
//index.d.ts
declare module 'swagger-routes-express'
```

There is a property operationId with the value hello in **_GET /hello_** definition in **_openapi.yml_**. hello is a name of the function which will be called when **_GET /api/v1/hello_** request comes. We need to implement this function.

Create a folder **_src/api/controllers_** and **_greeting.ts_** file in it with the following content:

```ts
import * as express from 'express'

export function hello(req: express.Request, res: express.Response): void {
  const name = req.query.name || 'stranger'
  const message = `Hello, ${name}!`
  res.json({
    message: message,
  })
}
```

Create **_index.ts_** file in the same folder:

```javascript
export * from './greeting'
```

This file is an entry point of all the controllers.

Update **_src/utils/server.ts_** to load **_openapi.yml_**, make express to use API validator, and connect the controllers to corresponding HTTP requests:

```ts
import express from 'express'
// import {OpenApiValidator} from 'express-openapi-validator' // if version 3.*
import * as OpenApiValidator from 'express-openapi-validator'
import { Express } from 'express-serve-static-core'
import { connector, summarise } from 'swagger-routes-express'
import YAML from 'yamljs'

import * as api from '../api/controllers'

export async function createServer(): Promise<Express> {
  const yamlSpecFile = './config/openapi.yml'
  const apiDefinition = YAML.load(yamlSpecFile)
  const apiSummary = summarise(apiDefinition)
  console.info(apiSummary)

  const server = express()
  // here we can initialize body/cookies parsers, connect logger, for example morgan

  // setup API validator
  const validatorOptions = {
    coerceTypes: true,
    apiSpec: yamlSpecFile,
    validateRequests: true,
    validateResponses: true,
  }
  //   await new OpenApiValidator(validatorOptions).install(server) // if version 3.*
  server.use(OpenApiValidator.middleware(validatorOptions))

  // error customization, if request is invalid
  server.use(
    (
      err: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      res.status(err.status).json({
        error: {
          type: 'request_validation',
          message: err.message,
          errors: err.errors,
        },
      })
    }
  )

  const connect = connector(api, apiDefinition, {
    onCreateRoute: (method: string, descriptor: any[]) => {
      console.log(
        `${method}: ${descriptor[0]} : ${(descriptor[1] as any).name}`
      )
    },
  })

  connect(server)

  return server
}
```

Running the server now, will give a snapshot of the definition file, and connected routes:

```json
{
  info: {
    name: 'Backend API example',
    description: 'Backend API example API declaration',
    version: '1.0.0'
  },
  paths: { get: [ '/api/v1/hello' ] }
}
coerceTypes is deprecated.
get: /api/v1/hello : hello
Listening on http://localhost:3000
```

## Authentication with Open API 3.0

Express can easily handle which requests require authentication from **_openapi.yml_** config. Open API 3.0 [supports](https://swagger.io/docs/specification/authentication/) HTTP authentication schemes (**Authorization** header), API keys, OAuth 2, and OpenID Connect. For our example, we’ll implement [Bearer Authentication](https://swagger.io/docs/specification/authentication/bearer-authentication/). Using Swagger Editor, modify **openapi.yml** config and add one more **_goodbye_** path following **_/hello_** in paths:

```yml
paths:
  /hello:
    get:
      # ...

  /goodbye:
    get:
      description: Returns 'Goodbye \<name\>!!!' to the authenticated caller
      tags:
        - greeting
      operationId: goodbye
      security:
        - bearerAuth: []
      responses:
        200:
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/HelloResponse'
```

Where:

- **schema** we reuse **HelloResponse** from **GET /hello**.
- **operationId: goodbye** — we’ll implement **goodbye** function in **controllers** to make it handle **GET /goodbye** requests.
- **security** property specifies a list of authentications for the request. In our case, it is a single **bearerAuth**. Add the definition to components section, where we have the **schemas** definition already:

```yml
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer

  schemas: ...
```

Let’s implement the authentication itself. We’ll create our first **user service** for that. The purpose of the services is to process requests logic decoupled from express HTTP logic. Create **src/api/services** folder and user.ts file in it with the following content:

```ts
export type ErrorResponse = { error: { type: string; message: string } }
export type AuthResponse = ErrorResponse | { userId: string }

function auth(bearerToken: string): Promise<AuthResponse> {
  return new Promise(function (resolve, reject) {
    const token = bearerToken.replace('Bearer ', '')
    if (token === 'fakeToken') {
      resolve({ userId: 'fakeUserId' })
      return
    }

    resolve({
      error: { type: 'unauthorized', message: 'Authentication Failed' },
    })
  })
}
export default { auth: auth }
```

We’ll call our service auth function implemented above from user controller. Create **src/api/controllers/user.ts** file with this content:

```ts
import * as express from 'express'

import UserService from '../services/user'
import { writeJsonResponse } from '../../utils/express'

export function auth(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void {
  const token = req.headers.authorization!
  UserService.auth(token)
    .then((authResponse) => {
      if (!(authResponse as any).error) {
        res.locals.auth = {
          userId: (authResponse as { userId: string }).userId,
        }
        next()
      } else {
        writeJsonResponse(res, 401, authResponse)
      }
    })
    .catch((err) => {
      writeJsonResponse(res, 500, {
        error: {
          type: 'internal_server_error',
          message: 'Internal Server Error',
        },
      })
    })
}
```

Finally, we need to tell express about the user controller with auth function. Update **_src/api/utils/server.ts_** file and add security property to the connector options:

```ts
const connect = connector(api, apiDefinition, {
  onCreateRoute: (method: string, descriptor: any[]) => {
    descriptor.shift()
    console.log(`${method}: ${descriptor.map((d: any) => d.name).join(', ')}`)
  },
  security: {
    bearerAuth: api.auth,
  },
})
connect(server)
```

Update **greeting** controller to add **goodbye** function which will be called on **/GET goodbye** based on our OPEN API config:

```ts
import * as express from 'express'
import {writeJsonResponse} from '../../utils/express'

export function hello(req: express.Request, res: express.Response): void {
  const name = req.query.name || 'stranger'
  writeJsonResponse(res, 200, {"message": `Hello, ${name}!`})
}


export function goodbye(req: express.Request, res: express.Response): void {
  const userId = res.locals.auth.userId
  writeJsonResponse(res, 200, {"message": `Goodbye, ${userId}!`})
```
