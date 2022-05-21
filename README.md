# server

Node JS backend server.

## Setup

1. Configure the [AirBnB style guide](https://www.npmjs.com/package/eslint-config-airbnb-base) as follows, within your VS Code

```
npx install-peerdeps --dev eslint-config-airbnb-base
npm install eslint-config-airbnb-base@14.2.1 eslint@^7.2.0 eslint-plugin-import@^2.22.1 --save-dev
```

2. Install Typescript and setup ESLint as per the [AirBnB ESLint config](https://www.npmjs.com/package/eslint-config-airbnb-typescript)

```
npm i -D eslint typescript
npm install eslint-config-airbnb-typescript \
            @typescript-eslint/eslint-plugin \
            @typescript-eslint/parser \
            --save-dev
npm i -D prettier eslint-config-prettier eslint-plugin-prettier
```

3. create .eslintrc.json

```
 {
	  "extends": ["airbnb-base", "airbnb-typescript/base", "plugin:prettier/recommended"],
	  "parserOptions": {
	    "project": "./tsconfig.json"
	  },
	  "plugins": ["import"]
}
```

create .prettierrc & [Restart VS code](https://github.com/prettier/eslint-plugin-prettier#options)

```
	{
	  "singleQuote": true,
	  "endOfLine": "auto",
	  "semi": true
	}
```

Also run `npm install jest ts-jest` to run tests after creating `babel.config.js` with the following

```
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
  ],
};
```

TODO

1. Implement a good logging system
2. Error handling and validation
4. Add API input validation
5. Add rate limiter on API
6. Write test cases for each of the APIs
7. Efficient way to managed environment variables
8. Script to test all env variables before starting the server
9. Clean up dependencies
