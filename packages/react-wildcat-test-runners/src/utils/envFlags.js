import {argv} from "yargs";

const BABEL_ENV = "test";
const COVERAGE = process.env.COVERAGE;
const NODE_ENV = "production";
const COVERAGE_SUITE = argv.suite;
const COVERAGE_FILES = argv.coverFiles;

const FLAGS = [
    `BABEL_ENV=${BABEL_ENV}`,
    COVERAGE && `COVERAGE=${COVERAGE}`,
    COVERAGE_SUITE && `COVERAGE_SUITE=${COVERAGE_SUITE}`,
    COVERAGE_FILES && `COVERAGE_FILES=${COVERAGE_FILES}`,
    `NODE_ENV=${NODE_ENV}`
].filter(e => e).join(" ");

export const testEnv = `env ${FLAGS}`;
