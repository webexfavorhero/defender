# How to setup safebrowsing_go

## Install go language:

	apt-get install golang
	mkdir -p /var/www/gocode

Add to ~/.bashrc

	export GOPATH=/var/www/gocode

Run

	. ~/.bashrc

## Install go-safe-browsing-api

	go get github.com/golang/protobuf/proto
	go get github.com/rjohnsondev/go-safe-browsing-api

	go get github.com/BurntSushi/toml
	go install github.com/rjohnsondev/go-safe-browsing-api/webserver

## Create /var/www/gocode/bin/config.file and add:

	# example config file for safe browsing server
	address = "0.0.0.0:3020"
	googleApiKey = "AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw"
	dataDir = "/tmp/safe-browsing-data"
	# enable example usage page at /form
	enableFormPage = false

See more instructinos on github [go-safe-browsing-api](https://github.com/rjohnsondev/go-safe-browsing-api)

