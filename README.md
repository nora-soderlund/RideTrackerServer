# Ride Tracker Server
A web server API that is used by the [RideTracker](https://github.com/nora-soderlund/RideTracker) app to manage activities, routes, directions, users, etc.

## Infrastructure
<p align="center">
  <img src="https://user-images.githubusercontent.com/78360666/209476010-0c3762f7-808f-4691-ba29-ce9bf6dfa765.svg">
</p>

The API server is not designed to be accessible through the world wide web directly, instead it should go through a proxy server - such as my [NodeJS HTTP Proxy](https://github.com/nora-soderlund/NodeJS-HTTP-Proxy) repository. The MySQL server should ideally be on a seperate server, preferably on the same network.
