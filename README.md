[![NPM](https://nodei.co/npm/run-on.png)](https://npmjs.org/package/run-on)

[![Linux Build Status](https://img.shields.io/travis/mr47/run-on.svg?style=flat&label=Travis)](https://travis-ci.org/mr47/run-on)

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

# Intro

Better NPM scripts runner

- Avoid hard-coded commands in package.json
- Cross-platform compatibility, originally needed by:
    - https://github.com/formly-js/angular-formly/issues/305
        - https://github.com/npm/npm/issues/2800

# Inspired by

- https://www.npmjs.com/package/with-package

# Alternatives

- [argv-set-env](https://github.com/kentcdodds/argv-set-env)
- [cross-env](https://github.com/kentcdodds/cross-env)

# Usage in package.json

From this:
```JSON
{
  "scripts": {
    "build:dist": "NODE_ENV=development webpack --config $npm_package_webpack --progress --colors",
    "test": "NODE_ENV=production karma start"
  }
}
```

To this:
```JSON
{
  "devDependencies": {
    "run-on": "~0.0.1"
  },
  "scripts": {
    "build:dist": "run-on build:dist",
    "build:prod": "run-on build:prod",
    "test": "run-on test",
    "test:special": "run-on --on mac,linux build:dist",
    "raw:test": "run-on --on windows --raw echo 'test'"
  },
  "betterScripts": {
    "build:dist": "webpack --config $npm_package_webpack --progress --colors",
    "build:prod": {
      "command": "webpack --config $npm_package_webpack --progress --colors",
      "env": {
        "NODE_ENV": "production"
      }
    },
    "test": {
      "command": "karma start",
      "env": {
        "NODE_ENV": "test"
      }
    }
  }
}
```

_The `betterScripts` script definition can either be a string or sub-object with `command` and `env` attributes. Values defined in the `env` block will override previously set environment variables._

Note that depending on the OS and terminal you're using, dots, spaces or other special characters in the command path may be treated as separators and the command will be parsed wrong.

```JSON
{
  "serve:dist": "./node_modules/.bin/webpack-dev-server --hot --inline --config webpack/development.js"
}
```

To prevent this you need to explicitly wrap the command path with double quotes:

```JSON
{
  "serve:dist": "\"./node_modules/.bin/webpack-dev-server\" --hot --inline --config webpack/development.js"
}
```

# .env File

If you have an `.env` file in your project root it will be loaded on every command.

```
NODE_PATH=./:./lib
NODE_ENV=development
PORT=5000
```

_Environment variables defined in the `betterScripts` script definition will take precedence over `.env` values._

# Shell scripts

Currently, using [bash variables](http://tldp.org/LDP/abs/html/internalvariables.html) (PWD, USER, etc.) is not possible:

``` JSON
  "command": "forever start -l ${PWD}/logs/forever.log -o ${PWD}/logs/out.log -e ${PWD}/logs/errors.log -a index.js",
```

In order to use them, you can create an script file (`.sh`) instead:

`forever.sh`:
``` bash
forever start -l ${PWD}/logs/forever.log -o ${PWD}/logs/out.log -e ${PWD}/logs/errors.log -a index.js
```

`package.json`:
``` javascript
  "command": "./forever.sh"
```

## cli commands

This module expose 2 cli commands:
- `run-on` and,
- a shorter one: `bnr` which is an alias to the former.

The shorter one is useful for cases where you have a script that calls several `run-on` scripts. e.g:

using the normal cli name

```javascript
"scripts": {
  "dev": "shell-exec 'run-on install-hooks' 'run-on watch-client' 'run-on start-dev' 'run-on start-dev-api' 'run-on start-dev-worker' 'run-on start-dev-socket'",
}
```

using the shorter alias

```javascript
"scripts": {
  "dev": "shell-exec 'bnr install-hooks' 'bnr watch-client' 'bnr start-dev' 'bnr start-dev-api' 'bnr start-dev-worker' 'bnr start-dev-socket'",
}
```

And for silence output, you can use `-s` or verbose `--silence` flags

```
bnr -s watch-client
```

And you can use `-p` or verbose `--path` to specify a custom path of dotenv file

```
bnr --path=/custom/path/to/your/env/vars start-dev
```

Also use `-e` or verbose `--encoding` to specify the encoding of dotenv file

```
bnr --encoding=base64 start-dev
```

Also use `-o` or verbose `--on` to specify platform that script should run on
```
run-on --on linux,mac start-dev
run-on --on windows start-dev-win
```
Also use `-r` or verbose `--raw` to run a command in current env, like `dir` on windows or `rm -rf ./lib` on linux

```
run-on --raw echo 'test'
run-on --raw cross-env TEST=123 my-special-run
```


by using `--on` and `--raw` you can archive platform specific commands that doesn't require to write shell scripts.

```
run-on --on linux,windows --raw cross-env TEST=123 my-special-run && run-on --on windows --raw cross-env TEST=123 my-special-run-win
```

See [envdot docs](https://github.com/motdotla/dotenv) for more infomation

Original author: [benoror](https://github.com/benoror/better-npm-run)

### License

Copyright © 2017, [Dmitry Poddubniy](https://github.com/mr47).
Released under the [MIT License](LICENSE).

***
