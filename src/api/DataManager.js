class DataManager {
  endpoint = "";
  token = "";
  headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  constructor(endpoint, token) {
    this.endpoint = endpoint;
    this.token = token;
  }

  doSend(method = "POST", url = "", data = {}) {
    return fetch(url, {
      method: method,
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: this.headers,
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((result) => {
        return result;
      })
      .catch((error) => console.log(error));
  }

  doGet(url, resourceName) {
    return fetch(url, { headers: this.headers })
      .then((res) => res.json())
      .then((result) => {
        return result;
      })
      .catch((error) => console.log(error));
  }

  getDomains() {
    let url = "http://" + this.endpoint + "/domains";
    return this.doGet(url, "domains");
  }

  getProviders() {
    let url = "http://" + this.endpoint + "/providers";
    return this.doGet(url, "providers");
  }

   getPrefixes(id) {
      let url;
      if (id) {
        url = "http://" + this.endpoint + "/prefixes/" + id;
      }
      else {
        url = "http://" + this.endpoint + "/prefixes";
      }
      console.log("url get prefix or prefixes:  "+url);
      return this.doGet(url, "prefixes");
    }
}

export default DataManager;
