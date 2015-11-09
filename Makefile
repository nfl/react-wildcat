MAKEFLAGS = -j1

export BABEL_ENV = test

.PHONY: bootstrap clean install install-example lint test test-example test-browser-cov test-cov test-travis update-dependencies

bootstrap:
	npm install --silent
	jspm install --log warn -y
	./shell/install.sh
	npm link react-wildcat-prefetch --silent

clean:
	./shell/clean.sh
	./shell/clean-example.sh

install: clean bootstrap install-example test test-example

install-example:
	./shell/install-example.sh

lint:
	node node_modules/.bin/eslint_d packages/* --ext .js --cache true

test: lint
	./shell/test.sh
	./shell/test-browser.sh

test-example:
	./shell/test-example.sh

test-browser-cov:
	./shell/test-browser-cov.sh

test-cov:
	./shell/test-cov.sh

test-travis: bootstrap lint test-cov

update-dependencies:
	./shell/update-dependencies.sh
	./shell/update-dependencies-example.sh
