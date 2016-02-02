import {sleepUntilReactAvailable} from "src/test/e2e/utils/index.js";

const {maxTimeout, originUrl} = browser.params;

// Private variables
const dom = Symbol("dom");

class IndexPageObject {
    static location = `${originUrl}/`;

    _dom = {
        container: $(`#index`),
        link: $(`#index-link`),
        navigationLinks: $$(`[role="navigation"] a`)
    };

    get [dom]() {
        return this._dom;
    }

    getLocation() {
        return browser.get(IndexPageObject.location);
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

export default IndexPageObject;
