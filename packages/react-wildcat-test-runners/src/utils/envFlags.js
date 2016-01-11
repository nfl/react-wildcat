import {argv} from "yargs";

const BABEL_ENV = "test";
const COVERAGE = process.env.COVERAGE;
const NODE_ENV = "production";
const COVERAGE_SUITE = argv.suite;

const FLAGS = [
    `BABEL_ENV=${BABEL_ENV}`,
    COVERAGE && `COVERAGE=${COVERAGE}`,
    COVERAGE_SUITE && `COVERAGE_SUITE=${COVERAGE_SUITE}`,
    `NODE_ENV=${NODE_ENV}`
].filter(e => e).join(` `);

export const testEnv = `env ${FLAGS}`;
