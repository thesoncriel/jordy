import { __assign } from "tslib";
import { useLocation, useParams } from 'react-router-dom';
import { parseQueryString } from '../util';
export function useQueryParams(selector) {
    var location = useLocation();
    var params = useParams();
    var query = parseQueryString(location.search);
    var result = __assign(__assign({}, query), params);
    if (typeof selector === 'function') {
        return selector(result);
    }
    return result;
}
