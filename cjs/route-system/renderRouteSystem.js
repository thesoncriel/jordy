"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderRouteSystem = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importStar)(require("react"));
var react_router_dom_1 = require("react-router-dom");
var AsyncGuard_1 = require("./AsyncGuard");
function toPromiseList(guardList) {
    return guardList.map(function (fn) {
        var ret = fn();
        if (ret instanceof Promise) {
            return ret;
        }
        return Promise.resolve(ret);
    });
}
function renderSubRoute(route, notFound, guardList) {
    if (guardList === void 0) { guardList = []; }
    var Comp = route.component;
    var Wrap = route.wrap || react_1.default.Fragment;
    if (route.guard) {
        guardList.push(route.guard);
        if (route.child) {
            return (react_1.default.createElement(Wrap, null, (0, exports.renderRouteSystem)(route.child, true, notFound, (0, tslib_1.__spreadArray)([], guardList, true))));
        }
        var guardResults = function () {
            return Promise.all(toPromiseList(guardList)).then(function (items) {
                return items.every(Boolean);
            });
        };
        return (react_1.default.createElement(Wrap, null,
            react_1.default.createElement(react_1.Suspense, { fallback: react_1.default.createElement(react_1.default.Fragment, null) },
                react_1.default.createElement(AsyncGuard_1.AsyncGuard, { guard: guardResults, redirect: route.redirect, failComponent: route.failComponent }, Comp && react_1.default.createElement(Comp, null)))));
    }
    if (route.redirect) {
        return react_1.default.createElement(react_router_dom_1.Redirect, { to: route.redirect });
    }
    if (route.child) {
        return (react_1.default.createElement(Wrap, null, (0, exports.renderRouteSystem)(route.child, true, notFound, (0, tslib_1.__spreadArray)([], guardList, true))));
    }
    if (guardList.length > 0) {
        var guardResults = function () {
            return Promise.all(toPromiseList(guardList)).then(function (items) {
                return items.every(Boolean);
            });
        };
        return (react_1.default.createElement(Wrap, null,
            react_1.default.createElement(react_1.Suspense, { fallback: react_1.default.createElement(react_1.default.Fragment, null) },
                react_1.default.createElement(AsyncGuard_1.AsyncGuard, { guard: guardResults, redirect: route.redirect, failComponent: route.failComponent }, Comp && react_1.default.createElement(Comp, null)))));
    }
    return (react_1.default.createElement(Wrap, null,
        react_1.default.createElement(react_1.Suspense, { fallback: react_1.default.createElement(react_1.default.Fragment, null) }, Comp && react_1.default.createElement(Comp, null))));
}
var renderRouteSystem = function (routes, withSwitch, notFound, guardList) {
    if (guardList === void 0) { guardList = []; }
    var NotFound = notFound;
    if (withSwitch) {
        return (react_1.default.createElement(react_router_dom_1.Switch, null,
            routes.map(function (route) { return (react_1.default.createElement(react_router_dom_1.Route, { key: route.path, path: route.path, exact: route.exact }, renderSubRoute(route, notFound, (0, tslib_1.__spreadArray)([], guardList, true)))); }),
            NotFound && react_1.default.createElement(NotFound, null)));
    }
    var renders = routes.map(function (route) { return (react_1.default.createElement(react_router_dom_1.Route, { key: route.path, path: route.path, exact: route.exact }, renderSubRoute(route, notFound, (0, tslib_1.__spreadArray)([], guardList, true)))); });
    if (NotFound) {
        renders.push(react_1.default.createElement(NotFound, { key: "%%not-found%%" }));
    }
    return renders;
};
exports.renderRouteSystem = renderRouteSystem;
