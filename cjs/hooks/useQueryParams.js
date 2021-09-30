"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useQueryParams = void 0;
var tslib_1 = require("tslib");
var react_router_dom_1 = require("react-router-dom");
var util_1 = require("../util");
function useQueryParams(selector) {
    var location = (0, react_router_dom_1.useLocation)();
    var params = (0, react_router_dom_1.useParams)();
    var query = (0, util_1.parseQueryString)(location.search);
    var result = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, query), params);
    if (typeof selector === 'function') {
        return selector(result);
    }
    return result;
}
exports.useQueryParams = useQueryParams;
