import { __spreadArray } from "tslib";
import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { AsyncGuard } from './AsyncGuard';
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
    var Wrap = route.wrap || React.Fragment;
    if (route.guard) {
        guardList.push(route.guard);
        if (route.child) {
            return (React.createElement(Wrap, null, renderRouteSystem(route.child, true, notFound, __spreadArray([], guardList, true))));
        }
        var guardResults = function () {
            return Promise.all(toPromiseList(guardList)).then(function (items) {
                return items.every(Boolean);
            });
        };
        return (React.createElement(Wrap, null,
            React.createElement(Suspense, { fallback: React.createElement(React.Fragment, null) },
                React.createElement(AsyncGuard, { guard: guardResults, redirect: route.redirect, failComponent: route.failComponent }, Comp && React.createElement(Comp, null)))));
    }
    if (route.redirect) {
        return React.createElement(Redirect, { to: route.redirect });
    }
    if (route.child) {
        return (React.createElement(Wrap, null, renderRouteSystem(route.child, true, notFound, __spreadArray([], guardList, true))));
    }
    if (guardList.length > 0) {
        var guardResults = function () {
            return Promise.all(toPromiseList(guardList)).then(function (items) {
                return items.every(Boolean);
            });
        };
        return (React.createElement(Wrap, null,
            React.createElement(Suspense, { fallback: React.createElement(React.Fragment, null) },
                React.createElement(AsyncGuard, { guard: guardResults, redirect: route.redirect, failComponent: route.failComponent }, Comp && React.createElement(Comp, null)))));
    }
    return (React.createElement(Wrap, null,
        React.createElement(Suspense, { fallback: React.createElement(React.Fragment, null) }, Comp && React.createElement(Comp, null))));
}
export var renderRouteSystem = function (routes, withSwitch, notFound, guardList) {
    if (guardList === void 0) { guardList = []; }
    var NotFound = notFound;
    if (withSwitch) {
        return (React.createElement(Switch, null,
            routes.map(function (route) { return (React.createElement(Route, { key: route.path, path: route.path, exact: route.exact }, renderSubRoute(route, notFound, __spreadArray([], guardList, true)))); }),
            NotFound && React.createElement(NotFound, null)));
    }
    var renders = routes.map(function (route) { return (React.createElement(Route, { key: route.path, path: route.path, exact: route.exact }, renderSubRoute(route, notFound, __spreadArray([], guardList, true)))); });
    if (NotFound) {
        renders.push(React.createElement(NotFound, { key: "%%not-found%%" }));
    }
    return renders;
};
