import {expect} from "chai/index.js";

import IndexPageObject from "../objects/IndexPageObject.js";
import FlexboxPageObject from "../objects/FlexboxPageObject.js";
import PrefetchPageObject from "../objects/PrefetchPageObject.js";
import HelmetPageObject from "../objects/HelmetPageObject.js";

describe("Index Page", () => {
    let landingUrl;

    const indexPage = new IndexPageObject();
    const flexboxPage = new FlexboxPageObject();
    const prefetchPage = new PrefetchPageObject();
    const helmetPage = new HelmetPageObject();

    it("setup", async done => {
        try {
            await indexPage.getLocation();

            landingUrl = await browser.getCurrentUrl();
            expect(landingUrl).to.equal(IndexPageObject.location);

            const appLinks = await indexPage.getNavigationLinks();
            expect(appLinks).to.have.length.of(6);

            done();
        } catch (e) {
            done(e);
        }
    });

    context("navigation", () => {
        context("server load", () => {
            it("/ route", async done => {
                try {
                    await indexPage.sleepUntilPageAvailable();

                    const currentUrl = await browser.getCurrentUrl();
                    expect(currentUrl).to.equal(landingUrl);

                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        context("browser load", () => {
            it("/flexbox-example route", async done => {
                try {
                    await flexboxPage.getNavigationLink().click();
                    await flexboxPage.sleepUntilPageAvailable();

                    const flexboxUrl = await browser.getCurrentUrl();
                    expect(flexboxUrl).to.equal(FlexboxPageObject.location);

                    done();
                } catch (e) {
                    done(e);
                }
            });

            it("/prefetch-example route", async done => {
                try {
                    await prefetchPage.getNavigationLink().click();
                    await prefetchPage.sleepUntilPageAvailable();

                    const prefetchUrl = await browser.getCurrentUrl();
                    expect(prefetchUrl).to.equal(PrefetchPageObject.location);

                    done();
                } catch (e) {
                    done(e);
                }
            });

            it("/helmet-example route", async done => {
                try {
                    await helmetPage.getNavigationLink().click();
                    await helmetPage.sleepUntilPageAvailable();

                    const helmetUrl = await browser.getCurrentUrl();
                    expect(helmetUrl).to.equal(HelmetPageObject.location);

                    done();
                } catch (e) {
                    done(e);
                }
            });

            it("/ route", async done => {
                try {
                    await indexPage.getNavigationLink().click();
                    await indexPage.sleepUntilPageAvailable();

                    const indexUrl = await browser.getCurrentUrl();
                    expect(indexUrl).to.equal(IndexPageObject.location);

                    done();
                } catch (e) {
                    done(e);
                }
            });
        });
    });
});
