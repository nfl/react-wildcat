/**
 * @name sleepUntilReactAvailable
 * @description Wait until React is available
 * @returns {!webdriver.promise.Promise} Promise
 */
export default async function sleepUntilReactAvailable(currentUrl, timeout = 10000) {
    return await browser.wait(
        protractor.ExpectedConditions.visibilityOf(
            $("[data-react-available]")
        ),
        timeout
    );
}
