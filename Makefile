MAKEFLAGS = -j1

export BABEL_ENV = test

.PHONY: bootstrap clean install install-example lint publish test test-example test-browser-cov test-cov test-travis update-dependencies

bootstrap:
	npm install --silent
	jspm install --log warn -y
	node ./shell/install.js
	npm link react-wildcat-prefetch --silent

clean:
	./shell/clean.sh
	./shell/clean-example.sh

install: clean bootstrap install-example test-cov test-example

install-example:
	node ./shell/install-example.js

lint:
	node node_modules/.bin/eslint packages/* --ext .js --cache true

publish: lint
	./shell/publish.sh

test: lint
	./shell/test.sh
	./shell/test-browser.sh

test-example:
	./shell/test-example.sh

test-browser-cov:
	./shell/test-browser-cov.sh

test-cov:
	./shell/test-cov.sh

test-travis: bootstrap install-example lint test-cov

update-dependencies:
	./shell/update-dependencies.sh
	./shell/update-dependencies-example.sh
