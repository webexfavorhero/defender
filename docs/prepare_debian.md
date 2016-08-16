# Prepare Debian for deploy

## About

This document about how to prepare Debian for banchecker deploy.

## Steps

### Upgrade

See debian version:

	lsb_release -a

If you have Debian 7 or more lower version, please [upgrade](#upgrade-debian).

Else:

	apt-get update; apt-get upgrade

### Locales

	echo -e "LANGUAGE=en_US.UTF-8\nLANG=en_US.UTF-8\nLC_ALL=en_US.UTF-8\nLC_CTYPE=en_US.UTF-8" > /etc/default/locale
	export LANGUAGE=en_US.UTF-8; export LANG=en_US.UTF-8; export LC_ALL=en_US.UTF-8; locale-gen en_US.UTF-8; dpkg-reconfigure locales
	locale -a

### Utils

	apt-get install sudo vim git curl

### Node.js

	curl -sL https://deb.nodesource.com/setup_0.12 | sudo bash -
	apt-get install -y nodejs
	apt-get install -y build-essential
	npm install -g gulp

[More information](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager#debian-and-ubuntu-based-linux-distributions)

### MongoDB

	sudo apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
	echo "deb http://repo.mongodb.org/apt/debian "$(lsb_release -sc)"/mongodb-org/3.0 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list
	sudo apt-get update
	sudo apt-get install -y mongodb-org

If don't work try `wheezy` instead of `"$(lsb_release -sc)"`.

[Install MongoDB on Debian](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-debian/)

### Redis

	apt-get install redis-server

### pm2

	npm install -g pm2@latest

[More inforamtion](https://github.com/Unitech/PM2/blob/master/ADVANCED_README.md#startup-scrip://github.com/Unitech/PM2/blob/master/ADVANCED_README.md#startup-script)

## <a name="upgrade-debian"></a> Update debian 7 to debian 8

Certainly:

1. Edit /etc/apt/sources.list by replacing "wheezy" with "jessie"

1. Run:

	sudo apt-get update && sudo apt-get upgrade

1. Repeat Step #3 a few times. If terminal shows x number of files will be held back, then go to Step 5:

1. Run:

	sudo apt-get update && sudo apt-get dist-upgrade

Details in debianwiki.org

Cheers!

## SSH key

Step 1: Create public and private keys using ssh-key-gen on local-host

	ssh-keygen

Step 2: Copy the public key to remote-host using ssh-copy-id

	ssh-copy-id -i ~/.ssh/id_rsa.pub <user@remote-host>

Step 3: Login to remote-host without entering the password

	ssh <user@remote-host>

## Vim config

You can also install latest alphara's vim config

	git clone git@bitbucket.org:snippets/alphara/5kM8/vim.git /tmp/vim && cp /tmp/vim/.vimrc ~ && rm -r /tmp/vim

Open ~/.vimrc and follow the install instructions.


