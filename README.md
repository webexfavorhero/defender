## Run on localhost for development and debug

Run application with command: `npm start`.
and open http://localhost:3000

## Run on server

Prepare linux server (debian),
see how `docs/prepare_debian.md`

About deployment with help of pm2 project management system,
see `docs/deploy.md`


### Docker architecture for www.trafficdefender.net

1. nginx docker

app: nginx

description: balancer, https-encryption, http->https redirect, ->www redirect

ports: 80, 443


2. web docker

app: web_worker

description: web worker, web interface, http, frontend, manual checks for monitors

ports: 80, 3010

use ports: 3020 (safebrowsing_go), redis port, mongo port

git project: banchecker

git submodules: td_common

run: `gulp all && node --harmony bin/http`


3. job docker

app: job_worker

description: job worker, backend tasks, monitors, email & sms notifications, etc.

use ports: 3020, redis port, mongo port

git project: banchecker

git submodules: td_common

run: `node --harmony bin/job`


4. safebrowsing_go docker

app: safebrowsing_go

description: safebrowsing module writen in GO-language for safebrowsing monitor

port: 3020

git project: https://github.com/rjohnsondev/go-safe-browsing-api

run: `webserver config.file`


see `docs/safebrowsing_go.md` for how to setup this module.


5. mongo docker

6. redis docker


### t1.trdf.co

1. nginx docker

app: nginx

description: balancer, https-encryption, http->https redirect, ->www redirect

ports: 80, 443


2. web docker

app: web_worker

description: web worker, http

ports: 80, 3010

use ports: 3010, mongo port

git project: traffic

git submodules: td_common

run: `node --harmony bin/http`

3. mongo docker


## Logs

See logs in directory `logs/`.

In development environment with `NODE_ENV=development node bin/www` you can
download logs by `http://host:port/log`, for example
`http://t1.trafficdefender.net/logs`.

### Configure logs

How to configure log see [winston](https://github.com/winstonjs/winston) module.

-----------------------

## Debug

All debug messages:

	DEBUG=* node ./bin/www

Debug with specific debuggers. Example:

	DEBUG=banchecker,checker:safebrowsing,urlstatus:* node ./bin/www

Debug exclude specific debuggers. Example:

	DEBUG=*,-www node ./bin/www

### Available debuggers:

Available debuggers can be found:

	grep -r 'require(' . | grep -v /logs/ | grep -v /node_modules/ | grep 'debug' | sed "s/.*require.*debug.*'\(.*\)'.*/\1/g"

### Links

For more information see [debug](https://github.com/visionmedia/debug) module.

-----------------------

## Deploy

See 'docs/deploy.md' about how to deploy.

-----------------------

## Troubleshooting

In case of error:

	{ [Error: Cannot find module '../build/Release/bson'] code: 'MODULE_NOT_FOUND' }
	js-bson: Failed to load c++ bson extension, using pure JS version

Please, do:

	cd node_modules/mongoose/node_modules/mongodb/node_modules/bson/browser_build
	mkdir ../build/Release
	cp bson.js ../build/Release/

-----------------------

