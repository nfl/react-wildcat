## Test environment

`wildcat-test-runners` comes with it's own versions of the, jest (`wildcat-jest-runner`), protractor (`wildcat-protractor-runner`) and karma (`wildcat-karma-runner`) clis
that automatically start the wildcat static/application servers. They also provide the glue needed to get code coverage reporting working
seamlessly with protractor and karma using istanbul.

To run these tools with coverage generation enabled type:
```bash                                
    env COVERAGE=e2e wildcat-jest-runner
    env COVERAGE=e2e wildcat-protractor-runner
    env COVERAGE=unit wildcat-karma-runner
```
in your terminal.
