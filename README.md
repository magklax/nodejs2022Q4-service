# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone {repository URL}
```

## Installing NPM modules

```
npm install --legacy-peer-deps
```

## Running application

```
npm start
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/api/.

or copy content of `./doc/api.yaml` and insert to https://editor.swagger.io/  
__create .env file using .env.example as a pattern__

## Create docker app image:

```
docker build . -t app
```

## Create docker pg database image:

```
docker build ./db -t db
```

## Running docker app image:

```
docker run -t -i -p 4000:4000 app
```


## Running docker pg database image:

```
docker run -t -i -p 5432:5432 db
```

## Running docker compose

```
docker-compose up
```

## Running scan built images:

```
npm run docker:scan
```

## Run migrations:

```
npm run migrate:up
```

## Pushing images to dockerHub:

1. Pushing app:
```
docker login -u <dockerhub_username> -p <dockerhub_password>
docker tag app:app <dockerhub_username>/home-library:app
docker push <dockerhub_username>/home-library:app
```

2. Pushing db:
```
docker tag db:db <dockerhub_username>/home-library:db
docker push <dockerhub_username>/home-library:db
```

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging


## Running docker compose

docker-compose up