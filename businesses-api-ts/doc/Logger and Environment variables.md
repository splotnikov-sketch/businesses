# Logger + Environment variables

## TypeScript Absolute Imports Paths

- Install **_tsconfig-paths_** `npm install tsconfig-paths`
- Modify scripts in package.json to:

```json
"start": "node -r tsconfig-paths/register ./bin/app.js",
"dev": "ts-node -r tsconfig-paths/register ./src/app.ts"
```

- Update our tsconfig.json to:

```json
"baseUrl": "./",
"paths": {
  "@root/*": ["src/*", "bin/*"]
},
```

@root is our scope name; we can use company name or whatever is needed.

We can update now our sources to use the scope name instead of relative paths. Make the changes in 3 files:

```ts
src/api/controllers/greeting.ts:
-import {writeJsonResponse} from '../../utils/express'
import {writeJsonResponse} from '@root/utils/express'

src/api/controllers/user.ts:
-import user from '../services/user'
-import {writeJsonResponse} from '../../utils/express'
+import user from '@root/api/services/user'
+import {writeJsonResponse} from '@root/utils/express'

src/utils/server.ts
-import * as api from '../api/controllers'
+import * as api from '@root/api/controllers'
```

Save all the files, and run `npm run build`, `npm start`, `npm run dev`, to make sure it is still working and you get the same result as before.

## Express Logger

To output to console HTTP requests and responses, we make our Express server use the [middleware](https://expressjs.com/en/guide/using-middleware.html). We will be using [morgan](http://expressjs.com/en/resources/middleware/morgan.html), [morganBody](https://github.com/sirrodgepodge/morgan-body#readme), and a custom one.

For a custom logger middleware, create **_express_dev_logger.ts_** file in **\*src/utils** folder and insert the following content:

```ts
import express from 'express'

export const expressDevLogger = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void => {
  const startHrTime = process.hrtime()

  console.log(
    `Request: ${req.method} ${
      req.url
    } at ${new Date().toUTCString()}, User-Agent: ${req.get('User-Agent')}`
  )
  console.log(`Request Body: ${JSON.stringify(req.body)}`)

  const [oldWrite, oldEnd] = [res.write, res.end]
  const chunks: Buffer[] = []
  ;(res.write as unknown) = function (chunk: any): void {
    chunks.push(Buffer.from(chunk))
    ;(oldWrite as Function).apply(res, arguments)
  }

  res.end = function (chunk: any): void {
    if (chunk) {
      chunks.push(Buffer.from(chunk))
    }

    const elapsedHrTime = process.hrtime(startHrTime)
    const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6

    console.log(`Response ${res.statusCode} ${elapsedTimeInMs.toFixed(3)} ms`)

    const body = Buffer.concat(chunks).toString('utf8')
    console.log(`Response Body: ${body}`)
    ;(oldEnd as Function).apply(res, arguments)
  }

  next()
}
```

In **_src/utils/server.ts_** import new dependencies:

```ts
 import bodyParser from 'body-parser'
  import express from 'express'
  import {OpenApiValidator} from 'express-openapi-validator'
  import {Express} from 'express-serve-static-core'
+ import morgan from 'morgan'
+ import morganBody from 'morgan-body'
  import {connector, summarise} from 'swagger-routes-express'
  import YAML from 'yamljs'
  import * as api from '@exmpl/api/controllers'
+ import {expressDevLogger} from '@exmpl/utils/express_dev_logger'
```

Finally, make express to use our middlewares. In the same file, after `const server = express()` call, where we customize error response, insert this:

```ts
server.use(bodyParser.json())

server.use(
  morgan(':method :url :status :response-time ms - :res[content-length]')
)

morganBody(server)

server.use(expressDevLogger)
```
