<img src="http://static.nfl.com/static/content/public/static/img/logos/nfl-engineering-light.svg" width="300" />

# react-wildcat-prefetch

[![npm package](https://img.shields.io/npm/v/react-wildcat-prefetch.svg?style=flat-square)](https://www.npmjs.org/package/react-wildcat-prefetch)

A React higher order component to prefetch component data.

## Installation

npm:

```bash
npm install react-wildcat-prefetch
```

## Usage

`@prefetch({string}|{function} action, [{Object} options])`

```js
// Prefetch data from a fully qualified URL
@prefetch("https://example.com/data.json")

// Or pass in a function
function getData() {
    return Promise.resolve(/* some data */);
}
@prefetch(getData)

// By default the key name is `asyncData`, but you
// can set your own key name in the options object
@prefetch("https://example.com/data.json", {key: "newKeyName"})
```

## Prefetching Data

Full example can be found in the [examples folder](../../example/src/routes/PrefetchExample/PrefetchExample.js)

```js
import prefetch from "react-wildcat-prefetch";

@prefetch("https://example.com/data.json", {key: "asyncData"})
class PrefetchExample extends React.Component {
    static propTypes = {
        asyncData: PropTypes.object.isRequired
    };

    static defaultProps = {
        asyncData: {
            data: []
        }
    };

    render() {
        const {asyncData: {data}} = this.props;
        console.log(data);
    }
}

```

# License

[MIT](../../LICENSE)
