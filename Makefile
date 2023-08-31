.PHONY: build

build:
	node build.js

update: install
	git submodule update --init --recursive
	cd js13k-compiler && git checkout master && git pull && npm install

install:
	git submodule update --init --recursive
	brew install node advancecomp || apt install advancecomp
	cd js13k-compiler && npm install
	./install-ect.sh
