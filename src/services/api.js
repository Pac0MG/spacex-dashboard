import axios from "axios";

// Use the same host the page was loaded from, instead of a hardcoded
// "localhost". That way it keeps working when this app is opened from
// another device on the network (e.g. a phone) via the computer's LAN IP,
// not just from the computer itself.
const api = axios.create({
  baseURL: `http://${window.location.hostname}:4010/v4`,
  timeout: 10000,
});

export default api;
