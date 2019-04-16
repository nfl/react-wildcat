MAKEFLAGS = -j1

export BABEL_ENV = test

.PHONY: bootstrap clean install install-example lint publish test test-example test-browser-cov test-cov test-travis update-dependencies

bootstrap:
	yarn install
	node ./shell/install.js
	yarn link --force react-wildcat-prefetch

clean:
	./shell/clean.sh
	./shell/clean-example.sh

clean-coverage:
	./shell/clean-coverage.sh

combine-coverage:
	./shell/combine-coverage.sh

install: bootstrap install-example test-cov test-example

install-example:
	node ./shell/install-example.js

lint:
	node node_modules/.bin/eslint packages/* --ext .js --cache --cache-location .cache/.eslintcache --fix

publish: lint
	./shell/publish.sh

test-example:
	./shell/test-example.sh

test-jest-browser:
	./shell/test-jest-browser.sh

test-jest-node:
	./shell/test-jest-node.sh

test-karma-node:
	./shell/test-karma-node.sh

test-cov: clean-coverage test-karma-node test-jest-node test-jest-browser combine-coverage

test-travis: bootstrap install-example lint test-cov


update-dependencies:
	./shell/update-dependencies.sh
	./shell/update-dependencies-example.sh

upgrade-react:
	node ./shell/upgrade-react.js
