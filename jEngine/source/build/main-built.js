/** vim: et:ts=4:sw=4:sts=4
 * @license RequireJS 2.1.11 Copyright (c) 2010-2014, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */

var requirejs, require, define;
!function(global) {
    function isFunction(e) { return"[object Function]" === ostring.call(e) }

    function isArray(e) { return"[object Array]" === ostring.call(e) }

    function each(e, t) {
        if (e) {
            var i;
            for (i = 0; i < e.length && (!e[i] || !t(e[i], i, e)); i += 1);
        }
    }

    function eachReverse(e, t) {
        if (e) {
            var i;
            for (i = e.length - 1; i > -1 && (!e[i] || !t(e[i], i, e)); i -= 1);
        }
    }

    function hasProp(e, t) { return hasOwn.call(e, t) }

    function getOwn(e, t) { return hasProp(e, t) && e[t] }

    function eachProp(e, t) {
        var i;
        for (i in e)if (hasProp(e, i) && t(e[i], i))break
    }

    function mixin(e, t, i, n) { return t && eachProp(t, function(t, r) { (i || !hasProp(e, r)) && (!n || "object" != typeof t || !t || isArray(t) || isFunction(t) || t instanceof RegExp ? e[r] = t : (e[r] || (e[r] = {}), mixin(e[r], t, i, n))) }), e }

    function bind(e, t) { return function() { return t.apply(e, arguments) } }

    function scripts() { return document.getElementsByTagName("script") }

    function defaultOnError(e) { throw e }

    function getGlobal(e) {
        if (!e)return e;
        var t = global;
        return each(e.split("."), function(e) { t = t[e] }), t
    }

    function makeError(e, t, i, n) {
        var r = new Error(t + "\nhttp://requirejs.org/docs/errors.html#" + e);
        return r.requireType = e, r.requireModules = n, i && (r.originalError = i), r
    }

    function newContext(e) {
        function t(e) {
            var t, i, n = e.length;
            for (t = 0; n > t; t++)
                if (i = e[t], "." === i)e.splice(t, 1), t -= 1;
                else if (".." === i) {
                    if (1 === t && (".." === e[2] || ".." === e[0]))break;
                    t > 0 && (e.splice(t - 1, 2), t -= 2)
                }
        }

        function i(e, i, n) {
            var r, s, a, o, c, u, d, h, p, f, l, m = i && i.split("/"), g = m, v = q.map, b = v && v["*"];
            if (e && "." === e.charAt(0) && (i ? (g = m.slice(0, m.length - 1), e = e.split("/"), d = e.length - 1, q.nodeIdCompat && jsSuffixRegExp.test(e[d]) && (e[d] = e[d].replace(jsSuffixRegExp, "")), e = g.concat(e), t(e), e = e.join("/")) : 0 === e.indexOf("./") && (e = e.substring(2))), n && v && (m || b)) {
                a = e.split("/");
                e:for (o = a.length; o > 0; o -= 1) {
                    if (u = a.slice(0, o).join("/"), m)
                        for (c = m.length; c > 0; c -= 1)
                            if (s = getOwn(v, m.slice(0, c).join("/")), s && (s = getOwn(s, u))) {
                                h = s, p = o;
                                break e
                            }
                    !f && b && getOwn(b, u) && (f = getOwn(b, u), l = o)
                }
                !h && f && (h = f, p = l), h && (a.splice(0, p, h), e = a.join("/"))
            }
            return r = getOwn(q.pkgs, e), r ? r : e
        }

        function n(e) { isBrowser && each(scripts(), function(t) { return t.getAttribute("data-requiremodule") === e && t.getAttribute("data-requirecontext") === E.contextName ? (t.parentNode.removeChild(t), !0) : void 0 }) }

        function r(e) {
            var t = getOwn(q.paths, e);
            return t && isArray(t) && t.length > 1 ? (t.shift(), E.require.undef(e), E.require([e]), !0) : void 0
        }

        function s(e) {
            var t, i = e ? e.indexOf("!") : -1;
            return i > -1 && (t = e.substring(0, i), e = e.substring(i + 1, e.length)), [t, e]
        }

        function a(e, t, n, r) {
            var a, o, c, u, d = null, h = t ? t.name : null, p = e, f = !0, l = "";
            return e || (f = !1, e = "_@r" + (P += 1)), u = s(e), d = u[0], e = u[1], d && (d = i(d, h, r), o = getOwn(j, d)), e && (d ? l = o && o.normalize ? o.normalize(e, function(e) { return i(e, h, r) }) : i(e, h, r) : (l = i(e, h, r), u = s(l), d = u[0], l = u[1], n = !0, a = E.nameToUrl(l))), c = !d || o || n ? "" : "_unnormalized" + (A += 1), { prefix: d, name: l, parentMap: t, unnormalized: !!c, url: a, originalName: p, isDefine: f, id: (d ? d + "!" + l : l) + c }
        }

        function o(e) {
            var t = e.id, i = getOwn(k, t);
            return i || (i = k[t] = new E.Module(e)), i
        }

        function c(e, t, i) {
            var n = e.id, r = getOwn(k, n);
            !hasProp(j, n) || r && !r.defineEmitComplete ? (r = o(e), r.error && "error" === t ? i(r.error) : r.on(t, i)) : "defined" === t && i(j[n])
        }

        function u(e, t) {
            var i = e.requireModules, n = !1;
            t ? t(e) : (each(i, function(t) {
                var i = getOwn(k, t);
                i && (i.error = e, i.events.error && (n = !0, i.emit("error", e)))
            }), n || req.onError(e))
        }

        function d() { globalDefQueue.length && (apsp.apply(M, [M.length, 0].concat(globalDefQueue)), globalDefQueue = []) }

        function h(e) { delete k[e], delete S[e] }

        function p(e, t, i) {
            var n = e.map.id;
            e.error ? e.emit("error", e.error) : (t[n] = !0, each(e.depMaps, function(n, r) {
                var s = n.id, a = getOwn(k, s);
                !a || e.depMatched[r] || i[s] || (getOwn(t, s) ? (e.defineDep(r, j[s]), e.check()) : p(a, t, i))
            }), i[n] = !0)
        }

        function f() {
            var e, t, i = 1e3 * q.waitSeconds, s = i && E.startTime + i < (new Date).getTime(), a = [], o = [], c = !1, d = !0;
            if (!b) {
                if (b = !0, eachProp(S, function(e) {
                    var i = e.map, u = i.id;
                    if (e.enabled && (i.isDefine || o.push(e), !e.error))
                        if (!e.inited && s)r(u) ? (t = !0, c = !0) : (a.push(u), n(u));
                        else if (!e.inited && e.fetched && i.isDefine && (c = !0, !i.prefix))return d = !1
                }), s && a.length)return e = makeError("timeout", "Load timeout for modules: " + a, null, a), e.contextName = E.contextName, u(e);
                d && each(o, function(e) { p(e, {}, {}) }), s && !t || !c || !isBrowser && !isWebWorker || y || (y = setTimeout(function() { y = 0, f() }, 50)), b = !1
            }
        }

        function l(e) { hasProp(j, e[0]) || o(a(e[0], null, !0)).init(e[1], e[2]) }

        function m(e, t, i, n) { e.detachEvent && !isOpera ? n && e.detachEvent(n, t) : e.removeEventListener(i, t, !1) }

        function g(e) {
            var t = e.currentTarget || e.srcElement;
            return m(t, E.onScriptLoad, "load", "onreadystatechange"), m(t, E.onScriptError, "error"), { node: t, id: t && t.getAttribute("data-requiremodule") }
        }

        function v() {
            var e;
            for (d(); M.length;) {
                if (e = M.shift(), null === e[0])return u(makeError("mismatch", "Mismatched anonymous define() module: " + e[e.length - 1]));
                l(e)
            }
        }

        var b, x, E, w, y, q = { waitSeconds: 7, baseUrl: "./", paths: {}, bundles: {}, pkgs: {}, shim: {}, config: {} }, k = {}, S = {}, O = {}, M = [], j = {}, T = {}, R = {}, P = 1, A = 1;
        return w = { require: function(e) { return e.require ? e.require : e.require = E.makeRequire(e.map) }, exports: function(e) { return e.usingExports = !0, e.map.isDefine ? e.exports ? j[e.map.id] = e.exports : e.exports = j[e.map.id] = {} : void 0 }, module: function(e) { return e.module ? e.module : e.module = { id: e.map.id, uri: e.map.url, config: function() { return getOwn(q.config, e.map.id) || {} }, exports: e.exports || (e.exports = {}) } } }, x = function(e) { this.events = getOwn(O, e.id) || {}, this.map = e, this.shim = getOwn(q.shim, e.id), this.depExports = [], this.depMaps = [], this.depMatched = [], this.pluginMaps = {}, this.depCount = 0 }, x.prototype = {
            init: function(e, t, i, n) { n = n || {}, this.inited || (this.factory = t, i ? this.on("error", i) : this.events.error && (i = bind(this, function(e) { this.emit("error", e) })), this.depMaps = e && e.slice(0), this.errback = i, this.inited = !0, this.ignore = n.ignore, n.enabled || this.enabled ? this.enable() : this.check()) }, defineDep: function(e, t) { this.depMatched[e] || (this.depMatched[e] = !0, this.depCount -= 1, this.depExports[e] = t) },
            fetch: function() {
                if (!this.fetched) {
                    this.fetched = !0, E.startTime = (new Date).getTime();
                    var e = this.map;
                    return this.shim ? void E.makeRequire(this.map, { enableBuildCallback: !0 })(this.shim.deps || [], bind(this, function() { return e.prefix ? this.callPlugin() : this.load() })) : e.prefix ? this.callPlugin() : this.load()
                }
            },
            load: function() {
                var e = this.map.url;
                T[e] || (T[e] = !0, E.load(this.map.id, e))
            },
            check: function() {
                if (this.enabled && !this.enabling) {
                    var e, t, i = this.map.id, n = this.depExports, r = this.exports, s = this.factory;
                    if (this.inited) {
                        if (this.error)this.emit("error", this.error);
                        else if (!this.defining) {
                            if (this.defining = !0, this.depCount < 1 && !this.defined) {
                                if (isFunction(s)) {
                                    if (this.events.error && this.map.isDefine || req.onError !== defaultOnError)
                                        try {
                                            r = E.execCb(i, s, n, r)
                                        } catch (a) {
                                            e = a
                                        }
                                    else r = E.execCb(i, s, n, r);
                                    if (this.map.isDefine && void 0 === r && (t = this.module, t ? r = t.exports : this.usingExports && (r = this.exports)), e)return e.requireMap = this.map, e.requireModules = this.map.isDefine ? [this.map.id] : null, e.requireType = this.map.isDefine ? "define" : "require", u(this.error = e)
                                } else r = s;
                                this.exports = r, this.map.isDefine && !this.ignore && (j[i] = r, req.onResourceLoad && req.onResourceLoad(E, this.map, this.depMaps)), h(i), this.defined = !0
                            }
                            this.defining = !1, this.defined && !this.defineEmitted && (this.defineEmitted = !0, this.emit("defined", this.exports), this.defineEmitComplete = !0)
                        }
                    } else this.fetch()
                }
            },
            callPlugin: function() {
                var e = this.map, t = e.id, n = a(e.prefix);
                this.depMaps.push(n), c(n, "defined", bind(this, function(n) {
                    var r, s, d, p = getOwn(R, this.map.id), f = this.map.name, l = this.map.parentMap ? this.map.parentMap.name : null, m = E.makeRequire(e.parentMap, { enableBuildCallback: !0 });
                    return this.map.unnormalized ? (n.normalize && (f = n.normalize(f, function(e) { return i(e, l, !0) }) || ""), s = a(e.prefix + "!" + f, this.map.parentMap), c(s, "defined", bind(this, function(e) { this.init([], function() { return e }, null, { enabled: !0, ignore: !0 }) })), d = getOwn(k, s.id), void(d && (this.depMaps.push(s), this.events.error && d.on("error", bind(this, function(e) { this.emit("error", e) })), d.enable()))) : p ? (this.map.url = E.nameToUrl(p), void this.load()) : (r = bind(this, function(e) { this.init([], function() { return e }, null, { enabled: !0 }) }), r.error = bind(this, function(e) { this.inited = !0, this.error = e, e.requireModules = [t], eachProp(k, function(e) { 0 === e.map.id.indexOf(t + "_unnormalized") && h(e.map.id) }), u(e) }), r.fromText = bind(this, function(i, n) {
                        var s = e.name, c = a(s), d = useInteractive;
                        n && (i = n), d && (useInteractive = !1), o(c), hasProp(q.config, t) && (q.config[s] = q.config[t]);
                        try {
                            req.exec(i)
                        } catch (h) {
                            return u(makeError("fromtexteval", "fromText eval for " + t + " failed: " + h, h, [t]))
                        }
                        d && (useInteractive = !0), this.depMaps.push(c), E.completeLoad(s), m([s], r)
                    }), void n.load(e.name, m, r, q))
                })), E.enable(n, this), this.pluginMaps[n.id] = n
            },
            enable: function() {
                S[this.map.id] = this, this.enabled = !0, this.enabling = !0, each(this.depMaps, bind(this, function(e, t) {
                    var i, n, r;
                    if ("string" == typeof e) {
                        if (e = a(e, this.map.isDefine ? this.map : this.map.parentMap, !1, !this.skipMap), this.depMaps[t] = e, r = getOwn(w, e.id))return void(this.depExports[t] = r(this));
                        this.depCount += 1, c(e, "defined", bind(this, function(e) { this.defineDep(t, e), this.check() })), this.errback && c(e, "error", bind(this, this.errback))
                    }
                    i = e.id, n = k[i], hasProp(w, i) || !n || n.enabled || E.enable(e, this)
                })), eachProp(this.pluginMaps, bind(this, function(e) {
                    var t = getOwn(k, e.id);
                    t && !t.enabled && E.enable(e, this)
                })), this.enabling = !1, this.check()
            },
            on: function(e, t) {
                var i = this.events[e];
                i || (i = this.events[e] = []), i.push(t)
            },
            emit: function(e, t) { each(this.events[e], function(e) { e(t) }), "error" === e && delete this.events[e] }
        }, E = {
            config: q, contextName: e, registry: k, defined: j, urlFetched: T, defQueue: M, Module: x, makeModuleMap: a, nextTick: req.nextTick, onError: u,
            configure: function(e) {
                e.baseUrl && "/" !== e.baseUrl.charAt(e.baseUrl.length - 1) && (e.baseUrl += "/");
                var t = q.shim, i = { paths: !0, bundles: !0, config: !0, map: !0 };
                eachProp(e, function(e, t) { i[t] ? (q[t] || (q[t] = {}), mixin(q[t], e, !0, !0)) : q[t] = e }), e.bundles && eachProp(e.bundles, function(e, t) { each(e, function(e) { e !== t && (R[e] = t) }) }), e.shim && (eachProp(e.shim, function(e, i) { isArray(e) && (e = { deps: e }), !e.exports && !e.init || e.exportsFn || (e.exportsFn = E.makeShimExports(e)), t[i] = e }), q.shim = t), e.packages && each(e.packages, function(e) {
                    var t, i;
                    e = "string" == typeof e ? { name: e } : e, i = e.name, t = e.location, t && (q.paths[i] = e.location), q.pkgs[i] = e.name + "/" + (e.main || "main").replace(currDirRegExp, "").replace(jsSuffixRegExp, "")
                }), eachProp(k, function(e, t) { e.inited || e.map.unnormalized || (e.map = a(t)) }), (e.deps || e.callback) && E.require(e.deps || [], e.callback)
            },
            makeShimExports: function(e) {
                function t() {
                    var t;
                    return e.init && (t = e.init.apply(global, arguments)), t || e.exports && getGlobal(e.exports)
                }

                return t
            },
            makeRequire: function(t, r) {
                function s(i, n, c) {
                    var d, h, p;
                    return r.enableBuildCallback && n && isFunction(n) && (n.__requireJsBuild = !0), "string" == typeof i ? isFunction(n) ? u(makeError("requireargs", "Invalid require call"), c) : t && hasProp(w, i) ? w[i](k[t.id]) : req.get ? req.get(E, i, t, s) : (h = a(i, t, !1, !0), d = h.id, hasProp(j, d) ? j[d] : u(makeError("notloaded", 'Module name "' + d + '" has not been loaded yet for context: ' + e + (t ? "" : ". Use require([])")))) : (v(), E.nextTick(function() { v(), p = o(a(null, t)), p.skipMap = r.skipMap, p.init(i, n, c, { enabled: !0 }), f() }), s)
                }

                return r = r || {}, mixin(s, {
                    isBrowser: isBrowser,
                    toUrl: function(e) {
                        var n, r = e.lastIndexOf("."), s = e.split("/")[0], a = "." === s || ".." === s;
                        return-1 !== r && (!a || r > 1) && (n = e.substring(r, e.length), e = e.substring(0, r)), E.nameToUrl(i(e, t && t.id, !0), n, !0)
                    },
                    defined: function(e) { return hasProp(j, a(e, t, !1, !0).id) },
                    specified: function(e) { return e = a(e, t, !1, !0).id, hasProp(j, e) || hasProp(k, e) }
                }), t || (s.undef = function(e) {
                    d();
                    var i = a(e, t, !0), r = getOwn(k, e);
                    n(e), delete j[e], delete T[i.url], delete O[e], eachReverse(M, function(t, i) { t[0] === e && M.splice(i, 1) }), r && (r.events.defined && (O[e] = r.events), h(e))
                }), s
            },
            enable: function(e) {
                var t = getOwn(k, e.id);
                t && o(e).enable()
            },
            completeLoad: function(e) {
                var t, i, n, s = getOwn(q.shim, e) || {}, a = s.exports;
                for (d(); M.length;) {
                    if (i = M.shift(), null === i[0]) {
                        if (i[0] = e, t)break;
                        t = !0
                    } else i[0] === e && (t = !0);
                    l(i)
                }
                if (n = getOwn(k, e), !t && !hasProp(j, e) && n && !n.inited) {
                    if (!(!q.enforceDefine || a && getGlobal(a)))return r(e) ? void 0 : u(makeError("nodefine", "No define call for " + e, null, [e]));
                    l([e, s.deps || [], s.exportsFn])
                }
                f()
            },
            nameToUrl: function(e, t, i) {
                var n, r, s, a, o, c, u, d = getOwn(q.pkgs, e);
                if (d && (e = d), u = getOwn(R, e))return E.nameToUrl(u, t, i);
                if (req.jsExtRegExp.test(e))o = e + (t || "");
                else {
                    for (n = q.paths, r = e.split("/"), s = r.length; s > 0; s -= 1)
                        if (a = r.slice(0, s).join("/"), c = getOwn(n, a)) {
                            isArray(c) && (c = c[0]), r.splice(0, s, c);
                            break
                        }
                    o = r.join("/"), o += t || (/^data\:|\?/.test(o) || i ? "" : ".js"), o = ("/" === o.charAt(0) || o.match(/^[\w\+\.\-]+:/) ? "" : q.baseUrl) + o
                }
                return q.urlArgs ? o + ((-1 === o.indexOf("?") ? "?" : "&") + q.urlArgs) : o
            },
            load: function(e, t) { req.load(E, e, t) },
            execCb: function(e, t, i, n) { return t.apply(n, i) },
            onScriptLoad: function(e) {
                if ("load" === e.type || readyRegExp.test((e.currentTarget || e.srcElement).readyState)) {
                    interactiveScript = null;
                    var t = g(e);
                    E.completeLoad(t.id)
                }
            },
            onScriptError: function(e) {
                var t = g(e);
                return r(t.id) ? void 0 : u(makeError("scripterror", "Script error for: " + t.id, e, [t.id]))
            }
        }, E.require = E.makeRequire(), E
    }

    function getInteractiveScript() { return interactiveScript && "interactive" === interactiveScript.readyState ? interactiveScript : (eachReverse(scripts(), function(e) { return"interactive" === e.readyState ? interactiveScript = e : void 0 }), interactiveScript) }

    var req, s, head, baseElement, dataMain, src, interactiveScript, currentlyAddingScript, mainScript, subPath, version = "2.1.11", commentRegExp = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/gm, cjsRequireRegExp = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g, jsSuffixRegExp = /\.js$/, currDirRegExp = /^\.\//, op = Object.prototype, ostring = op.toString, hasOwn = op.hasOwnProperty, ap = Array.prototype, apsp = ap.splice, isBrowser = !("undefined" == typeof window || "undefined" == typeof navigator || !window.document), isWebWorker = !isBrowser && "undefined" != typeof importScripts, readyRegExp = isBrowser && "PLAYSTATION 3" === navigator.platform ? /^complete$/ : /^(complete|loaded)$/, defContextName = "_", isOpera = "undefined" != typeof opera && "[object Opera]" === opera.toString(), contexts = {}, cfg = {}, globalDefQueue = [], useInteractive = !1;
    if ("undefined" == typeof define) {
        if ("undefined" != typeof requirejs) {
            if (isFunction(requirejs))return;
            cfg = requirejs, requirejs = void 0
        }
        "undefined" == typeof require || isFunction(require) || (cfg = require, require = void 0), req = requirejs = function(e, t, i, n) {
            var r, s, a = defContextName;
            return isArray(e) || "string" == typeof e || (s = e, isArray(t) ? (e = t, t = i, i = n) : e = []), s && s.context && (a = s.context), r = getOwn(contexts, a), r || (r = contexts[a] = req.s.newContext(a)), s && r.configure(s), r.require(e, t, i)
        }, req.config = function(e) { return req(e) }, req.nextTick = "undefined" != typeof setTimeout ? function(e) { setTimeout(e, 4) } : function(e) { e() }, require || (require = req), req.version = version, req.jsExtRegExp = /^\/|:|\?|\.js$/, req.isBrowser = isBrowser, s = req.s = { contexts: contexts, newContext: newContext }, req({}), each(["toUrl", "undef", "defined", "specified"], function(e) {
            req[e] = function() {
                var t = contexts[defContextName];
                return t.require[e].apply(t, arguments)
            }
        }), isBrowser && (head = s.head = document.getElementsByTagName("head")[0], baseElement = document.getElementsByTagName("base")[0], baseElement && (head = s.head = baseElement.parentNode)), req.onError = defaultOnError, req.createNode = function(e) {
            var t = e.xhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "html:script") : document.createElement("script");
            return t.type = e.scriptType || "text/javascript", t.charset = "utf-8", t.async = !0, t
        }, req.load = function(e, t, i) {
            var n, r = e && e.config || {};
            if (isBrowser)return n = req.createNode(r, t, i), n.setAttribute("data-requirecontext", e.contextName), n.setAttribute("data-requiremodule", t), !n.attachEvent || n.attachEvent.toString && n.attachEvent.toString().indexOf("[native code") < 0 || isOpera ? (n.addEventListener("load", e.onScriptLoad, !1), n.addEventListener("error", e.onScriptError, !1)) : (useInteractive = !0, n.attachEvent("onreadystatechange", e.onScriptLoad)), n.src = i, currentlyAddingScript = n, baseElement ? head.insertBefore(n, baseElement) : head.appendChild(n), currentlyAddingScript = null, n;
            if (isWebWorker)
                try {
                    importScripts(i), e.completeLoad(t)
                } catch (s) {
                    e.onError(makeError("importscripts", "importScripts failed for " + t + " at " + i, s, [t]))
                }
        }, isBrowser && !cfg.skipDataMain && eachReverse(scripts(), function(e) { return head || (head = e.parentNode), dataMain = e.getAttribute("data-main"), dataMain ? (mainScript = dataMain, cfg.baseUrl || (src = mainScript.split("/"), mainScript = src.pop(), subPath = src.length ? src.join("/") + "/" : "./", cfg.baseUrl = subPath), mainScript = mainScript.replace(jsSuffixRegExp, ""), req.jsExtRegExp.test(mainScript) && (mainScript = dataMain), cfg.deps = cfg.deps ? cfg.deps.concat(mainScript) : [mainScript], !0) : void 0 }), define = function(e, t, i) {
            var n, r;
            "string" != typeof e && (i = t, t = e, e = null), isArray(t) || (i = t, t = null), !t && isFunction(i) && (t = [], i.length && (i.toString().replace(commentRegExp, "").replace(cjsRequireRegExp, function(e, i) { t.push(i) }), t = (1 === i.length ? ["require"] : ["require", "exports", "module"]).concat(t))), useInteractive && (n = currentlyAddingScript || getInteractiveScript(), n && (e || (e = n.getAttribute("data-requiremodule")), r = contexts[n.getAttribute("data-requirecontext")])), (r ? r.defQueue : globalDefQueue).push([e, t, i])
        }, define.amd = { jQuery: !0 }, req.exec = function(text) { return eval(text) }, req(cfg)
    }
}(this), define("../vendor/require", function() {}), define("module.configuration", [], function() { return{ version: "0.1" } }), define("module.utilities", [], function() {
    Function.prototype.bind || (Function.prototype.bind = function(e) {
        var t = [].slice, i = t.call(arguments, 1), n = this, r = function() {}, s = function() { return n.apply(this instanceof r ? this : e || {}, i.concat(t.call(arguments))) };
        return r.prototype = n.prototype, s.prototype = new r, s
    }), Object.create || (Object.create = function(e) {
        function t() {}

        return t.prototype = e, new t
    }), Object.construct || (Object.construct = function(e) {
        var t = Object.create(e);
        return t.initialize && t.initialize.apply(t, [].slice.call(arguments, 1)), t
    }), Object.extend || (Object.extend = function(e, t) {
        for (var i in t)t.hasOwnProperty(i) && (e[i] = t[i]);
        return e
    })
}), define("game", [], function() {
    var e = {
        start: function(t, i, n) { return Object.construct(e.Runner, t, i, n).game }, addEvent: function(e, t, i) { e.addEventListener(t, i, !1) }, removeEvent: function(e, t, i) { e.removeEventListener(t, i, !1) }, ready: function(t) { e.addEvent(document, "DOMContentLoaded", t) }, createCanvas: function() { return document.createElement("canvas") }, random: function(e, t) { return e + Math.random() * (t - e) }, timestamp: function() { return window.performance && window.performance.now ? window.performance.now() : (new Date).getTime() }, KEY: { BACKSPACE: 8, TAB: 9, RETURN: 13, ESC: 27, SPACE: 32, PAGEUP: 33, PAGEDOWN: 34, END: 35, HOME: 36, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, INSERT: 45, DELETE: 46, ZERO: 48, ONE: 49, TWO: 50, THREE: 51, FOUR: 52, FIVE: 53, SIX: 54, SEVEN: 55, EIGHT: 56, NINE: 57, A: 65, B: 66, C: 67, D: 68, E: 69, F: 70, G: 71, H: 72, I: 73, J: 74, K: 75, L: 76, M: 77, N: 78, O: 79, P: 80, Q: 81, R: 82, S: 83, T: 84, U: 85, V: 86, W: 87, X: 88, Y: 89, Z: 90, TILDA: 192 },
        Runner: {
            initialize: function(t, i, n) { this.config = Object.extend(i.defaults || {}, n || {}), this.fps = this.config.fps || 60, this.interval = 1e3 / this.fps, this.canvas = document.getElementById(t), this.width = this.config.width || this.canvas.offsetWidth, this.height = this.config.height || this.canvas.offsetHeight, this.front = this.canvas, this.front.width = this.width, this.front.height = this.height, this.back = e.createCanvas(), this.back.width = this.width, this.back.height = this.height, this.front2d = this.front.getContext("2d"), this.back2d = this.back.getContext("2d"), this.addEvents(), this.resetStats(), this.game = Object.construct(i, this, this.config) }, start: function() { this.lastFrame = e.timestamp(), this.timer = setInterval(this.loop.bind(this), this.interval) }, stop: function() { clearInterval(this.timer) },
            loop: function() {
                var t = e.timestamp();
                this.update((t - this.lastFrame) / 1e3);
                var i = e.timestamp();
                this.draw();
                var n = e.timestamp();
                this.updateStats(i - t, n - i), this.lastFrame = t
            },
            update: function(e) { this.game.update(e) },
            draw: function() { this.back2d.clearRect(0, 0, this.width, this.height), this.game.draw(this.back2d), this.drawStats(this.back2d), this.front2d.clearRect(0, 0, this.width, this.height), this.front2d.drawImage(this.back, 0, 0) },
            resetStats: function() { this.stats = { count: 0, fps: 0, update: 0, draw: 0, frame: 0 } },
            updateStats: function(e, t) { this.config.stats && (this.stats.update = Math.max(1, e), this.stats.draw = Math.max(1, t), this.stats.frame = this.stats.update + this.stats.draw, this.stats.count = this.stats.count == this.fps ? 0 : this.stats.count + 1, this.stats.fps = Math.min(this.fps, 1e3 / this.stats.frame)) },
            drawStats: function(e) { this.config.stats && (e.fillText("frame: " + this.stats.count, this.width - 100, this.height - 60), e.fillText("fps: " + this.stats.fps, this.width - 100, this.height - 50), e.fillText("update: " + this.stats.update, this.width - 100, this.height - 40), e.fillText("draw: " + this.stats.draw, this.width - 100, this.height - 30)) },
            addEvents: function() { e.addEvent(document, "keydown", this.onkeydown.bind(this)), e.addEvent(document, "keyup", this.onkeyup.bind(this)) },
            onkeydown: function(e) { this.game.onkeydown && this.game.onkeydown(e.keyCode) },
            onkeyup: function(e) { this.game.onkeyup && this.game.onkeyup(e.keyCode) },
            hideCursor: function() { this.canvas.style.cursor = "none" },
            showCursor: function() { this.canvas.style.cursor = "auto" },
            alert: function(e) {
                this.stop();
                var t = window.alert(e);
                return this.start(), t
            },
            confirm: function(e) {
                this.stop();
                var t = window.confirm(e);
                return this.start(), t
            }
        }
    };
    return e
}), requirejs.config({ baseUrl: "source/main", paths: { app: "../app" } }), requirejs(["module.configuration", "module.utilities", "game"], function(e, t, i) {
    i.start("canvas", {
        initialize: function(e) { e.start() }, update: function() {}, draw: function() {},
        onkeydown: function(e) {
            switch (e) {
            case i.KEY.W:
                console.log("W")
            }
        }
    })
}), define("../main", function() {});