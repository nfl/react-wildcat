import {sleepUntilReactAvailable} from "src/test/e2e/utils/index.js";

const {maxTimeout, originUrl} = browser.params;

// Private variables
const dom = Symbol("dom");

class HelmetPageObject {
    static location = `${originUrl}/helmet-example`;

    _dom = {
        container: $("#helmet"),
        link: $("#helmet-link")
    };

    get [dom]() {
        return this._dom;
    }

    getLocation() {
        return browser.get(HelmetPageObject.location);
    }

    getNavigationLink() {
        return this[dom].link;
    }

    sleepUntilPageAvailable() {
        return Promise.all([
            sleepUntilReactAvailable(),
            browser.wait(
                protractor.ExpectedConditions.visibilityOf(
                    this[dom].container
                ),
                maxTimeout
            )
        ]);
    }
}

export default HelmetPageObject;
