function validateSingle(val, item) {
    var result = item.check(val);
    var msg = !result ? item.message : '';
    return {
        result: result,
        message: msg,
    };
}
function _validateBulk(val, opt) {
    var mRes;
    if (Array.isArray(opt)) {
        opt.every(function (_opt) {
            var _mRes = validateSingle(val, _opt);
            if (!_mRes.result) {
                mRes = _mRes;
            }
            return _mRes.result;
        });
    }
    else {
        mRes = validateSingle(val, opt);
    }
    return (mRes || {
        result: true,
        message: '',
    });
}
export function validate(state, opt) {
    var mRet = {};
    var invalidKeys = [];
    var validKeys = [];
    var errorMessages = {};
    var isValid = true;
    var firstMessage = '';
    Object.keys(opt).forEach(function (key) {
        var val = state[key];
        var items = opt[key];
        var _mRet = _validateBulk(val, items);
        mRet[key] = _mRet;
        isValid = isValid && _mRet.result;
        if (_mRet.result) {
            validKeys.push(key);
        }
        else {
            invalidKeys.push(key);
            errorMessages[key] = _mRet.message;
            if (!firstMessage) {
                firstMessage = _mRet.message;
            }
        }
    });
    return {
        isValid: isValid,
        results: mRet,
        validKeys: validKeys,
        invalidKeys: invalidKeys,
        errorMessages: errorMessages,
        firstMessage: firstMessage,
    };
}
