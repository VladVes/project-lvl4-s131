install:
	npm install

start:
	DEBUG="TaskManager:*" npm run nodemon -- --watch . --ext '.js' --exec  babel-node -- 'src/bin/taskManager.js'

test:
	npm test

build:
	npm run build

lint:
	npm run eslint ./src/**
