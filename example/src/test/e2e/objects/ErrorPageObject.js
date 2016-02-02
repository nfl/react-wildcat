import {sleepUntilReactAvailable} from "src/test/e2e/utils/index.js";

const {originUrl} = browser.params;

// Private variables
const dom = Symbol("dom");

class ErrorPageObject {
    static location = `${originUrl}/error-example`;

    _dom = {
        container: $("#error"),
        link: $("#error-link")
    };

    get [dom]() {
        return this._dom;
    }

    getLocation() {
        return browser.get(ErrorPageObject.location);
    }

    getNavigationLink() {
        return this[dom].link;
    }

    sleepUntilPageAvailable() {
        return sleepUntilReactAvailable();
    }
}

export default ErrorPageObject;
