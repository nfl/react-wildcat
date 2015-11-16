/**
 * @name sleepUntilUrlChange
 * @description Wait until the URL changes
 * @returns {!webdriver.promise.Promise} Promise
 */
export default async (currentUrl, timeout = 10000) => {
    return await browser.wait(() => {
        return browser.getCurrentUrl().then((url) => {
            return (url !== currentUrl);
        });
    }, timeout);
};
