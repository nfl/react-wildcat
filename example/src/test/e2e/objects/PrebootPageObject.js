import {sleepUntilReactAvailable} from "src/test/e2e/utils/index.js";

const {maxTimeout, originUrl} = browser.params;

// Private variables
const dom = Symbol("dom");

class PrebootPageObject {
    static location = `${originUrl}/preboot-example`;

    _dom = {
        container: $("#preboot"),
        link: $("#preboot-link")
    };

    get [dom]() {
        return this._dom;
    }

    getLocation() {
        return browser.get(PrebootPageObject.location);
    }

    getNavigationLink() {
        return this[dom].link;
    }

    getNavigationLinks() {
        return this[dom].navigationLinks;
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

export default PrebootPageObject;
