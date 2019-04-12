"use strict";

function _instanceof(left, right) {
    if (
        right != null &&
        typeof Symbol !== "undefined" &&
        right[Symbol.hasInstance]
    ) {
        return right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}

function _classCallCheck(instance, Constructor) {
    if (!_instanceof(instance, Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}

function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}

function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}

var PEDDING = "pedding";
var RESOLVE = "resolve";
var REJECT = "reject";

var MyPromise =
    /*#__PURE__*/
    (function() {
        _createClass(MyPromise, null, [
            {
                key: "myResolve",
                value: function myResolve() {
                    console.log("my resolve");
                }
            }
        ]);

        function MyPromise(callback) {
            var _this = this;

            _classCallCheck(this, MyPromise);

            _defineProperty(this, "resolve", function(params) {
                if (_this._status !== PEDDING) {
                    return;
                }

                _this._status = RESOLVE;
                _this._value = params;
            });

            _defineProperty(this, "reject", function(params) {
                if (_this._status !== PEDDING) {
                    return;
                }

                _this._status = REJECT;
                _this._error = params;
            });

            if (typeof callback !== "function") {
                return new Error("Promise callback must be a function");
            }

            this._status = PEDDING;
            this._value = undefined;
            this._error = undefined;
            this.onSuccess = [];
            this.onError = [];
        }

        _createClass(MyPromise, [
            {
                key: "then",
                value: function then(onFulfilled, onRejected) {
                    switch (this._status) {
                        case PEDDING:
                            this.onSuccess.push(onFulfilled);
                            this.onError.push(onRejected);
                            break;

                        case RESOLVE:
                            onFulfilled(this._value);
                            break;

                        default:
                            onRejected(this._error);
                            break;
                    }
                }
            }
        ]);

        return MyPromise;
    })();

_defineProperty(MyPromise, "myObj", {
    a: 111
});