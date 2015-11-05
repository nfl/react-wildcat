MAKEFLAGS = -j1

export BABEL_ENV = test

.PHONY: bootstrap clean install lint test test-cov update-dependencies

bootstrap:
	npm install
	jspm install
	./shell/install.sh
	./shell/install-example.sh

clean:
	./shell/clean.sh
	./shell/clean-example.sh

install: clean bootstrap test-cov

lint:
	node node_modules/.bin/eslint packages/* --ext .js

test: lint
	./shell/test.sh
	./shell/test-example.sh

test-cov:
	./shell/test-cov.sh

update-dependencies:
	./shell/update-dependencies.sh
	./shell/update-dependencies-example.sh
