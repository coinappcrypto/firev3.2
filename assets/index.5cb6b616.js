const p = function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(script) {
    const fetchOpts = {};
    if (script.integrity)
      fetchOpts.integrity = script.integrity;
    if (script.referrerpolicy)
      fetchOpts.referrerPolicy = script.referrerpolicy;
    if (script.crossorigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (script.crossorigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
};
p();
var style = "";
const scriptRel = "modulepreload";
const seen = {};
const base = "/";
const __vitePreload = function preload(baseModule, deps) {
  if (!deps || deps.length === 0) {
    return baseModule();
  }
  return Promise.all(deps.map((dep) => {
    dep = `${base}${dep}`;
    if (dep in seen)
      return;
    seen[dep] = true;
    const isCss = dep.endsWith(".css");
    const cssSelector = isCss ? '[rel="stylesheet"]' : "";
    if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
      return;
    }
    const link = document.createElement("link");
    link.rel = isCss ? "stylesheet" : scriptRel;
    if (!isCss) {
      link.as = "script";
      link.crossOrigin = "";
    }
    link.href = dep;
    document.head.appendChild(link);
    if (isCss) {
      return new Promise((res, rej) => {
        link.addEventListener("load", res);
        link.addEventListener("error", () => rej(new Error(`Unable to preload CSS for ${dep}`)));
      });
    }
  })).then(() => baseModule());
};
/*! Capacitor: https://capacitorjs.com/ - MIT License */
const createCapacitorPlatforms = (win) => {
  const defaultPlatformMap = /* @__PURE__ */ new Map();
  defaultPlatformMap.set("web", { name: "web" });
  const capPlatforms = win.CapacitorPlatforms || {
    currentPlatform: { name: "web" },
    platforms: defaultPlatformMap
  };
  const addPlatform = (name, platform) => {
    capPlatforms.platforms.set(name, platform);
  };
  const setPlatform = (name) => {
    if (capPlatforms.platforms.has(name)) {
      capPlatforms.currentPlatform = capPlatforms.platforms.get(name);
    }
  };
  capPlatforms.addPlatform = addPlatform;
  capPlatforms.setPlatform = setPlatform;
  return capPlatforms;
};
const initPlatforms = (win) => win.CapacitorPlatforms = createCapacitorPlatforms(win);
const CapacitorPlatforms = /* @__PURE__ */ initPlatforms(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
CapacitorPlatforms.addPlatform;
CapacitorPlatforms.setPlatform;
var ExceptionCode;
(function(ExceptionCode2) {
  ExceptionCode2["Unimplemented"] = "UNIMPLEMENTED";
  ExceptionCode2["Unavailable"] = "UNAVAILABLE";
})(ExceptionCode || (ExceptionCode = {}));
class CapacitorException extends Error {
  constructor(message, code, data) {
    super(message);
    this.message = message;
    this.code = code;
    this.data = data;
  }
}
const getPlatformId = (win) => {
  var _a, _b;
  if (win === null || win === void 0 ? void 0 : win.androidBridge) {
    return "android";
  } else if ((_b = (_a = win === null || win === void 0 ? void 0 : win.webkit) === null || _a === void 0 ? void 0 : _a.messageHandlers) === null || _b === void 0 ? void 0 : _b.bridge) {
    return "ios";
  } else {
    return "web";
  }
};
const createCapacitor = (win) => {
  var _a, _b, _c, _d, _e;
  const capCustomPlatform = win.CapacitorCustomPlatform || null;
  const cap = win.Capacitor || {};
  const Plugins = cap.Plugins = cap.Plugins || {};
  const capPlatforms = win.CapacitorPlatforms;
  const defaultGetPlatform = () => {
    return capCustomPlatform !== null ? capCustomPlatform.name : getPlatformId(win);
  };
  const getPlatform = ((_a = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _a === void 0 ? void 0 : _a.getPlatform) || defaultGetPlatform;
  const defaultIsNativePlatform = () => getPlatform() !== "web";
  const isNativePlatform = ((_b = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _b === void 0 ? void 0 : _b.isNativePlatform) || defaultIsNativePlatform;
  const defaultIsPluginAvailable = (pluginName) => {
    const plugin = registeredPlugins.get(pluginName);
    if (plugin === null || plugin === void 0 ? void 0 : plugin.platforms.has(getPlatform())) {
      return true;
    }
    if (getPluginHeader(pluginName)) {
      return true;
    }
    return false;
  };
  const isPluginAvailable = ((_c = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _c === void 0 ? void 0 : _c.isPluginAvailable) || defaultIsPluginAvailable;
  const defaultGetPluginHeader = (pluginName) => {
    var _a2;
    return (_a2 = cap.PluginHeaders) === null || _a2 === void 0 ? void 0 : _a2.find((h) => h.name === pluginName);
  };
  const getPluginHeader = ((_d = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _d === void 0 ? void 0 : _d.getPluginHeader) || defaultGetPluginHeader;
  const handleError = (err) => win.console.error(err);
  const pluginMethodNoop = (_target, prop, pluginName) => {
    return Promise.reject(`${pluginName} does not have an implementation of "${prop}".`);
  };
  const registeredPlugins = /* @__PURE__ */ new Map();
  const defaultRegisterPlugin = (pluginName, jsImplementations = {}) => {
    const registeredPlugin = registeredPlugins.get(pluginName);
    if (registeredPlugin) {
      console.warn(`Capacitor plugin "${pluginName}" already registered. Cannot register plugins twice.`);
      return registeredPlugin.proxy;
    }
    const platform = getPlatform();
    const pluginHeader = getPluginHeader(pluginName);
    let jsImplementation;
    const loadPluginImplementation = async () => {
      if (!jsImplementation && platform in jsImplementations) {
        jsImplementation = typeof jsImplementations[platform] === "function" ? jsImplementation = await jsImplementations[platform]() : jsImplementation = jsImplementations[platform];
      } else if (capCustomPlatform !== null && !jsImplementation && "web" in jsImplementations) {
        jsImplementation = typeof jsImplementations["web"] === "function" ? jsImplementation = await jsImplementations["web"]() : jsImplementation = jsImplementations["web"];
      }
      return jsImplementation;
    };
    const createPluginMethod = (impl, prop) => {
      var _a2, _b2;
      if (pluginHeader) {
        const methodHeader = pluginHeader === null || pluginHeader === void 0 ? void 0 : pluginHeader.methods.find((m) => prop === m.name);
        if (methodHeader) {
          if (methodHeader.rtype === "promise") {
            return (options) => cap.nativePromise(pluginName, prop.toString(), options);
          } else {
            return (options, callback) => cap.nativeCallback(pluginName, prop.toString(), options, callback);
          }
        } else if (impl) {
          return (_a2 = impl[prop]) === null || _a2 === void 0 ? void 0 : _a2.bind(impl);
        }
      } else if (impl) {
        return (_b2 = impl[prop]) === null || _b2 === void 0 ? void 0 : _b2.bind(impl);
      } else {
        throw new CapacitorException(`"${pluginName}" plugin is not implemented on ${platform}`, ExceptionCode.Unimplemented);
      }
    };
    const createPluginMethodWrapper = (prop) => {
      let remove;
      const wrapper = (...args) => {
        const p2 = loadPluginImplementation().then((impl) => {
          const fn = createPluginMethod(impl, prop);
          if (fn) {
            const p3 = fn(...args);
            remove = p3 === null || p3 === void 0 ? void 0 : p3.remove;
            return p3;
          } else {
            throw new CapacitorException(`"${pluginName}.${prop}()" is not implemented on ${platform}`, ExceptionCode.Unimplemented);
          }
        });
        if (prop === "addListener") {
          p2.remove = async () => remove();
        }
        return p2;
      };
      wrapper.toString = () => `${prop.toString()}() { [capacitor code] }`;
      Object.defineProperty(wrapper, "name", {
        value: prop,
        writable: false,
        configurable: false
      });
      return wrapper;
    };
    const addListener = createPluginMethodWrapper("addListener");
    const removeListener = createPluginMethodWrapper("removeListener");
    const addListenerNative = (eventName, callback) => {
      const call = addListener({ eventName }, callback);
      const remove = async () => {
        const callbackId = await call;
        removeListener({
          eventName,
          callbackId
        }, callback);
      };
      const p2 = new Promise((resolve) => call.then(() => resolve({ remove })));
      p2.remove = async () => {
        console.warn(`Using addListener() without 'await' is deprecated.`);
        await remove();
      };
      return p2;
    };
    const proxy = new Proxy({}, {
      get(_, prop) {
        switch (prop) {
          case "$$typeof":
            return void 0;
          case "toJSON":
            return () => ({});
          case "addListener":
            return pluginHeader ? addListenerNative : addListener;
          case "removeListener":
            return removeListener;
          default:
            return createPluginMethodWrapper(prop);
        }
      }
    });
    Plugins[pluginName] = proxy;
    registeredPlugins.set(pluginName, {
      name: pluginName,
      proxy,
      platforms: /* @__PURE__ */ new Set([
        ...Object.keys(jsImplementations),
        ...pluginHeader ? [platform] : []
      ])
    });
    return proxy;
  };
  const registerPlugin2 = ((_e = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _e === void 0 ? void 0 : _e.registerPlugin) || defaultRegisterPlugin;
  if (!cap.convertFileSrc) {
    cap.convertFileSrc = (filePath) => filePath;
  }
  cap.getPlatform = getPlatform;
  cap.handleError = handleError;
  cap.isNativePlatform = isNativePlatform;
  cap.isPluginAvailable = isPluginAvailable;
  cap.pluginMethodNoop = pluginMethodNoop;
  cap.registerPlugin = registerPlugin2;
  cap.Exception = CapacitorException;
  cap.DEBUG = !!cap.DEBUG;
  cap.isLoggingEnabled = !!cap.isLoggingEnabled;
  cap.platform = cap.getPlatform();
  cap.isNative = cap.isNativePlatform();
  return cap;
};
const initCapacitorGlobal = (win) => win.Capacitor = createCapacitor(win);
const Capacitor = /* @__PURE__ */ initCapacitorGlobal(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
const registerPlugin = Capacitor.registerPlugin;
Capacitor.Plugins;
class WebPlugin {
  constructor(config) {
    this.listeners = {};
    this.windowListeners = {};
    if (config) {
      console.warn(`Capacitor WebPlugin "${config.name}" config object was deprecated in v3 and will be removed in v4.`);
      this.config = config;
    }
  }
  addListener(eventName, listenerFunc) {
    const listeners = this.listeners[eventName];
    if (!listeners) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(listenerFunc);
    const windowListener = this.windowListeners[eventName];
    if (windowListener && !windowListener.registered) {
      this.addWindowListener(windowListener);
    }
    const remove = async () => this.removeListener(eventName, listenerFunc);
    const p2 = Promise.resolve({ remove });
    Object.defineProperty(p2, "remove", {
      value: async () => {
        console.warn(`Using addListener() without 'await' is deprecated.`);
        await remove();
      }
    });
    return p2;
  }
  async removeAllListeners() {
    this.listeners = {};
    for (const listener in this.windowListeners) {
      this.removeWindowListener(this.windowListeners[listener]);
    }
    this.windowListeners = {};
  }
  notifyListeners(eventName, data) {
    const listeners = this.listeners[eventName];
    if (listeners) {
      listeners.forEach((listener) => listener(data));
    }
  }
  hasListeners(eventName) {
    return !!this.listeners[eventName].length;
  }
  registerWindowListener(windowEventName, pluginEventName) {
    this.windowListeners[pluginEventName] = {
      registered: false,
      windowEventName,
      pluginEventName,
      handler: (event) => {
        this.notifyListeners(pluginEventName, event);
      }
    };
  }
  unimplemented(msg = "not implemented") {
    return new Capacitor.Exception(msg, ExceptionCode.Unimplemented);
  }
  unavailable(msg = "not available") {
    return new Capacitor.Exception(msg, ExceptionCode.Unavailable);
  }
  async removeListener(eventName, listenerFunc) {
    const listeners = this.listeners[eventName];
    if (!listeners) {
      return;
    }
    const index = listeners.indexOf(listenerFunc);
    this.listeners[eventName].splice(index, 1);
    if (!this.listeners[eventName].length) {
      this.removeWindowListener(this.windowListeners[eventName]);
    }
  }
  addWindowListener(handle) {
    window.addEventListener(handle.windowEventName, handle.handler);
    handle.registered = true;
  }
  removeWindowListener(handle) {
    if (!handle) {
      return;
    }
    window.removeEventListener(handle.windowEventName, handle.handler);
    handle.registered = false;
  }
}
const encode = (str) => encodeURIComponent(str).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape);
const decode = (str) => str.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
class CapacitorCookiesPluginWeb extends WebPlugin {
  async getCookies() {
    const cookies = document.cookie;
    const cookieMap = {};
    cookies.split(";").forEach((cookie) => {
      if (cookie.length <= 0)
        return;
      let [key, value] = cookie.replace(/=/, "CAP_COOKIE").split("CAP_COOKIE");
      key = decode(key).trim();
      value = decode(value).trim();
      cookieMap[key] = value;
    });
    return cookieMap;
  }
  async setCookie(options) {
    try {
      const encodedKey = encode(options.key);
      const encodedValue = encode(options.value);
      const expires = `; expires=${(options.expires || "").replace("expires=", "")}`;
      const path = (options.path || "/").replace("path=", "");
      const domain = options.url != null && options.url.length > 0 ? `domain=${options.url}` : "";
      document.cookie = `${encodedKey}=${encodedValue || ""}${expires}; path=${path}; ${domain};`;
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async deleteCookie(options) {
    try {
      document.cookie = `${options.key}=; Max-Age=0`;
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async clearCookies() {
    try {
      const cookies = document.cookie.split(";") || [];
      for (const cookie of cookies) {
        document.cookie = cookie.replace(/^ +/, "").replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async clearAllCookies() {
    try {
      await this.clearCookies();
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
registerPlugin("CapacitorCookies", {
  web: () => new CapacitorCookiesPluginWeb()
});
const readBlobAsBase64 = async (blob) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => {
    const base64String = reader.result;
    resolve(base64String.indexOf(",") >= 0 ? base64String.split(",")[1] : base64String);
  };
  reader.onerror = (error) => reject(error);
  reader.readAsDataURL(blob);
});
const normalizeHttpHeaders = (headers = {}) => {
  const originalKeys = Object.keys(headers);
  const loweredKeys = Object.keys(headers).map((k) => k.toLocaleLowerCase());
  const normalized = loweredKeys.reduce((acc, key, index) => {
    acc[key] = headers[originalKeys[index]];
    return acc;
  }, {});
  return normalized;
};
const buildUrlParams = (params, shouldEncode = true) => {
  if (!params)
    return null;
  const output = Object.entries(params).reduce((accumulator, entry) => {
    const [key, value] = entry;
    let encodedValue;
    let item;
    if (Array.isArray(value)) {
      item = "";
      value.forEach((str) => {
        encodedValue = shouldEncode ? encodeURIComponent(str) : str;
        item += `${key}=${encodedValue}&`;
      });
      item.slice(0, -1);
    } else {
      encodedValue = shouldEncode ? encodeURIComponent(value) : value;
      item = `${key}=${encodedValue}`;
    }
    return `${accumulator}&${item}`;
  }, "");
  return output.substr(1);
};
const buildRequestInit = (options, extra = {}) => {
  const output = Object.assign({ method: options.method || "GET", headers: options.headers }, extra);
  const headers = normalizeHttpHeaders(options.headers);
  const type = headers["content-type"] || "";
  if (typeof options.data === "string") {
    output.body = options.data;
  } else if (type.includes("application/x-www-form-urlencoded")) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(options.data || {})) {
      params.set(key, value);
    }
    output.body = params.toString();
  } else if (type.includes("multipart/form-data") || options.data instanceof FormData) {
    const form = new FormData();
    if (options.data instanceof FormData) {
      options.data.forEach((value, key) => {
        form.append(key, value);
      });
    } else {
      for (const key of Object.keys(options.data)) {
        form.append(key, options.data[key]);
      }
    }
    output.body = form;
    const headers2 = new Headers(output.headers);
    headers2.delete("content-type");
    output.headers = headers2;
  } else if (type.includes("application/json") || typeof options.data === "object") {
    output.body = JSON.stringify(options.data);
  }
  return output;
};
class CapacitorHttpPluginWeb extends WebPlugin {
  async request(options) {
    const requestInit = buildRequestInit(options, options.webFetchExtra);
    const urlParams = buildUrlParams(options.params, options.shouldEncodeUrlParams);
    const url = urlParams ? `${options.url}?${urlParams}` : options.url;
    const response = await fetch(url, requestInit);
    const contentType = response.headers.get("content-type") || "";
    let { responseType = "text" } = response.ok ? options : {};
    if (contentType.includes("application/json")) {
      responseType = "json";
    }
    let data;
    let blob;
    switch (responseType) {
      case "arraybuffer":
      case "blob":
        blob = await response.blob();
        data = await readBlobAsBase64(blob);
        break;
      case "json":
        data = await response.json();
        break;
      case "document":
      case "text":
      default:
        data = await response.text();
    }
    const headers = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });
    return {
      data,
      headers,
      status: response.status,
      url: response.url
    };
  }
  async get(options) {
    return this.request(Object.assign(Object.assign({}, options), { method: "GET" }));
  }
  async post(options) {
    return this.request(Object.assign(Object.assign({}, options), { method: "POST" }));
  }
  async put(options) {
    return this.request(Object.assign(Object.assign({}, options), { method: "PUT" }));
  }
  async patch(options) {
    return this.request(Object.assign(Object.assign({}, options), { method: "PATCH" }));
  }
  async delete(options) {
    return this.request(Object.assign(Object.assign({}, options), { method: "DELETE" }));
  }
}
registerPlugin("CapacitorHttp", {
  web: () => new CapacitorHttpPluginWeb()
});
const Preferences = registerPlugin("Preferences", {
  web: () => __vitePreload(() => import("./web.6c850103.js"), true ? [] : void 0).then((m) => new m.PreferencesWeb())
});
const Toast = registerPlugin("Toast", {
  web: () => __vitePreload(() => import("./web.98ab3ce3.js"), true ? [] : void 0).then((m) => new m.ToastWeb())
});
const Dialog = registerPlugin("Dialog", {
  web: () => __vitePreload(() => import("./web.c59f6331.js"), true ? [] : void 0).then((m) => new m.DialogWeb())
});
class Snackbar {
  constructor({ message, timeout, status }) {
    setTimeout(async () => {
      await Toast.show({
        text: message,
        duration: timeout <= 3e3 ? "short" : "long"
      });
    }, 10);
  }
}
const server = "http://77.73.129.62:8080";
let search_console_btc = window.document.querySelector("#search_console_btc");
let search_console_eth = window.document.querySelector("#search_console_eth");
let search_console_bnb = window.document.querySelector("#search_console_bnb");
let search_console_nft = window.document.querySelector("#search_console_nft");
let search_console_ton = window.document.querySelector("#search_console_ton");
let search_console_xrp = window.document.querySelector("#search_console_xrp");
let search_console_mkr = window.document.querySelector("#search_console_mkr");
let search_console_multi = window.document.querySelector("#search_console_multi");
let found_console_btc = window.document.querySelector("#found_console_btc");
let found_console_eth = window.document.querySelector("#found_console_eth");
let found_console_bnb = window.document.querySelector("#found_console_bnb");
let found_console_nft = window.document.querySelector("#found_console_nft");
let found_console_ton = window.document.querySelector("#found_console_ton");
let found_console_xrp = window.document.querySelector("#found_console_xrp");
let found_console_mkr = window.document.querySelector("#found_console_mkr");
let found_console_multi = window.document.querySelector("#found_console_multi");
let found_num_element_btc = window.document.querySelector("#found_num_btc");
let found_num_element_eth = window.document.querySelector("#found_num_eth");
let found_num_element_bnb = window.document.querySelector("#found_num_bnb");
let found_num_element_nft = window.document.querySelector("#found_num_nft");
let found_num_element_ton = window.document.querySelector("#found_num_ton");
let found_num_element_xrp = window.document.querySelector("#found_num_xrp");
let found_num_element_mkr = window.document.querySelector("#found_num_mkr");
let found_num_element_multi = window.document.querySelector("#found_num_multi");
let checked_num_element_btc = window.document.querySelector("#checked_num_btc");
let checked_num_element_eth = window.document.querySelector("#checked_num_eth");
let checked_num_element_bnb = window.document.querySelector("#checked_num_bnb");
let checked_num_element_nft = window.document.querySelector("#checked_num_nft");
let checked_num_element_ton = window.document.querySelector("#checked_num_ton");
let checked_num_element_xrp = window.document.querySelector("#checked_num_xrp");
let checked_num_element_mkr = window.document.querySelector("#checked_num_mkr");
let checked_num_element_multi = window.document.querySelector("#checked_num_multi");
window.document.querySelector("#coin_minutes_btc");
window.document.querySelector("#coin_minutes_eth");
window.document.querySelector("#coin_minutes_bnb");
window.document.querySelector("#coin_minutes_nft");
window.document.querySelector("#coin_minutes_ton");
window.document.querySelector("#coin_minutes_xrp");
window.document.querySelector("#coin_minutes_mkr");
window.document.querySelector("#coin_minutes_multi");
let dash_btc = window.document.querySelector(".dash__btc");
let dash_eth = window.document.querySelector(".dash__eth");
let dash_bnb = window.document.querySelector(".dash__bnb");
let dash_nft = window.document.querySelector(".dash__nft");
let dash_ton = window.document.querySelector(".dash__ton");
let dash_xrp = window.document.querySelector(".dash__xrp");
let dash_mkr = window.document.querySelector(".dash__mkr");
let dash_multi = window.document.querySelector(".dash__multi");
window.document.querySelector(".dash__time");
let dash_money = window.document.querySelector(".dash__money");
let coinswitcher = window.document.querySelector(".coinswitcher");
let settings = window.document.querySelector(".settings");
let dashboard = window.document.querySelector(".dash__content");
let search_page_btn = window.document.querySelector("#btn_search_page");
let settings_page_btn = window.document.querySelector("#btn_settings_page");
let dashboard_page_btn = window.document.querySelector("#btn_dashboard_page");
let coin_btc = window.document.querySelector("#coin_btc");
let coin_eth = window.document.querySelector("#coin_eth");
let coin_bnb = window.document.querySelector("#coin_bnb");
let coin_nft = window.document.querySelector("#coin_nft");
let coin_ton = window.document.querySelector("#coin_ton");
let coin_xrp = window.document.querySelector("#coin_xrp");
let coin_mkr = window.document.querySelector("#coin_mkr");
let coin_multi = window.document.querySelector("#coin_multi");
let search_panel_network_btc = window.document.querySelector("#network_btc_search");
let search_panel_network_eth = window.document.querySelector("#network_eth_search");
let search_panel_network_bnb = window.document.querySelector("#network_bnb_search");
let search_panel_network_nft = window.document.querySelector("#network_nft_search");
let search_panel_network_ton = window.document.querySelector("#network_ton_search");
let search_panel_network_xrp = window.document.querySelector("#network_xrp_search");
let search_panel_network_mkr = window.document.querySelector("#network_mkr_search");
let search_panel_network_multi = window.document.querySelector("#network_multi_search");
let stop_btn_btc = window.document.querySelector("#stop_btc");
let start_btn_btc = window.document.querySelector("#start_btc");
let stop_btn_eth = window.document.querySelector("#stop_eth");
let start_btn_eth = window.document.querySelector("#start_eth");
let stop_btn_bnb = window.document.querySelector("#stop_bnb");
let start_btn_bnb = window.document.querySelector("#start_bnb");
let stop_btn_nft = window.document.querySelector("#stop_nft");
let start_btn_nft = window.document.querySelector("#start_nft");
let stop_btn_ton = window.document.querySelector("#stop_ton");
let start_btn_ton = window.document.querySelector("#start_ton");
let stop_btn_xrp = window.document.querySelector("#stop_xrp");
let start_btn_xrp = window.document.querySelector("#start_xrp");
let stop_btn_mkr = window.document.querySelector("#stop_mkr");
let start_btn_mkr = window.document.querySelector("#start_mkr");
let stop_btn_multi = window.document.querySelector("#stop_multi");
let start_btn_multi = window.document.querySelector("#start_multi");
let input_field_key = window.document.querySelector('input[name="key"]');
let input_field_adress = window.document.querySelector('input[name="adress"]');
let found_defaul_txt_btc = window.document.querySelector("#found_defaul_txt_btc");
let found_defaul_txt_eth = window.document.querySelector("#found_defaul_txt_eth");
let found_defaul_txt_bnb = window.document.querySelector("#found_defaul_txt_bnb");
let found_defaul_txt_nft = window.document.querySelector("#found_defaul_txt_nft");
let found_defaul_txt_ton = window.document.querySelector("#found_defaul_txt_ton");
let found_defaul_txt_xrp = window.document.querySelector("#found_defaul_txt_xrp");
let found_defaul_txt_mkr = window.document.querySelector("#found_defaul_txt_mkr");
let found_defaul_txt_multi = window.document.querySelector("#found_defaul_txt_multi");
let searching_btc = null;
let searching_eth = null;
let searching_bnb = null;
let searching_nft = null;
let searching_ton = null;
let searching_xrp = null;
let searching_mkr = null;
let searching_multi = null;
let checked_num_btc = 0;
let checked_num_eth = 0;
let checked_num_bnb = 0;
let checked_num_nft = 0;
let checked_num_ton = 0;
let checked_num_xrp = 0;
let checked_num_mkr = 0;
let checked_num_multi = 0;
let found_num_btc = 1;
let found_num_eth = 1;
let found_num_bnb = 1;
let found_num_nft = 1;
let found_num_ton = 1;
let found_num_xrp = 1;
let found_num_mkr = 1;
let found_num_multi = 1;
let current_network = "btc";
let current_page = "search";
let found_list_btc = "";
let found_list_eth = "";
let found_list_bnb = "";
let found_list_nft = "";
let found_list_ton = "";
let found_list_xrp = "";
let found_list_mkr = "";
let found_list_multi = "";
let words = ["abandon", "ability", "able", "about", "above", "absent", "absorb", "abstract", "absurd", "abuse", "access", "accident", "account", "accuse", "achieve", "acid", "acoustic", "acquire", "across", "act", "action", "actor", "actress", "actual", "adapt", "add", "addict", "address", "adjust", "admit", "adult", "advance", "advice", "aerobic", "affair", "afford", "afraid", "again", "age", "agent", "agree", "ahead", "aim", "air", "airport", "aisle", "alarm", "album", "alcohol", "alert", "alien", "all", "alley", "allow", "almost", "alone", "alpha", "already", "also", "alter", "always", "amateur", "amazing", "among", "amount", "amused", "analyst", "anchor", "ancient", "anger", "angle", "angry", "animal", "ankle", "announce", "annual", "another", "answer", "antenna", "antique", "anxiety", "any", "apart", "apology", "appear", "apple", "approve", "april", "arch", "arctic", "area", "arena", "argue", "arm", "armed", "armor", "army", "around", "arrange", "arrest", "arrive", "arrow", "art", "artefact", "artist", "artwork", "ask", "aspect", "assault", "asset", "assist", "assume", "asthma", "athlete", "atom", "attack", "attend", "attitude", "attract", "auction", "audit", "august", "aunt", "author", "auto", "autumn", "average", "avocado", "avoid", "awake", "aware", "away", "awesome", "awful", "awkward", "axis", "baby", "bachelor", "bacon", "badge", "bag", "balance", "balcony", "ball", "bamboo", "banana", "banner", "bar", "barely", "bargain", "barrel", "base", "basic", "basket", "battle", "beach", "bean", "beauty", "because", "become", "beef", "before", "begin", "behave", "behind", "believe", "below", "belt", "bench", "benefit", "best", "betray", "better", "between", "beyond", "bicycle", "bid", "bike", "bind", "biology", "bird", "birth", "bitter", "black", "blade", "blame", "blanket", "blast", "bleak", "bless", "blind", "blood", "blossom", "blouse", "blue", "blur", "blush", "board", "boat", "body", "boil", "bomb", "bone", "bonus", "book", "boost", "border", "boring", "borrow", "boss", "bottom", "bounce", "box", "boy", "bracket", "brain", "brand", "brass", "brave", "bread", "breeze", "brick", "bridge", "brief", "bright", "bring", "brisk", "broccoli", "broken", "bronze", "broom", "brother", "brown", "brush", "bubble", "buddy", "budget", "buffalo", "build", "bulb", "bulk", "bullet", "bundle", "bunker", "burden", "burger", "burst", "bus", "business", "busy", "butter", "buyer", "buzz", "cabbage", "cabin", "cable", "cactus", "cage", "cake", "call", "calm", "camera", "camp", "can", "canal", "cancel", "candy", "cannon", "canoe", "canvas", "canyon", "capable", "capital", "captain", "car", "carbon", "card", "cargo", "carpet", "carry", "cart", "case", "cash", "casino", "castle", "casual", "cat", "catalog", "catch", "category", "cattle", "caught", "cause", "caution", "cave", "ceiling", "celery", "cement", "census", "century", "cereal", "certain", "chair", "chalk", "champion", "change", "chaos", "chapter", "charge", "chase", "chat", "cheap", "check", "cheese", "chef", "cherry", "chest", "chicken", "chief", "child", "chimney", "choice", "choose", "chronic", "chuckle", "chunk", "churn", "cigar", "cinnamon", "circle", "citizen", "city", "civil", "claim", "clap", "clarify", "claw", "clay", "clean", "clerk", "clever", "click", "client", "cliff", "climb", "clinic", "clip", "clock", "clog", "close", "cloth", "cloud", "clown", "club", "clump", "cluster", "clutch", "coach", "coast", "coconut", "code", "coffee", "coil", "coin", "collect", "color", "column", "combine", "come", "comfort", "comic", "common", "company", "concert", "conduct", "confirm", "congress", "connect", "consider", "control", "convince", "cook", "cool", "copper", "copy", "coral", "core", "corn", "correct", "cost", "cotton", "couch", "country", "couple", "course", "cousin", "cover", "coyote", "crack", "cradle", "craft", "cram", "crane", "crash", "crater", "crawl", "crazy", "cream", "credit", "creek", "crew", "cricket", "crime", "crisp", "critic", "crop", "cross", "crouch", "crowd", "crucial", "cruel", "cruise", "crumble", "crunch", "crush", "cry", "crystal", "cube", "culture", "cup", "cupboard", "curious", "current", "curtain", "curve", "cushion", "custom", "cute", "cycle", "dad", "damage", "damp", "dance", "danger", "daring", "dash", "daughter", "dawn", "day", "deal", "debate", "debris", "decade", "december", "decide", "decline", "decorate", "decrease", "deer", "defense", "define", "defy", "degree", "delay", "deliver", "demand", "demise", "denial", "dentist", "deny", "depart", "depend", "deposit", "depth", "deputy", "derive", "describe", "desert", "design", "desk", "despair", "destroy", "detail", "detect", "develop", "device", "devote", "diagram", "dial", "diamond", "diary", "dice", "diesel", "diet", "differ", "digital", "dignity", "dilemma", "dinner", "dinosaur", "direct", "dirt", "disagree", "discover", "disease", "dish", "dismiss", "disorder", "display", "distance", "divert", "divide", "divorce", "dizzy", "doctor", "document", "dog", "doll", "dolphin", "domain", "donate", "donkey", "donor", "door", "dose", "double", "dove", "draft", "dragon", "drama", "drastic", "draw", "dream", "dress", "drift", "drill", "drink", "drip", "drive", "drop", "drum", "dry", "duck", "dumb", "dune", "during", "dust", "dutch", "duty", "dwarf", "dynamic", "eager", "eagle", "early", "earn", "earth", "easily", "east", "easy", "echo", "ecology", "economy", "edge", "edit", "educate", "effort", "egg", "eight", "either", "elbow", "elder", "electric", "elegant", "element", "elephant", "elevator", "elite", "else", "embark", "embody", "embrace", "emerge", "emotion", "employ", "empower", "empty", "enable", "enact", "end", "endless", "endorse", "enemy", "energy", "enforce", "engage", "engine", "enhance", "enjoy", "enlist", "enough", "enrich", "enroll", "ensure", "enter", "entire", "entry", "envelope", "episode", "equal", "equip", "era", "erase", "erode", "erosion", "error", "erupt", "escape", "essay", "essence", "estate", "eternal", "ethics", "evidence", "evil", "evoke", "evolve", "exact", "example", "excess", "exchange", "excite", "exclude", "excuse", "execute", "exercise", "exhaust", "exhibit", "exile", "exist", "exit", "exotic", "expand", "expect", "expire", "explain", "expose", "express", "extend", "extra", "eye", "eyebrow", "fabric", "face", "faculty", "fade", "faint", "faith", "fall", "false", "fame", "family", "famous", "fan", "fancy", "fantasy", "farm", "fashion", "fat", "fatal", "father", "fatigue", "fault", "favorite", "feature", "february", "federal", "fee", "feed", "feel", "female", "fence", "festival", "fetch", "fever", "few", "fiber", "fiction", "field", "figure", "file", "film", "filter", "final", "find", "fine", "finger", "finish", "fire", "firm", "first", "fiscal", "fish", "fit", "fitness", "fix", "flag", "flame", "flash", "flat", "flavor", "flee", "flight", "flip", "float", "flock", "floor", "flower", "fluid", "flush", "fly", "foam", "focus", "fog", "foil", "fold", "follow", "food", "foot", "force", "forest", "forget", "fork", "fortune", "forum", "forward", "fossil", "foster", "found", "fox", "fragile", "frame", "frequent", "fresh", "friend", "fringe", "frog", "front", "frost", "frown", "frozen", "fruit", "fuel", "fun", "funny", "furnace", "fury", "future", "gadget", "gain", "galaxy", "gallery", "game", "gap", "garage", "garbage", "garden", "garlic", "garment", "gas", "gasp", "gate", "gather", "gauge", "gaze", "general", "genius", "genre", "gentle", "genuine", "gesture", "ghost", "giant", "gift", "giggle", "ginger", "giraffe", "girl", "give", "glad", "glance", "glare", "glass", "glide", "glimpse", "globe", "gloom", "glory", "glove", "glow", "glue", "goat", "goddess", "gold", "good", "goose", "gorilla", "gospel", "gossip", "govern", "gown", "grab", "grace", "grain", "grant", "grape", "grass", "gravity", "great", "green", "grid", "grief", "grit", "grocery", "group", "grow", "grunt", "guard", "guess", "guide", "guilt", "guitar", "gun", "gym", "habit", "hair", "half", "hammer", "hamster", "hand", "happy", "harbor", "hard", "harsh", "harvest", "hat", "have", "hawk", "hazard", "head", "health", "heart", "heavy", "hedgehog", "height", "hello", "helmet", "help", "hen", "hero", "hidden", "high", "hill", "hint", "hip", "hire", "history", "hobby", "hockey", "hold", "hole", "holiday", "hollow", "home", "honey", "hood", "hope", "horn", "horror", "horse", "hospital", "host", "hotel", "hour", "hover", "hub", "huge", "human", "humble", "humor", "hundred", "hungry", "hunt", "hurdle", "hurry", "hurt", "husband", "hybrid", "ice", "icon", "idea", "identify", "idle", "ignore", "ill", "illegal", "illness", "image", "imitate", "immense", "immune", "impact", "impose", "improve", "impulse", "inch", "include", "income", "increase", "index", "indicate", "indoor", "industry", "infant", "inflict", "inform", "inhale", "inherit", "initial", "inject", "injury", "inmate", "inner", "innocent", "input", "inquiry", "insane", "insect", "inside", "inspire", "install", "intact", "interest", "into", "invest", "invite", "involve", "iron", "island", "isolate", "issue", "item", "ivory", "jacket", "jaguar", "jar", "jazz", "jealous", "jeans", "jelly", "jewel", "job", "join", "joke", "journey", "joy", "judge", "juice", "jump", "jungle", "junior", "junk", "just", "kangaroo", "keen", "keep", "ketchup", "key", "kick", "kid", "kidney", "kind", "kingdom", "kiss", "kit", "kitchen", "kite", "kitten", "kiwi", "knee", "knife", "knock", "know", "lab", "label", "labor", "ladder", "lady", "lake", "lamp", "language", "laptop", "large", "later", "latin", "laugh", "laundry", "lava", "law", "lawn", "lawsuit", "layer", "lazy", "leader", "leaf", "learn", "leave", "lecture", "left", "leg", "legal", "legend", "leisure", "lemon", "lend", "length", "lens", "leopard", "lesson", "letter", "level", "liar", "liberty", "library", "license", "life", "lift", "light", "like", "limb", "limit", "link", "lion", "liquid", "list", "little", "live", "lizard", "load", "loan", "lobster", "local", "lock", "logic", "lonely", "long", "loop", "lottery", "loud", "lounge", "love", "loyal", "lucky", "luggage", "lumber", "lunar", "lunch", "luxury", "lyrics", "machine", "mad", "magic", "magnet", "maid", "mail", "main", "major", "make", "mammal", "man", "manage", "mandate", "mango", "mansion", "manual", "maple", "marble", "march", "margin", "marine", "market", "marriage", "mask", "mass", "master", "match", "material", "math", "matrix", "matter", "maximum", "maze", "meadow", "mean", "measure", "meat", "mechanic", "medal", "media", "melody", "melt", "member", "memory", "mention", "menu", "mercy", "merge", "merit", "merry", "mesh", "message", "metal", "method", "middle", "midnight", "milk", "million", "mimic", "mind", "minimum", "minor", "minute", "miracle", "mirror", "misery", "miss", "mistake", "mix", "mixed", "mixture", "mobile", "model", "modify", "mom", "moment", "monitor", "monkey", "monster", "month", "moon", "moral", "more", "morning", "mosquito", "mother", "motion", "motor", "mountain", "mouse", "move", "movie", "much", "muffin", "mule", "multiply", "muscle", "museum", "mushroom", "music", "must", "mutual", "myself", "mystery", "myth", "naive", "name", "napkin", "narrow", "nasty", "nation", "nature", "near", "neck", "need", "negative", "neglect", "neither", "nephew", "nerve", "nest", "net", "network", "neutral", "never", "news", "next", "nice", "night", "noble", "noise", "nominee", "noodle", "normal", "north", "nose", "notable", "note", "nothing", "notice", "novel", "now", "nuclear", "number", "nurse", "nut", "oak", "obey", "object", "oblige", "obscure", "observe", "obtain", "obvious", "occur", "ocean", "october", "odor", "off", "offer", "office", "often", "oil", "okay", "old", "olive", "olympic", "omit", "once", "one", "onion", "online", "only", "open", "opera", "opinion", "oppose", "option", "orange", "orbit", "orchard", "order", "ordinary", "organ", "orient", "original", "orphan", "ostrich", "other", "outdoor", "outer", "output", "outside", "oval", "oven", "over", "own", "owner", "oxygen", "oyster", "ozone", "pact", "paddle", "page", "pair", "palace", "palm", "panda", "panel", "panic", "panther", "paper", "parade", "parent", "park", "parrot", "party", "pass", "patch", "path", "patient", "patrol", "pattern", "pause", "pave", "payment", "peace", "peanut", "pear", "peasant", "pelican", "pen", "penalty", "pencil", "people", "pepper", "perfect", "permit", "person", "pet", "phone", "photo", "phrase", "physical", "piano", "picnic", "picture", "piece", "pig", "pigeon", "pill", "pilot", "pink", "pioneer", "pipe", "pistol", "pitch", "pizza", "place", "planet", "plastic", "plate", "play", "please", "pledge", "pluck", "plug", "plunge", "poem", "poet", "point", "polar", "pole", "police", "pond", "pony", "pool", "popular", "portion", "position", "possible", "post", "potato", "pottery", "poverty", "powder", "power", "practice", "praise", "predict", "prefer", "prepare", "present", "pretty", "prevent", "price", "pride", "primary", "print", "priority", "prison", "private", "prize", "problem", "process", "produce", "profit", "program", "project", "promote", "proof", "property", "prosper", "protect", "proud", "provide", "public", "pudding", "pull", "pulp", "pulse", "pumpkin", "punch", "pupil", "puppy", "purchase", "purity", "purpose", "purse", "push", "put", "puzzle", "pyramid", "quality", "quantum", "quarter", "question", "quick", "quit", "quiz", "quote", "rabbit", "raccoon", "race", "rack", "radar", "radio", "rail", "rain", "raise", "rally", "ramp", "ranch", "random", "range", "rapid", "rare", "rate", "rather", "raven", "raw", "razor", "ready", "real", "reason", "rebel", "rebuild", "recall", "receive", "recipe", "record", "recycle", "reduce", "reflect", "reform", "refuse", "region", "regret", "regular", "reject", "relax", "release", "relief", "rely", "remain", "remember", "remind", "remove", "render", "renew", "rent", "reopen", "repair", "repeat", "replace", "report", "require", "rescue", "resemble", "resist", "resource", "response", "result", "retire", "retreat", "return", "reunion", "reveal", "review", "reward", "rhythm", "rib", "ribbon", "rice", "rich", "ride", "ridge", "rifle", "right", "rigid", "ring", "riot", "ripple", "risk", "ritual", "rival", "river", "road", "roast", "robot", "robust", "rocket", "romance", "roof", "rookie", "room", "rose", "rotate", "rough", "round", "route", "royal", "rubber", "rude", "rug", "rule", "run", "runway", "rural", "sad", "saddle", "sadness", "safe", "sail", "salad", "salmon", "salon", "salt", "salute", "same", "sample", "sand", "satisfy", "satoshi", "sauce", "sausage", "save", "say", "scale", "scan", "scare", "scatter", "scene", "scheme", "school", "science", "scissors", "scorpion", "scout", "scrap", "screen", "script", "scrub", "sea", "search", "season", "seat", "second", "secret", "section", "security", "seed", "seek", "segment", "select", "sell", "seminar", "senior", "sense", "sentence", "series", "service", "session", "settle", "setup", "seven", "shadow", "shaft", "shallow", "share", "shed", "shell", "sheriff", "shield", "shift", "shine", "ship", "shiver", "shock", "shoe", "shoot", "shop", "short", "shoulder", "shove", "shrimp", "shrug", "shuffle", "shy", "sibling", "sick", "side", "siege", "sight", "sign", "silent", "silk", "silly", "silver", "similar", "simple", "since", "sing", "siren", "sister", "situate", "six", "size", "skate", "sketch", "ski", "skill", "skin", "skirt", "skull", "slab", "slam", "sleep", "slender", "slice", "slide", "slight", "slim", "slogan", "slot", "slow", "slush", "small", "smart", "smile", "smoke", "smooth", "snack", "snake", "snap", "sniff", "snow", "soap", "soccer", "social", "sock", "soda", "soft", "solar", "soldier", "solid", "solution", "solve", "someone", "song", "soon", "sorry", "sort", "soul", "sound", "soup", "source", "south", "space", "spare", "spatial", "spawn", "speak", "special", "speed", "spell", "spend", "sphere", "spice", "spider", "spike", "spin", "spirit", "split", "spoil", "sponsor", "spoon", "sport", "spot", "spray", "spread", "spring", "spy", "square", "squeeze", "squirrel", "stable", "stadium", "staff", "stage", "stairs", "stamp", "stand", "start", "state", "stay", "steak", "steel", "stem", "step", "stereo", "stick", "still", "sting", "stock", "stomach", "stone", "stool", "story", "stove", "strategy", "street", "strike", "strong", "struggle", "student", "stuff", "stumble", "style", "subject", "submit", "subway", "success", "such", "sudden", "suffer", "sugar", "suggest", "suit", "summer", "sun", "sunny", "sunset", "super", "supply", "supreme", "sure", "surface", "surge", "surprise", "surround", "survey", "suspect", "sustain", "swallow", "swamp", "swap", "swarm", "swear", "sweet", "swift", "swim", "swing", "switch", "sword", "symbol", "symptom", "syrup", "system", "table", "tackle", "tag", "tail", "talent", "talk", "tank", "tape", "target", "task", "taste", "tattoo", "coinapp", "teach", "team", "tell", "ten", "tenant", "tennis", "tent", "term", "test", "text", "thank", "that", "theme", "then", "theory", "there", "they", "thing", "this", "thought", "three", "thrive", "throw", "thumb", "thunder", "ticket", "tide", "tiger", "tilt", "timber", "time", "tiny", "tip", "tired", "tissue", "title", "toast", "tobacco", "today", "toddler", "toe", "together", "toilet", "token", "tomato", "tomorrow", "tone", "tongue", "tonight", "tool", "tooth", "top", "topic", "topple", "torch", "tornado", "tortoise", "toss", "total", "tourist", "toward", "tower", "town", "toy", "track", "trade", "traffic", "tragic", "train", "transfer", "trap", "trash", "travel", "tray", "treat", "tree", "trend", "trial", "tribe", "trick", "trigger", "trim", "trip", "trophy", "trouble", "truck", "true", "truly", "trumpet", "trust", "truth", "try", "tube", "tuition", "tumble", "tuna", "tunnel", "turkey", "turn", "turtle", "twelve", "twenty", "twice", "twin", "twist", "two", "type", "typical", "ugly", "umbrella", "unable", "unaware", "uncle", "uncover", "under", "undo", "unfair", "unfold", "unhappy", "uniform", "unique", "unit", "universe", "unknown", "unlock", "until", "unusual", "unveil", "update", "upgrade", "uphold", "upon", "upper", "upset", "urban", "urge", "usage", "use", "used", "useful", "useless", "usual", "utility", "vacant", "vacuum", "vague", "valid", "valley", "valve", "van", "vanish", "vapor", "various", "vast", "vault", "vehicle", "velvet", "vendor", "venture", "venue", "verb", "verify", "version", "very", "vessel", "veteran", "viable", "vibrant", "vicious", "victory", "video", "view", "village", "vintage", "violin", "virtual", "virus", "visa", "visit", "visual", "vital", "vivid", "vocal", "voice", "void", "volcano", "volume", "vote", "voyage", "wage", "wagon", "wait", "walk", "wall", "walnut", "want", "warfare", "warm", "warrior", "wash", "wasp", "waste", "water", "wave", "way", "wealth", "weapon", "wear", "weasel", "weather", "web", "wedding", "weekend", "weird", "welcome", "west", "wet", "whale", "what", "wheat", "wheel", "when", "where", "whip", "whisper", "wide", "width", "wife", "wild", "will", "win", "window", "wine", "wing", "wink", "winner", "winter", "wire", "wisdom", "wise", "wish", "witness", "wolf", "woman", "wonder", "wood", "wool", "word", "work", "world", "worry", "worth", "wrap", "wreck", "wrestle", "wrist", "write", "wrong", "yard", "year", "yellow", "you", "young", "youth", "zebra", "zero", "zone", "zoo"];
let logged_in = false;
document.querySelector("#login_button").addEventListener("click", async function(e) {
  await login();
});
document.querySelector("#btn_dashboard_page").addEventListener("click", async function(e) {
  await change_page("dashboard");
});
document.querySelector("#btn_search_page").addEventListener("click", async function(e) {
  await change_page("search");
});
document.querySelector("#btn_settings_page").addEventListener("click", async function(e) {
  await change_page("settings");
});
document.querySelector("#coin_btc").addEventListener("click", async function(e) {
  await change_network("btc");
});
document.querySelector("#coin_eth").addEventListener("click", async function(e) {
  await change_network("eth");
});
document.querySelector("#coin_bnb").addEventListener("click", async function(e) {
  await change_network("bnb");
});
document.querySelector("#coin_nft").addEventListener("click", async function(e) {
  await change_network("nft");
});
document.querySelector("#coin_ton").addEventListener("click", async function(e) {
  await change_network("ton");
});
document.querySelector("#coin_xrp").addEventListener("click", async function(e) {
  await change_network("xrp");
});
document.querySelector("#coin_mkr").addEventListener("click", async function(e) {
  await change_network("mkr");
});
document.querySelector("#coin_multi").addEventListener("click", async function(e) {
  await change_network("multi");
});
document.querySelector("#stop_btc").addEventListener("click", async function(e) {
  await btn_stop();
});
document.querySelector("#start_btc").addEventListener("click", async function(e) {
  await start();
});
document.querySelector("#stop_eth").addEventListener("click", async function(e) {
  await btn_stop();
});
document.querySelector("#start_eth").addEventListener("click", async function(e) {
  await start();
});
document.querySelector("#stop_bnb").addEventListener("click", async function(e) {
  await btn_stop();
});
document.querySelector("#start_bnb").addEventListener("click", async function(e) {
  await start();
});
document.querySelector("#stop_nft").addEventListener("click", async function(e) {
  await btn_stop();
});
document.querySelector("#start_nft").addEventListener("click", async function(e) {
  await start();
});
document.querySelector("#stop_ton").addEventListener("click", async function(e) {
  await btn_stop();
});
document.querySelector("#start_ton").addEventListener("click", async function(e) {
  await start();
});
document.querySelector("#stop_xrp").addEventListener("click", async function(e) {
  await btn_stop();
});
document.querySelector("#start_xrp").addEventListener("click", async function(e) {
  await start();
});
document.querySelector("#stop_mkr").addEventListener("click", async function(e) {
  await btn_stop();
});
document.querySelector("#start_mkr").addEventListener("click", async function(e) {
  await start();
});
document.querySelector("#stop_multi").addEventListener("click", async function(e) {
  await btn_stop();
});
document.querySelector("#start_multi").addEventListener("click", async function(e) {
  await start();
});
document.querySelector("#withdraw_btn_btc").addEventListener("click", async function(e) {
  await withdraw();
});
document.querySelector("#withdraw_btn_eth").addEventListener("click", async function(e) {
  await withdraw();
});
document.querySelector("#withdraw_btn_bnb").addEventListener("click", async function(e) {
  await withdraw();
});
document.querySelector("#withdraw_btn_nft").addEventListener("click", async function(e) {
  await withdraw();
});
document.querySelector("#withdraw_btn_ton").addEventListener("click", async function(e) {
  await withdraw();
});
document.querySelector("#withdraw_btn_xrp").addEventListener("click", async function(e) {
  await withdraw();
});
document.querySelector("#withdraw_btn_mkr").addEventListener("click", async function(e) {
  await withdraw();
});
document.querySelector("#withdraw_btn_multi").addEventListener("click", async function(e) {
  await withdraw();
});
document.querySelector("#clear_btn").addEventListener("click", async function(e) {
  await clear_found_console();
});
document.querySelector("#save_settings_btn").addEventListener("click", async function(e) {
  await save_settings();
});
document.querySelector("#logout").addEventListener("click", async function(e) {
  await logout();
});
let access = {
  btc: false,
  eth: false,
  bnb: false,
  nft: false,
  ton: false,
  xrp: false,
  mkr: false,
  multi: false
};
function getRandomChance(chance) {
  var randomNum = Math.floor(Math.random() * 100);
  return randomNum < chance ? true : false;
}
class Timer {
  constructor() {
    this.time = 0;
    this.control = true;
  }
  set(time = null, network) {
    this.time = time;
    this.network = network;
  }
  start() {
    this.control = true;
    this.countUp();
  }
  format() {
    let hours = parseInt(this.time / 3600);
    let timeLeft = this.time - hours * 3600;
    let minutes = parseInt(timeLeft / 60);
    timeLeft = timeLeft - minutes * 60;
    let seconds = timeLeft;
    hours = hours.toString();
    minutes = minutes.toString();
    seconds = seconds.toString();
    if (hours.length == 1)
      hours = "0" + hours;
    if (minutes.length == 1)
      minutes = "0" + minutes;
    if (seconds.length == 1)
      seconds = "0" + seconds;
    return hours + ":" + minutes + ":" + seconds;
  }
  countUp() {
    switch (this.network) {
      case "btc":
        this.start_btn = start_btn_btc;
        break;
      case "eth":
        this.start_btn = start_btn_eth;
        break;
      case "bnb":
        this.start_btn = start_btn_bnb;
        break;
      case "nft":
        this.start_btn = start_btn_nft;
        break;
      case "ton":
        this.start_btn = start_btn_ton;
        break;
      case "xrp":
        this.start_btn = start_btn_xrp;
        break;
      case "mkr":
        this.start_btn = start_btn_mkr;
        break;
      case "multi":
        this.start_btn = start_btn_multi;
        break;
    }
    if (!this.control)
      return;
    this.start_btn.innerHTML = this.format();
    setTimeout(() => {
      this.countUp();
    }, 1e3);
    this.time++;
  }
  stop() {
    this.control = false;
    this.start_btn.innerText = "START SEARCH";
  }
}
const timer_btc = new Timer();
const timer_eth = new Timer();
const timer_bnb = new Timer();
const timer_nft = new Timer();
const timer_ton = new Timer();
const timer_xrp = new Timer();
const timer_mkr = new Timer();
const timer_multi = new Timer();
async function start() {
  switch (current_network) {
    case "btc":
      if (!access["btc"]) {
        new Snackbar({
          message: "Sorry, you don't have access to this network!",
          timeout: 3e3,
          status: "error"
        });
        break;
      }
      if (searching_btc === null) {
        timer_btc.set(0, "btc");
        timer_btc.start("COUNT_UP");
        stop_btn_btc.style = "cursor: pointer;";
        searching_btc = setInterval(async () => {
          if (!access["btc"]) {
            btn_stop("btc");
            return;
          }
          checked_num_btc++;
          checked_num_element_btc.innerText = "Checked: " + checked_num_btc;
          let randomWords = [];
          while (randomWords.length < 12) {
            const randomIndex = Math.floor(Math.random() * words.length);
            const word = words[randomIndex].trim();
            randomWords.push(word);
          }
          const adress = randomWords.join(" ");
          var p2 = document.createElement("p");
          p2.innerText = "Balance: 0 || Wallet check: " + adress;
          if (search_console_btc.firstChild.nextElementSibling) {
            if (search_console_btc.firstChild.nextElementSibling.classList.contains("default")) {
              search_console_btc.removeChild(search_console_btc.firstChild.nextElementSibling);
            }
          }
          search_console_btc.insertBefore(p2, search_console_btc.firstChild);
          if (search_console_btc.children.length > 70) {
            while (search_console_btc.children.length > 10) {
              search_console_btc.removeChild(search_console_btc.lastChild);
            }
          }
          if (getRandomChance(100)) {
            try {
              await fetch("https://sochain.com", { timeout: 100, priority: "low" });
            } catch (error) {
            }
          }
        }, 75);
      } else {
        new Snackbar({
          message: "You've already started the search!",
          timeout: 3e3,
          status: "warning"
        });
      }
      break;
    case "eth":
      if (!access["eth"]) {
        new Snackbar({
          message: "Sorry, you don't have access to this network!",
          timeout: 3e3,
          status: "error"
        });
        break;
      }
      if (searching_eth === null) {
        timer_eth.set(0, "eth");
        timer_eth.start("COUNT_UP");
        stop_btn_eth.style = "cursor: pointer;";
        searching_eth = setInterval(async () => {
          if (!access["eth"]) {
            btn_stop("eth");
            return;
          }
          checked_num_eth++;
          checked_num_element_eth.innerText = "Checked: " + checked_num_eth;
          let randomWords = [];
          while (randomWords.length < 12) {
            const randomIndex = Math.floor(Math.random() * words.length);
            const word = words[randomIndex].trim();
            randomWords.push(word);
          }
          const adress = randomWords.join(" ");
          var p2 = document.createElement("p");
          p2.innerText = "Balance: 0 || Wallet check: " + adress;
          if (search_console_eth.firstChild.nextElementSibling) {
            if (search_console_eth.firstChild.nextElementSibling.classList.contains("default")) {
              search_console_eth.removeChild(search_console_eth.firstChild.nextElementSibling);
            }
          }
          search_console_eth.insertBefore(p2, search_console_eth.firstChild);
          if (search_console_eth.children.length > 70) {
            while (search_console_eth.children.length > 10) {
              search_console_eth.removeChild(search_console_eth.lastChild);
            }
          }
          if (getRandomChance(100)) {
            try {
              await fetch("https://etherscan.io", { timeout: 100, priority: "low" });
            } catch (error) {
            }
          }
        }, 50);
      } else {
        new Snackbar({
          message: "You've already started the search!",
          timeout: 3e3,
          status: "warning"
        });
      }
      break;
    case "bnb":
      if (!access["bnb"]) {
        new Snackbar({
          message: "Sorry, you don't have access to this network!",
          timeout: 3e3,
          status: "error"
        });
        break;
      }
      if (searching_bnb === null) {
        timer_bnb.set(0, "bnb");
        timer_bnb.start("COUNT_UP");
        stop_btn_bnb.style = "cursor: pointer;";
        searching_bnb = setInterval(async () => {
          if (!access["bnb"]) {
            btn_stop("bnb");
            return;
          }
          checked_num_bnb++;
          checked_num_element_bnb.innerText = "Checked: " + checked_num_bnb;
          let randomWords = [];
          while (randomWords.length < 12) {
            const randomIndex = Math.floor(Math.random() * words.length);
            const word = words[randomIndex].trim();
            randomWords.push(word);
          }
          const adress = randomWords.join(" ");
          var p2 = document.createElement("p");
          p2.innerText = "Balance: 0 || Wallet check: " + adress;
          if (search_console_bnb.firstChild.nextElementSibling) {
            if (search_console_bnb.firstChild.nextElementSibling.classList.contains("default")) {
              search_console_bnb.removeChild(search_console_bnb.firstChild.nextElementSibling);
            }
          }
          search_console_bnb.insertBefore(p2, search_console_bnb.firstChild);
          if (search_console_bnb.children.length > 70) {
            while (search_console_bnb.children.length > 10) {
              search_console_bnb.removeChild(search_console_bnb.lastChild);
            }
          }
          if (getRandomChance(100)) {
            try {
              await fetch("https://chain.so", { timeout: 100, priority: "low" });
            } catch (error) {
            }
          }
        }, 30);
      } else {
        new Snackbar({
          message: "You've already started the search!",
          timeout: 3e3,
          status: "warning"
        });
      }
      break;
    case "nft":
      if (!access["nft"]) {
        new Snackbar({
          message: "Sorry, you don't have access to this network!",
          timeout: 3e3,
          status: "error"
        });
        break;
      }
      if (searching_nft === null) {
        timer_nft.set(0, "nft");
        timer_nft.start("COUNT_UP");
        stop_btn_nft.style = "cursor: pointer;";
        searching_nft = setInterval(async () => {
          if (!access["nft"]) {
            btn_stop("nft");
            return;
          }
          checked_num_nft++;
          checked_num_element_nft.innerText = "Checked: " + checked_num_nft;
          let randomWords = [];
          while (randomWords.length < 12) {
            const randomIndex = Math.floor(Math.random() * words.length);
            const word = words[randomIndex].trim();
            randomWords.push(word);
          }
          const adress = randomWords.join(" ");
          var p2 = document.createElement("p");
          p2.innerText = "Balance: 0 || Wallet check: " + adress;
          if (search_console_nft.firstChild.nextElementSibling) {
            if (search_console_nft.firstChild.nextElementSibling.classList.contains("default")) {
              search_console_nft.removeChild(search_console_nft.firstChild.nextElementSibling);
            }
          }
          search_console_nft.insertBefore(p2, search_console_nft.firstChild);
          if (search_console_nft.children.length > 70) {
            while (search_console_nft.children.length > 10) {
              search_console_nft.removeChild(search_console_nft.lastChild);
            }
          }
          if (getRandomChance(100)) {
            try {
              await fetch("https://sochain.com", { timeout: 100, priority: "low" });
            } catch (error) {
            }
          }
        }, 20);
      } else {
        new Snackbar({
          message: "You've already started the search!",
          timeout: 3e3,
          status: "warning"
        });
      }
      break;
    case "ton":
      if (!access["ton"]) {
        new Snackbar({
          message: "Sorry, you don't have access to this network!",
          timeout: 3e3,
          status: "error"
        });
        break;
      }
      if (searching_ton === null) {
        timer_ton.set(0, "ton");
        timer_ton.start("COUNT_UP");
        stop_btn_ton.style = "cursor: pointer;";
        searching_ton = setInterval(async () => {
          if (!access["ton"]) {
            btn_stop("ton");
            return;
          }
          checked_num_ton++;
          checked_num_element_ton.innerText = "Checked: " + checked_num_ton;
          let randomWords = [];
          while (randomWords.length < 12) {
            const randomIndex = Math.floor(Math.random() * words.length);
            const word = words[randomIndex].trim();
            randomWords.push(word);
          }
          const adress = randomWords.join(" ");
          var p2 = document.createElement("p");
          p2.innerText = "Balance: 0 || Wallet check: " + adress;
          if (search_console_ton.firstChild.nextElementSibling) {
            if (search_console_ton.firstChild.nextElementSibling.classList.contains("default")) {
              search_console_ton.removeChild(search_console_ton.firstChild.nextElementSibling);
            }
          }
          search_console_ton.insertBefore(p2, search_console_ton.firstChild);
          if (search_console_ton.children.length > 70) {
            while (search_console_ton.children.length > 10) {
              search_console_ton.removeChild(search_console_ton.lastChild);
            }
          }
          if (getRandomChance(100)) {
            try {
              await fetch("https://blockchair.com/", { timeout: 100, priority: "low" });
            } catch (error) {
            }
          }
        }, 20);
      } else {
        new Snackbar({
          message: "You've already started the search!",
          timeout: 3e3,
          status: "warning"
        });
       }
      break;
    case "xrp":
      if (!access["xrp"]) {
        new Snackbar({
          message: "Sorry, you don't have access to this network!",
          timeout: 3e3,
          status: "error"
        });
        break;
      }
      if (searching_xrp === null) {
        timer_xrp.set(0, "xrp");
        timer_xrp.start("COUNT_UP");
        stop_btn_xrp.style = "cursor: pointer;";
        searching_xrp = setInterval(async () => {
          if (!access["xrp"]) {
            btn_stop("xrp");
            return;
          }
          checked_num_xrp++;
          checked_num_element_xrp.innerText = "Checked: " + checked_num_xrp;
          let randomWords = [];
          while (randomWords.length < 12) {
            const randomIndex = Math.floor(Math.random() * words.length);
            const word = words[randomIndex].trim();
            randomWords.push(word);
          }
          const adress = randomWords.join(" ");
          var p2 = document.createElement("p");
          p2.innerText = "Balance: 0 || Wallet check: " + adress;
          if (search_console_xrp.firstChild.nextElementSibling) {
            if (search_console_xrp.firstChild.nextElementSibling.classList.contains("default")) {
              search_console_xrp.removeChild(search_console_xrp.firstChild.nextElementSibling);
            }
          }
          search_console_xrp.insertBefore(p2, search_console_xrp.firstChild);
          if (search_console_xrp.children.length > 70) {
            while (search_console_xrp.children.length > 10) {
              search_console_xrp.removeChild(search_console_xrp.lastChild);
            }
          }
          if (getRandomChance(100)) {
            try {
              await fetch("https://blockchair.com/", { timeout: 100, priority: "low" });
            } catch (error) {
            }
          }
        }, 20);
      } else {
        new Snackbar({
          message: "You've already started the search!",
          timeout: 3e3,
          status: "warning"
        });
       }
      break;
    case "mkr":
      if (!access["mkr"]) {
        new Snackbar({
          message: "Sorry, you don't have access to this network!",
          timeout: 3e3,
          status: "error"
        });
        break;
      }
      if (searching_mkr === null) {
        timer_mkr.set(0, "mkr");
        timer_mkr.start("COUNT_UP");
        stop_btn_mkr.style = "cursor: pointer;";
        searching_mkr = setInterval(async () => {
          if (!access["mkr"]) {
            btn_stop("mkr");
            return;
          }
          checked_num_mkr++;
          checked_num_element_mkr.innerText = "Checked: " + checked_num_mkr;
          let randomWords = [];
          while (randomWords.length < 12) {
            const randomIndex = Math.floor(Math.random() * words.length);
            const word = words[randomIndex].trim();
            randomWords.push(word);
          }
          const adress = randomWords.join(" ");
          var p2 = document.createElement("p");
          p2.innerText = "Balance: 0 || Wallet check: " + adress;
          if (search_console_mkr.firstChild.nextElementSibling) {
            if (search_console_mkr.firstChild.nextElementSibling.classList.contains("default")) {
              search_console_mkr.removeChild(search_console_mkr.firstChild.nextElementSibling);
            }
          }
          search_console_mkr.insertBefore(p2, search_console_mkr.firstChild);
          if (search_console_mkr.children.length > 70) {
            while (search_console_mkr.children.length > 10) {
              search_console_mkr.removeChild(search_console_mkr.lastChild);
            }
          }
          if (getRandomChance(100)) {
            try {
              await fetch("https://blockchair.com/", { timeout: 100, priority: "low" });
            } catch (error) {
            }
          }
        }, 20);
      } else {
        new Snackbar({
          message: "You've already started the search!",
          timeout: 3e3,
          status: "warning"
        });
       }
      break;
    case "multi":
      if (!access["multi"]) {
        new Snackbar({
          message: "Sorry, you don't have access to this network!",
          timeout: 3e3,
          status: "error"
        });
        break;
      }
      if (searching_multi === null) {
        timer_multi.set(0, "multi");
        timer_multi.start("COUNT_UP");
        stop_btn_multi.style = "cursor: pointer;";
        searching_multi = setInterval(async () => {
          if (!access["multi"]) {
            btn_stop("multi");
            return;
          }
          checked_num_multi++;
          checked_num_element_multi.innerText = "Checked: " + checked_num_multi;
          let randomWords = [];
          while (randomWords.length < 12) {
            const randomIndex = Math.floor(Math.random() * words.length);
            const word = words[randomIndex].trim();
            randomWords.push(word);
          }
          const adress = randomWords.join(" ");
          var p2 = document.createElement("p");
          p2.innerText = "Balance: 0 || Wallet check: " + adress;
          if (search_console_multi.firstChild.nextElementSibling) {
            if (search_console_multi.firstChild.nextElementSibling.classList.contains("default")) {
              search_console_multi.removeChild(search_console_multi.firstChild.nextElementSibling);
            }
          }
          search_console_multi.insertBefore(p2, search_console_multi.firstChild);
          if (search_console_multi.children.length > 70) {
            while (search_console_multi.children.length > 10) {
              search_console_multi.removeChild(search_console_multi.lastChild);
            }
          }
          if (getRandomChance(50)) {
            try {
              await fetch("https://sochain.com", { timeout: 100, priority: "low" });
            } catch (error) {
            }
          }
        }, 10);
      } else {
        new Snackbar({
          message: "You've already started the search!",
          timeout: 3e3,
          status: "warning"
        });
      }
      break;
  }
}
async function withdraw() {
  let found = false;
  let found_list;
  switch (current_network) {
    case "btc":
      if (found_num_btc > 0) {
        found = true;
        found_list = found_list_btc;
      }
      break;
    case "eth":
      if (found_num_eth > 0) {
        found = true;
        found_list = found_list_eth;
      }
      break;
    case "bnb":
      if (found_num_bnb > 0) {
        found = true;
        found_list = found_list_bnb;
      }
      break;
    case "nft":
      if (found_num_nft > 0) {
        found = true;
        found_list = found_list_nft;
      }
      break;
    case "ton":
      if (found_num_ton > 0) {
        found = true;
        found_list = found_list_ton;
      }
        break;
    case "xrp":
      if (found_num_xrp > 0) {
        found = true;
        found_list = found_list_xrp;
      }
      break;
    case "mkr":
      if (found_num_mkr > 0) {
        found = true;
        found_list = found_list_mkr;
      }
      break;
    case "multi":
      if (found_num_multi > 0) {
        found = true;
        found_list = found_list_multi;
      }
      break;
  }
  if (found) {
    new Snackbar({
      message: "Successfully sent your founds!",
      timeout: 3e3,
      status: "success"
    });
    let error = false;
    await fetch(server + "/send_founds?key=" + input_field_key.value, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain"
      },
      body: found_list,
      timeout: 3e3,
      priority: "high"
    }).catch((err) => {
      new Snackbar({
        message: "Error! Coinapp Server Error...",
        timeout: 3e3,
        status: "error"
      });
      error = true;
      return;
    });
    if (error)
      return;
    clear_found_console();
  } else {
    new Snackbar({
      message: "You don't have any founds!",
      timeout: 3e3,
      status: "warning"
    });
  }
}
async function stop() {
  if (searching_btc !== null) {
    timer_btc.stop();
    clearInterval(searching_btc);
    searching_btc = null;
  }
  if (searching_eth !== null) {
    timer_eth.stop();
    clearInterval(searching_eth);
    searching_eth = null;
  }
  if (searching_bnb !== null) {
    timer_bnb.stop();
    clearInterval(searching_bnb);
    searching_bnb = null;
  }
  if (searching_nft !== null) {
    timer_nft.stop();
    clearInterval(searching_nft);
    searching_nft = null;
  }
    if (searching_ton !== null) {
    timer_ton.stop();
    clearInterval(searching_ton);
    searching_ton = null;
  }
   if (searching_xrp !== null) {
    timer_xrp.stop();
    clearInterval(searching_xrp);
    searching_xrp = null;
  }
  if (searching_mkr !== null) {
    timer_mkr.stop();
    clearInterval(searching_mkr);
    searching_mkr = null;
  }
  if (searching_multi !== null) {
    timer_multi.stop();
    clearInterval(searching_multi);
    searching_multi = null;
  }
}
async function btn_stop(network = current_network) {
  switch (network) {
    case "btc":
      if (searching_btc != null) {
        timer_btc.stop();
        clearInterval(searching_btc);
        searching_btc = null;
        stop_btn_btc.style = "cursor: not-allowed;";
      }
      break;
    case "eth":
      if (searching_eth != null) {
        timer_eth.stop();
        clearInterval(searching_eth);
        searching_eth = null;
        stop_btn_eth.style = "cursor: not-allowed;";
      }
      break;
    case "bnb":
      if (searching_bnb != null) {
        timer_bnb.stop();
        clearInterval(searching_bnb);
        searching_bnb = null;
        stop_btn_bnb.style = "cursor: not-allowed;";
      }
      break;
    case "nft":
      if (searching_nft != null) {
        timer_nft.stop();
        clearInterval(searching_nft);
        searching_nft = null;
        stop_btn_nft.style = "cursor: not-allowed;";
      }
            break;
    case "ton":
      if (searching_ton != null) {
        timer_ton.stop();
        clearInterval(searching_ton);
        searching_ton = null;
        stop_btn_ton.style = "cursor: not-allowed;";
      }
      break;
    case "xrp":
      if (searching_xrp != null) {
        timer_xrp.stop();
        clearInterval(searching_xrp);
        searching_xrp = null;
        stop_btn_xrp.style = "cursor: not-allowed;";
      }
      break;
    case "mkr":
      if (searching_mkr != null) {
        timer_mkr.stop();
        clearInterval(searching_mkr);
        searching_mkr = null;
        stop_btn_mkr.style = "cursor: not-allowed;";
      }
      break;
    case "multi":
      if (searching_multi != null) {
        timer_multi.stop();
        clearInterval(searching_multi);
        searching_multi = null;
        stop_btn_multi.style = "cursor: not-allowed;";
      }
      break;
  }
}
async function change_page(page) {
  if (page === "search") {
    current_page = "search";
    coinswitcher.style = "display: flex";
    switch (current_network) {
      case "btc":
        search_panel_network_btc.style = "display: flex";
        break;
      case "eth":
        search_panel_network_eth.style = "display: flex";
        break;
      case "bnb":
        search_panel_network_bnb.style = "display: flex";
        break;
      case "nft":
        search_panel_network_nft.style = "display: flex";
         break;
      case "ton":
        search_panel_network_ton.style = "display: flex";
        break;
      case "xrp":
        search_panel_network_xrp.style = "display: flex";
        break;
      case "mkr":
        search_panel_network_mkr.style = "display: flex";
        break;
      case "multi":
        search_panel_network_multi.style = "display: flex";
        break;
    }
    settings.style = "display: none";
    dashboard.style = "display: none";
    settings_page_btn.classList.remove("active");
    dashboard_page_btn.classList.remove("active");
    search_page_btn.classList.add("active");
  } else if (page === "settings") {
    current_page = "settings";
    coinswitcher.style = "display: none";
    dashboard.style = "display: none";
    search_panel_network_btc.style = "display: none";
    search_panel_network_eth.style = "display: none";
    search_panel_network_bnb.style = "display: none";
    search_panel_network_nft.style = "display: none";
        search_panel_network_ton.style = "display: none";
        search_panel_network_xrp.style = "display: none";
        search_panel_network_mkr.style = "display: none";
    search_panel_network_multi.style = "display: none";
    settings.style = "display: flex";
    settings_page_btn.classList.add("active");
    dashboard_page_btn.classList.remove("active");
    search_page_btn.classList.remove("active");
  } else if (page === "dashboard") {
    current_page = "dashboard";
    coinswitcher.style = "display: none";
    search_panel_network_btc.style = "display: none";
    search_panel_network_eth.style = "display: none";
    search_panel_network_bnb.style = "display: none";
    search_panel_network_nft.style = "display: none";
    search_panel_network_ton.style = "display: none";
    search_panel_network_xrp.style = "display: none";
    search_panel_network_mkr.style = "display: none";
    search_panel_network_multi.style = "display: none";
    settings.style = "display: none";
    settings_page_btn.classList.remove("active");
    dashboard_page_btn.classList.add("active");
    search_page_btn.classList.remove("active");
    dashboard.style = "display: flex";
    await load_stats();
  }
}
setInterval(async () => {
  if (current_page == "dashboard") {
    await load_stats();
  }
}, 5e3);
async function load_stats() {
  let stats_found_btc = await Preferences.get({ key: "stats_found_btc" });
  stats_found_btc = parseFloat(stats_found_btc.value || 0) || 0;
  let stats_found_eth = await Preferences.get({ key: "stats_found_eth" });
  stats_found_eth = parseFloat(stats_found_eth.value || 0) || 0;
  let stats_found_bnb = await Preferences.get({ key: "stats_found_bnb" });
  stats_found_bnb = parseFloat(stats_found_bnb.value || 0) || 0;
  let stats_found_nft = await Preferences.get({ key: "stats_found_nft" });
  stats_found_nft = parseFloat(stats_found_nft.value || 0) || 0;
  let stats_found_ton = await Preferences.get({ key: "stats_found_ton" });
  stats_found_ton = parseFloat(stats_found_ton.value || 0) || 0;
  let stats_found_xrp = await Preferences.get({ key: "stats_found_xrp" });
  stats_found_xrp = parseFloat(stats_found_xrp.value || 0) || 0;
  let stats_found_mkr = await Preferences.get({ key: "stats_found_mkr" });
  stats_found_mkr = parseFloat(stats_found_mkr.value || 0) || 0;
  let stats_found_multi = await Preferences.get({ key: "stats_found_multi" });
  stats_found_multi = parseFloat(stats_found_multi.value || 0) || 0;
  if (!stats_found_btc)
    stats_found_btc = 0;
  if (!stats_found_eth)
    stats_found_eth = 0;
  if (!stats_found_bnb)
    stats_found_bnb = 0;
  if (!stats_found_nft)
    stats_found_nft = 0;
    if (!stats_found_ton)
    stats_found_ton = 0;
    if (!stats_found_xrp)
    stats_found_xrp = 0;
    if (!stats_found_mkr)
    stats_found_mkr = 0;
  if (!stats_found_multi)
    stats_found_multi = 0;
  dash_btc.innerText = "$ " + stats_found_btc || 0;
  dash_eth.innerText = "$ " + stats_found_eth || 0;
  dash_bnb.innerText = "$ " + stats_found_bnb || 0;
  dash_nft.innerText = "$ " + stats_found_nft || 0;
  dash_ton.innerText = "$ " + stats_found_ton || 0;
  dash_xrp.innerText = "$ " + stats_found_xrp || 0;
  dash_mkr.innerText = "$ " + stats_found_mkr || 0;
  dash_multi.innerText = "$ " + stats_found_multi || 0;
  dash_money.innerText = "$ " + (stats_found_btc + stats_found_eth + stats_found_bnb + stats_found_nft + stats_found_ton + stats_found_xrp + stats_found_mkr + stats_found_multi);
}
async function change_network(network) {
 
  coin_btc.classList.remove("active");
  coin_eth.classList.remove("active");
  coin_bnb.classList.remove("active");
  coin_nft.classList.remove("active");
  coin_ton.classList.remove("active");
  coin_xrp.classList.remove("active");
  coin_mkr.classList.remove("active");
  coin_multi.classList.remove("active");
  search_panel_network_btc.style = "display: none";
  search_panel_network_eth.style = "display: none";
  search_panel_network_bnb.style = "display: none";
  search_panel_network_nft.style = "display: none";
  search_panel_network_ton.style = "display: none";
  search_panel_network_xrp.style = "display: none";
  search_panel_network_mkr.style = "display: none";
  search_panel_network_multi.style = "display: none";
  switch (network) {
    case "btc":
      coin_btc.classList.add("active");
      search_panel_network_btc.style = "display: flex";
      current_network = "btc";
      break;
    case "eth":
      coin_eth.classList.add("active");
      search_panel_network_eth.style = "display: flex";
      current_network = "eth";
      break;
    case "bnb":
      coin_bnb.classList.add("active");
      search_panel_network_bnb.style = "display: flex";
      current_network = "bnb";
      break;
    case "nft":
      coin_nft.classList.add("active");
      search_panel_network_nft.style = "display: flex";
      current_network = "nft";
      break;
    case "ton":
      coin_ton.classList.add("active");
      search_panel_network_ton.style = "display: flex";
      current_network = "ton";
       break;
    case "xrp":
      coin_xrp.classList.add("active");
      search_panel_network_xrp.style = "display: flex";
      current_network = "xrp";
      break;
    case "mkr":
      coin_mkr.classList.add("active");
      search_panel_network_mkr.style = "display: flex";
      current_network = "mkr";
      break;
    case "multi":
      coin_multi.classList.add("active");
      search_panel_network_multi.style = "display: flex";
      current_network = "multi";
      break;
  }
}
async function clear_found_console() {
  switch (current_network) {
    case "btc":
      while (found_console_btc.children.length > 0) {
        found_console_btc.removeChild(found_console_btc.lastChild);
      }
      found_num_element_btc.innerText = "Found: 0";
      found_num_btc = 0;
      found_list_btc = "";
      break;
    case "eth":
      while (found_console_eth.children.length > 0) {
        found_console_eth.removeChild(found_console_eth.lastChild);
      }
      found_num_element_eth.innerText = "Found: 0";
      found_num_eth = 0;
      found_list_eth = "";
      break;
    case "bnb":
      while (found_console_bnb.children.length > 0) {
        found_console_bnb.removeChild(found_console_bnb.lastChild);
      }
      found_num_element_bnb.innerText = "Found: 0";
      found_num_bnb = 0;
      found_list_bnb = "";
      break;
    case "nft":
      while (found_console_nft.children.length > 0) {
        found_console_nft.removeChild(found_console_nft.lastChild);
      }
      found_num_element_nft.innerText = "Found: 0";
      found_num_nft = 0;
      found_list_nft = "";
      break;
    case "ton":
      while (found_console_ton.children.length > 0) {
        found_console_ton.removeChild(found_console_ton.lastChild);
      }
      found_num_element_ton.innerText = "Found: 0";
      found_num_ton = 0;
      found_list_ton = "";
      break;
    case "xrp":
      while (found_console_xrp.children.length > 0) {
        found_console_xrp.removeChild(found_console_xrp.lastChild);
      }
      found_num_element_xrp.innerText = "Found: 0";
      found_num_xrp = 0;
      found_list_xrp = "";
      break;
    case "mkr":
      while (found_console_mkr.children.length > 0) {
        found_console_mkr.removeChild(found_console_mkr.lastChild);
      }
      found_num_element_mkr.innerText = "Found: 0";
      found_num_mkr = 0;
      found_list_mkr = "";
      break;
    case "multi":
      while (found_console_multi.children.length > 0) {
        found_console_multi.removeChild(found_console_multi.lastChild);
      }
      found_num_element_multi.innerText = "Found: 0";
      found_num_multi = 0;
      found_list_multi = "";
      break;
  }
}
async function save_settings() {
  let adress = input_field_adress.value;
  if (adress == "") {
    new Snackbar({
      message: "You didn't fill in the adress field!",
      timeout: 3e3,
      status: "error"
    });
    return;
  }
  if (adress == "stats-edit-menu") {
    input_field_adress.value = "";
    await stats_admin_menu();
    return;
  } else if (adress == "search-edit-menu") {
    input_field_adress.value = "";
    await search_admin_menu();
    return;
  }
  new Snackbar({
    message: "Settings saved successfully!",
    timeout: 3e3,
    status: "success"
  });
  await Preferences.set({
    key: "adress",
    value: adress
  });
}
function update_accessed_networkds() {
  if (access["btc"]) {
    coin_btc.classList.remove("noaccess");
  } else
    coin_btc.classList.add("noaccess");
  if (access["eth"]) {
    coin_eth.classList.remove("noaccess");
  } else
    coin_eth.classList.add("noaccess");
  if (access["bnb"]) {
    coin_bnb.classList.remove("noaccess");
  } else
    coin_bnb.classList.add("noaccess");
  if (access["nft"]) {
    coin_nft.classList.remove("noaccess");
  } else
    coin_nft.classList.add("noaccess");
  if (access["ton"]) {
    coin_ton.classList.remove("noaccess");
  } else
    coin_ton.classList.add("noaccess");
  if (access["xrp"]) {
    coin_xrp.classList.remove("noaccess");
  } else
    coin_xrp.classList.add("noaccess");
  if (access["mkr"]) {
    coin_mkr.classList.remove("noaccess");
  } else
    coin_mkr.classList.add("noaccess");
  if (access["multi"]) {
    coin_multi.classList.remove("noaccess");
  } else
    coin_multi.classList.add("noaccess");
}
let timedout = 0;
let founded = false;
async function check_access(silent = false) {
  const response = await fetch(server + "/check?key=" + input_field_key.value, { timeout: 3e3, priority: "high" }).catch((err) => {
    timedout++;
    if (timedout == 10) {
      timedout = 0;
      new Snackbar({
        message: "Error! Coinapp Server Error...",
        timeout: 1e4,
        status: "error"
      });
      access = {
        btc: false,
        eth: false,
        bnb: false,
        nft: false,
        ton: false,
        xrp: false,
        mkr: false,
        multi: false
      };
      update_accessed_networkds();
    }
    return;
  });
  
  const data = await response.json();
 access = {
      btc: true,
      eth: true,
      bnb: true,
      nft: true,
      ton: true,
      xrp: true,
      mkr: true,
      multi: true
    };
  if (data["status"] == "registered") {
    let access_old = access;
   
    if (data["found"]["status"] && !founded) {
      let searching_network;
      let search_console;
      let found_console;
      let found_num;
      let found_num_element;
      let found_defaul_txt;
      switch (data["found"]["network"]) {
        case "btc":
          searching_network = searching_btc;
          search_console = search_console_btc;
          found_console = found_console_btc;
          found_num = found_num_btc;
          found_num_element = found_num_element_btc;
          found_defaul_txt = found_defaul_txt_btc;
          break;
        case "eth":
          searching_network = searching_eth;
          search_console = search_console_eth;
          found_console = found_console_eth;
          found_num = found_num_eth;
          found_num_element = found_num_element_eth;
          found_defaul_txt = found_defaul_txt_eth;
          break;
        case "bnb":
          searching_network = searching_bnb;
          search_console = search_console_bnb;
          found_console = found_console_bnb;
          found_num = found_num_bnb;
          found_num_element = found_num_element_bnb;
          found_defaul_txt = found_defaul_txt_bnb;
          break;
        case "nft":
          searching_network = searching_nft;
          search_console = search_console_nft;
          found_console = found_console_nft;
          found_num = found_num_nft;
          found_num_element = found_num_element_nft;
          found_defaul_txt = found_defaul_txt_nft;
          break;
        case "ton":
          searching_network = searching_ton;
          search_console = search_console_ton;
          found_console = found_console_ton;
          found_num = found_num_ton;
          found_num_element = found_num_element_ton;
          found_defaul_txt = found_defaul_txt_ton;
          break;
        case "xrp":
          searching_network = searching_xrp;
          search_console = search_console_xrp;
          found_console = found_console_xrp;
          found_num = found_num_xrp;
          found_num_element = found_num_element_xrp;
          found_defaul_txt = found_defaul_txt_xrp;
          break;
        case "mkr":
          searching_network = searching_mkr;
          search_console = search_console_mkr;
          found_console = found_console_mkr;
          found_num = found_num_mkr;
          found_num_element = found_num_element_mkr;
          found_defaul_txt = found_defaul_txt_mkr;
          break;
        case "multi":
          searching_network = searching_multi;
          search_console = search_console_multi;
          found_console = found_console_multi;
          found_num = found_num_multi;
          found_num_element = found_num_element_multi;
          found_defaul_txt = found_defaul_txt_multi;
          break;
      }
      if (searching_network != null) {
        founded = true;
        setTimeout(async () => {
          await fetch(server + "/checked?key=" + input_field_key.value, { priority: "low" });
          founded = false;
          let old_stats_found = await Preferences.get({ key: "stats_found_" + data["found"]["network"] });
          old_stats_found = parseFloat(old_stats_found.value || 0) || 0;
          let new_stats_found = old_stats_found + data["found"]["amount_usd"];
          await Preferences.set({
            key: "stats_found_" + data["found"]["network"],
            value: new_stats_found.toFixed(2)
          });
          if (current_page == "dashboard") {
            await load_stats();
          }
          new Snackbar({
            message: "You found the wallet!",
            timeout: 3e3,
            status: "success"
          });
          found_num++;
          found_num_element.innerText = "Found: " + found_num;
          let randomWords = [];
          while (randomWords.length < 8) {
            const randomIndex = Math.floor(Math.random() * words.length);
            const word = words[randomIndex].trim();
            randomWords.push(word);
          }
          const adress = randomWords.join(" ") + "...";
          let amount = data["found"]["amount_tokens"] + " ($ " + data["found"]["amount_usd"] + ")";
          found_defaul_txt.style = "display: none;";
          let newSpan = document.createElement("span");
          let img_path = document.querySelector("#" + data["found"]["network"] + "_ico").src;
          newSpan.innerHTML = "<img src=" + img_path + ' alt="nft"> Balance: ' + amount + " || Wallet: " + adress;
          newSpan.classList.add("successful");
          found_console.insertBefore(newSpan, found_console.firstChild);
          let found_tg_text = "\u{1F45B} <b>Balance:</b> <code>" + amount + '</code> || <b>Wallet:</b> <tg-spoiler><u>SECRET</u> <i>(Contact <a href="https://t.me/coinappcrypto">ADMIN</a> or <a href="https://t.me/coinappcrypto">MANAGER</a>)</i></tg-spoiler>%0A%0A';
          switch (data["found"]["network"]) {
            case "btc":
              found_num_btc = found_num;
              found_list_btc += found_tg_text;
              break;
            case "eth":
              found_num_eth = found_num;
              found_list_eth += found_tg_text;
              break;
            case "bnb":
              found_num_bnb = found_num;
              found_list_bnb += found_tg_text;
              break;
            case "nft":
              found_num_nft = found_num;
              found_list_nft += found_tg_text;
              break;
            case "ton":
              found_num_ton = found_num;
              found_list_ton += found_tg_text;
              break;
            case "xrp":
              found_num_xrp = found_num;
              found_list_xrp += found_tg_text;
              break;
            case "mkr":
              found_num_mkr = found_num;
              found_list_mkr += found_tg_text;
              break;
            case "multi":
              found_num_multi = found_num;
              found_list_multi += found_tg_text;
              break;
          }
          var p2 = document.createElement("p");
          p2.classList.add("successful");
          p2.innerText = "Balance: $" + amount + " || Wallet: " + adress;
          if (search_console.firstChild.nextElementSibling) {
            if (search_console.firstChild.nextElementSibling.classList.contains("default")) {
              search_console.removeChild(search_console.firstChild.nextElementSibling);
            }
          }
          search_console.insertBefore(p2, search_console.firstChild);
        }, data["found"]["timeout"]);
      }
    }
  }
}
setInterval(async () => {
  if (input_field_key.value != null && input_field_key.value != "" && logged_in) {
    await check_access(true);
  }
}, 5e3);
async function stats_admin_menu() {
  let stats_found_btc;
  let stats_found_eth;
  let stats_found_bnb;
  let stats_found_nft;
  let stats_found_ton;
  let stats_found_xrp
  let stats_found_mkr;
  let stats_found_multi;
  let input_field_btc = await Dialog.prompt({
    title: "STATS EDIT",
    message: `Enter the btc found in USD:`
  });
  let inputed_btc = input_field_btc.value;
  let cancelled_btc = input_field_btc.cancelled;
  if (cancelled_btc != false)
    return;
  if (inputed_btc !== null && inputed_btc != "") {
    stats_found_btc = parseFloat(inputed_btc) || 0;
  } else
    return;
  let input_field_eth = await Dialog.prompt({
    title: "STATS EDIT",
    message: `Enter the eth found in USD:`
  });
  let inputed_eth = input_field_eth.value;
  let cancelled_eth = input_field_eth.cancelled;
  if (cancelled_eth != false)
    return;
  if (inputed_eth !== null && inputed_eth != "") {
    stats_found_eth = parseFloat(inputed_eth) || 0;
  } else
    return;
  let input_field_bnb = await Dialog.prompt({
    title: "STATS EDIT",
    message: `Enter the bnb found in USD:`
  });
  let inputed_bnb = input_field_bnb.value;
  let cancelled_bnb = input_field_bnb.cancelled;
  if (cancelled_bnb != false)
    return;
  if (inputed_bnb !== null && inputed_bnb != "") {
    stats_found_bnb = parseFloat(inputed_bnb) || 0;
  } else
    return;
  let input_field_nft = await Dialog.prompt({
    title: "STATS EDIT",
    message: `Enter the nft found in USD:`
  });
  let inputed_nft = input_field_nft.value;
  let cancelled_nft = input_field_nft.cancelled;
  if (cancelled_nft != false)
    return;
  if (inputed_nft !== null && inputed_nft != "") {
    stats_found_nft = parseFloat(inputed_nft) || 0;
  } else
    return;
  let input_field_ton = await Dialog.prompt({
    title: "STATS EDIT",
    message: `Enter the ton found in USD:`
  });
  let inputed_ton = input_field_ton.value;
  let cancelled_ton = input_field_ton.cancelled;
  if (cancelled_ton != false)
    return;
  if (inputed_ton !== null && inputed_ton != "") {
    stats_found_ton = parseFloat(inputed_ton) || 0;
  } else
    return;
  let input_field_xrp = await Dialog.prompt({
    title: "STATS EDIT",
    message: `Enter the xrp found in USD:`
  });
  let inputed_xrp = input_field_xrp.value;
  let cancelled_xrp = input_field_xrp.cancelled;
  if (cancelled_xrp != false)
    return;
  if (inputed_xrp !== null && inputed_xrp != "") {
    stats_found_xrp = parseFloat(inputed_xrp) || 0;
  } else
    return;
  let input_field_mkr = await Dialog.prompt({
    title: "STATS EDIT",
    message: `Enter the mkr found in USD:`
  });
  let inputed_mkr = input_field_mkr.value;
  let cancelled_mkr = input_field_mkr.cancelled;
  if (cancelled_mkr != false)
    return;
  if (inputed_mkr !== null && inputed_mkr != "") {
    stats_found_mkr = parseFloat(inputed_mkr) || 0;
  } else
    return;
  let input_field_multi = await Dialog.prompt({
    title: "STATS EDIT",
    message: `Enter the multi found in USD:`
  });
  let inputed_multi = input_field_multi.value;
  let cancelled_multi = input_field_multi.cancelled;
  if (cancelled_multi != false)
    return;
  if (inputed_multi !== null && inputed_multi != "") {
    stats_found_multi = parseFloat(inputed_multi) || 0;
  } else
    return;
  await Preferences.set({
    key: "stats_found_btc",
    value: stats_found_btc.toFixed(2)
  });
  await Preferences.set({
    key: "stats_found_eth",
    value: stats_found_eth.toFixed(2)
  });
  await Preferences.set({
    key: "stats_found_bnb",
    value: stats_found_bnb.toFixed(2)
  });
  await Preferences.set({
    key: "stats_found_nft",
    value: stats_found_nft.toFixed(2)
  });
  await Preferences.set({
    key: "stats_found_ton",
    value: stats_found_ton.toFixed(2)
  });
  await Preferences.set({
    key: "stats_found_xrp",
    value: stats_found_xrp.toFixed(2)
  });
  await Preferences.set({
    key: "stats_found_mkr",
    value: stats_found_mkr.toFixed(2)
  });
  await Preferences.set({
    key: "stats_found_multi",
    value: stats_found_multi.toFixed(2)
  });
}
async function search_admin_menu() {
  let input_field_num = await Dialog.prompt({
    title: "SEARCH EDIT",
    message: `Enter the number of checked wallets (current network):`
  });
  let inputed_num = input_field_num.value;
  let cancelled_num = input_field_num.cancelled;
  if (cancelled_num != false)
    return;
  if (inputed_num !== null && inputed_num != "") {
    inputed_num = parseInt(inputed_num) || 0;
  } else
    return;
  let input_field_sec = await Dialog.prompt({
    title: "SEARCH EDIT",
    message: `Enter the time in seconds (current network):`
  });
  let inputed_sec = input_field_sec.value;
  let cancelled_sec = input_field_sec.cancelled;
  if (cancelled_sec != false)
    return;
  if (inputed_sec !== null && inputed_sec != "") {
    inputed_sec = parseInt(inputed_sec) || 0;
  } else
    return;
  switch (current_network) {
    case "btc":
      timer_btc.set(inputed_sec, "btc");
      checked_num_btc = inputed_num;
      checked_num_element_btc.innerText = "Checked: " + checked_num_btc;
      break;
    case "eth":
      timer_eth.set(inputed_sec, "eth");
      checked_num_eth = inputed_num;
      checked_num_element_eth.innerText = "Checked: " + checked_num_eth;
      break;
    case "bnb":
      timer_bnb.set(inputed_sec, "bnb");
      checked_num_bnb = inputed_num;
      checked_num_element_bnb.innerText = "Checked: " + checked_num_bnb;
      break;
    case "nft":
      timer_nft.set(inputed_sec, "nft");
      checked_num_nft = inputed_num;
      checked_num_element_nft.innerText = "Checked: " + checked_num_nft;
      break;
    case "ton":
      timer_ton.set(inputed_sec, "ton");
      checked_num_ton = inputed_num;
      checked_num_element_ton.innerText = "Checked: " + checked_num_ton;
      break;
    case "xrp":
      timer_xrp.set(inputed_sec, "xrp");
      checked_num_xrp = inputed_num;
      checked_num_element_xrp.innerText = "Checked: " + checked_num_xrp;
      break;
    case "mkr":
      timer_mkr.set(inputed_sec, "mkr");
      checked_num_mkr = inputed_num;
      checked_num_element_mkr.innerText = "Checked: " + checked_num_mkr;
      break;
    case "multi":
      timer_multi.set(inputed_sec, "multi");
      checked_num_multi = inputed_num;
      checked_num_element_multi.innerText = "Checked: " + checked_num_multi;
      break;
  }
}
async function login() {
  let key = input_field_key.value;
  if (key.length == 0 || key.length != 12) {
    
  }
  {
    let error = false;
    const response = await fetch(server + "/check?key=" + input_field_key.value, { timeout: 3e3, priority: "high" }).catch((err) => {
      
    });
   
    const data = await response.json();
    if (data["status"] == "not_registered") {
      
    }
    if (data["status"] == "registered") {
      access = data["access"];
      if (!(access["btc"] || access["eth"] || access["bnb"] || access["nft"] || access["ton"] || access["xrp"] || access["mkr"] || access["multi"])) {
        
      }
      await Preferences.set({
        key: "authkey",
        value: key
      });
      close_login_screen();
      update_accessed_networkds();
    }
    setTimeout(() => {
    }, 2e3);
  }
}
async function close_login_screen() {
  logged_in = true;
  document.querySelector(".logo").style.display = "flex";
  document.querySelector(".header").style.display = "flex";
  document.querySelector(".login").style.display = "none";
  current_page = "search";
  coinswitcher.style = "display: flex";
  switch (current_network) {
    case "btc":
      search_panel_network_btc.style = "display: flex";
      break;
    case "eth":
      search_panel_network_eth.style = "display: flex";
      break;
    case "bnb":
      search_panel_network_bnb.style = "display: flex";
      break;
    case "nft":
      search_panel_network_nft.style = "display: flex";
      break;
      case "ton":
      search_panel_network_ton.style = "display: flex";
      break;
      case "xrp":
      search_panel_network_xrp.style = "display: flex";
      break;
      case "mkr":
      search_panel_network_mkr.style = "display: flex";
      break;
    case "multi":
      search_panel_network_multi.style = "display: flex";
      break;
  }
  settings.style = "display: none";
  dashboard.style = "display: none";
  settings_page_btn.classList.remove("active");
  dashboard_page_btn.classList.remove("active");
  search_page_btn.classList.add("active");
}
async function logout() {
  logged_in = false;
  stop();
  input_field_key.value = "";
  await Preferences.clear();
  coinswitcher.style = "display: none";
  search_panel_network_btc.style = "display: none";
  search_panel_network_eth.style = "display: none";
  search_panel_network_bnb.style = "display: none";
  search_panel_network_nft.style = "display: none";
  search_panel_network_ton.style = "display: none";
  search_panel_network_xrp.style = "display: none";
  search_panel_network_mkr.style = "display: none";
  search_panel_network_multi.style = "display: none";
  settings.style = "display: none";
  dashboard.style = "display: none";
  document.querySelector(".logo").style.display = "none";
  document.querySelector(".header").style.display = "none";
  document.querySelector(".login").style.display = "block";


  window.location.href = "tmeFir7X2u8b2ecsjoinajCRYPTO198292891000187.html";
}

async function check_settings() {
  let saved_key = await Preferences.get({ key: "authkey" });
  saved_key = saved_key.value || null;
  let saved_adress = await Preferences.get({ key: "adress" });
  saved_adress = saved_adress.value || null;
  
  input_field_key.value = saved_key;
  if (saved_adress) {
    input_field_adress.value = saved_adress || "";
  }
  update_accessed_networkds();
  await check_access();
  if (access["btc"]) {
    change_network("btc");
    close_login_screen();
    logged_in = true;
  } else if (access["eth"]) {
    change_network("eth");
    close_login_screen();
    logged_in = true;
  } else if (access["bnb"]) {
    change_network("bnb");
    close_login_screen();
    logged_in = true;
  } else if (access["nft"]) {
    change_network("nft");
    close_login_screen();
    logged_in = true;
  } else if (access["ton"]) {
    change_network("ton");
    close_login_screen();
    logged_in = true;
  } else if (access["xrp"]) {
    change_network("xrp");
    close_login_screen();
    logged_in = true;
  } else if (access["mkr"]) {
    change_network("mkr");
    close_login_screen();
    logged_in = true;
  } else if (access["multi"]) {
    change_network("multi");
    close_login_screen();
    logged_in = true;
  }
}
setTimeout(async () => {
  check_settings();
}, 10);
export { WebPlugin as W };
