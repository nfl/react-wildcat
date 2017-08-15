### Getting started

Clone this repository, then:

- `make install`
- `cd example`
- `npm run dev`
- Open `https://localhost:3000`

## ulimit increase

You'll very likely need to increase the file watch limit. [Follow these steps](http://stackoverflow.com/a/27982223) to do so.

## Accepting the development SSL certificate:

While it is possible to run the environment with an untrusted SSL certificate, for best results you should have OS X trust the self-signed certificate. Here's how:

- Run the development environment
- Navigate to https://localhost:3000
- Follow these steps: [http://www.andrewconnell.com/blog/setup-self-signed-certificates-trusting-them-on-os-x](http://www.andrewconnell.com/blog/setup-self-signed-certificates-trusting-them-on-os-x#add-the-certificate-as-a-trusted-root-authority)
- Repeat the above steps for the static file server at https://localhost:4000
