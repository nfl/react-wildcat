exports.prefetchedData = {
    "asyncData": {
        "stub": true
    },

    "asyncArrayData": [1, 2, 3],

    "firstData": {
        "first": true
    },

    "secondData": {
        "second": true
    }
};

exports.fetchPromise = () => Promise.resolve(exports.prefetchedData.asyncData);
