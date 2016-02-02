import {sleepUntilReactAvailable} from "src/test/e2e/utils/index.js";

const {maxTimeout, originUrl} = browser.params;

// Private variables
const dom = Symbol("dom");

class FlexboxPageObject {
    static location = `${originUrl}/flexbox-example`;

    _dom = {
        container: $("#flexbox"),
        link: $("#flexbox-link")
    };

    get [dom]() {
        return this._dom;
    }

    getLocation() {
        return browser.get(FlexboxPageObject.location);
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

export default FlexboxPageObject;
