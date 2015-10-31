import {sleepUntilReactAvailable} from "src/test/e2e/utils/index.js";

const {maxTimeout, originUrl} = browser.params;

// Private variables
const dom = Symbol("dom");

class PrefetchPageObject {
    static location = `${originUrl}/prefetch-example`

    _dom = {
        container: $("#prefetch"),
        link: $("#prefetch-link")
    }

    get [dom]() {
        return this._dom;
    }

    getLocation() {
        return browser.get(PrefetchPageObject.location);
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

export default PrefetchPageObject;
