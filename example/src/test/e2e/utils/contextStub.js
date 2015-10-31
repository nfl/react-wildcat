const contextStub = {
    router: () => {
        const routerStub = sinon.stub();
        routerStub.getRouteAtDepth = sinon.stub();
        routerStub.setRouteComponentAtDepth = sinon.stub();
        routerStub.getCurrentQuery = sinon.stub();
        routerStub.makeHref = sinon.stub();
        routerStub.isActive = sinon.stub();

        return routerStub;
    }(),
    routeDepth: 1
};

export default contextStub;
