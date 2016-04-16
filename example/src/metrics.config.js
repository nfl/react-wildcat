const GoogleAnalytics = function GoogleAnalyticsStub(config) {
    return console.log("Stub Google Analytics API", config);
};

const metricsConfig = {
    vendors: [{
        name: "Google Analytics",
        api: new GoogleAnalytics({
            trackingId: "UA-********-*"
        })
    }],
    pageViewEvent: "pageLoad",
    pageDefaults: () => {
        return {
            siteName: "react-wildcat-example"
        };
    }
};

export default metricsConfig;
