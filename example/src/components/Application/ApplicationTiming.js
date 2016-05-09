import React from "react";
import ExecutionEnvironment from "exenv";

class ApplicationTiming extends React.Component {
    static propTypes = {
        children: React.PropTypes.node
    };

    getTiming() {
        const id = "ttfr";

        if (!ExecutionEnvironment.canUseDOM) {
            return true;
        }

        if (document.querySelector(`#${id}`)) {
            return true;
        }

        const now = Date.now();
        const {timing: {navigationStart}} = window.performance;
        const diff = now - navigationStart;

        const pre = document.createElement("pre");
        const style = {
            background: "rgba(255, 255, 255, 0.9)",
            border: "1px solid",
            margin: "5px",
            padding: "0.6rem",
            position: "fixed",
            top: 0,
            right: 0
        };

        Object.keys(style).forEach(rule => pre.style[rule] = style[rule]);
        pre.innerHTML = `time to first render: ${diff}ms (${(diff / 1000).toFixed(1)}s)`;
        pre.id = id;

        return document.body.appendChild(pre);
    }

    render() {
        this.getTiming();
        return this.props.children;
    }
}

export default ApplicationTiming;
