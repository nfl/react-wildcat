MAKEFLAGS = -j1

export BABEL_ENV = test

bootstrap:
	npm install
	./shell/install.sh
	./shell/install-example.sh

clean:
	./shell/clean.sh
	./shell/clean-example.sh

install: clean bootstrap test

lint:
	node node_modules/.bin/eslint packages/* --ext .js

test: lint
	./shell/test.sh
	./shell/test-example.sh

update-dependencies:
	./shell/update-dependencies.sh
	./shell/update-dependencies-example.sh
