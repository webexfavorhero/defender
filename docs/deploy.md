# Deploy

## About

This document about how to deploy banchecker on debian

## Prepare debian

On Debian 8 install `git`, `node`, `mongodb`, `redis`, `pm2`.

See `docs/prepare_debian.md`.

## Install banchecker

### Clone

Clone project

	mkdir -p /var/www
	cd /var/www/
	git clone git@bitbucket.org:alphara/banchecker.git
	cd banchecker/
	mkdir logs/

Install node modules

	npm install

### pm2

Install pm2:

	npm install pm2@latest -g

Start Traffic Deffender:

	pm2 start trafficdefender.json

PM2 can generate startup scripts and configure them.

	pm2 startup systemd

PM2 save all process list and to bring back all processes at machine restart.

	pm2 save

More information about [pm2](https://github.com/Unitech/PM2/blob/master/ADVANCED_README.md)

### Bitbucket without password

How to use Bitbucket git without password.

This command will generate new private and public key pair.

	ssh-keygen -t rsa

If you already have one, just open

	cat ~/.ssh/id_rsa.pub

copy all the contents.

Open `Bitbucket` > `Manage Account` > `SSH Keys` and click on `Add Key`, then paste your public key details.

Alternatively, put deployment key (read only access), open `Bitbucket` > Project name > `Settings` > `Deployment keys`, click `Add Key`.

Make sure that project from Bitbucket is cloned manualy:

	git clone git@bitbucket.org:alphara/banchecker.git

### pm2 auto deploy

Example for deploy on `www.trafficdefender.net / development`. Initialize:

	pm2 deploy trafficdefender.json td_development setup

Deploy latest code:

	pm2 deploy trafficdefender.json td_development

[pm2 deployment options](https://github.com/Unitech/PM2/blob/master/ADVANCED_README.md#deployment-options)

