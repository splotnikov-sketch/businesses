# Project initial setup: TypeScript + Node.js

## Install Node & Yarn

Use [nvm](https://github.com/nvm-sh/nvm). Use a stable node version, install lts version `nvm install --lts`
The packages can be controlled with node package manager, [yarn](https://classic.yarnpkg.com/en/docs/install#windows-stable) or [npm](https://docs.npmjs.com/)

To install yarn: `npm install --global yarn`
To check yarn version: `yarn --version`

- Init project: `npm init`
- Install initial dependencies: `npm install @types/node typescript`, `npm install -D ts-node`. Install ts-node globally as well `npm install -g ts-node`
- Create tsconfig.json, required for tsc and ts-node, to compile TypeScript to JavaScript: `tsc --init --rootDir src --outDir ./bin --esModuleInterop --lib ES2019 --module commonjs --noImplicitAny true`
- Create your first source file in src folder: `mkdir src`, `echo "console.log('Hello World\!\!\!')" > src/app.ts`
- Build the project: `tsc -b`
- Run the output file: `node ./bin/app.js`
- For development purposes, ts-node is used, to run code without a compilation. ts-node will compile it on fly: `ts-node ./src/app.ts`
- Add build and run scripts to package.json

```json
"scripts": {
  "build": "tsc",
  "start": "node ./bin/app.js",
  "dev": "ts-node ./src/app.ts"
},
```

To build TypeScript to JavaScript: `npm run build`

To run compiled JavaScript: `npm run start`

Run TypeScript with a “compilation” on fly: `npm run dev`
