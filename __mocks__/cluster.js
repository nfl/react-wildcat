const cluster = jest.genMockFromModule("cluster");

cluster.isMaster = true;
cluster.worker = {
    id: 1
};

module.exports = cluster;
