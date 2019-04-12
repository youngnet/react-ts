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

function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function _typeof(obj) {
            return typeof obj;
        };
    } else {
        _typeof = function _typeof(obj) {
            return obj &&
                typeof Symbol === "function" &&
                obj.constructor === Symbol &&
                obj !== Symbol.prototype
                ? "symbol"
                : typeof obj;
        };
    }
    return _typeof(obj);
}

var executeAsync;

if (
    (typeof process === "undefined" ? "undefined" : _typeof(process)) ==
        "object" &&
    process.nextTick
) {
    executeAsync = process.nextTick;
} else if (typeof setImmediate == "function") {
    executeAsync = setImmediate;
} else {
    executeAsync = function executeAsync(fn) {
        setTimeout(fn, 0);
    };
}

function callAsync(fn, arg, callback, onError) {
    executeAsync(function() {
        try {
            callback ? callback(fn(arg)) : fn(arg);
        } catch (e) {
            onError(e);
        }
    });
} // 判断变量否为function

var isFunction = function isFunction(variable) {
    return typeof variable === "function";
}; // 定义Promise的三种状态常量

var PENDING = "pending";
var FULFILLED = "fulfilled";
var REJECTED = "rejected";

var MyPromise =
    /*#__PURE__*/
    (function() {
        function MyPromise(handle) {
            _classCallCheck(this, MyPromise);

            if (!isFunction(handle)) {
                throw new Error(
                    "MyPromise must accept a function as a parameter"
                );
            } // 添加状态

            this._status = PENDING; // 添加状态

            this._value = null; // 添加成功回调函数队列

            this._fulfilledQueue = []; // 添加失败回调函数队列

            this._rejectedQueue = []; // 执行handle

            try {
                handle(this._resolve.bind(this), this._reject.bind(this));
            } catch (err) {
                this._reject(err);
            }
        } // 添加resovle时执行的函数

        _createClass(
            MyPromise,
            [
                {
                    key: "_resolve",
                    value: function _resolve(val) {
                        var _this = this;

                        if (this._status !== PENDING) return;
                        this._status = FULFILLED; // 依次执行成功队列中的函数，并清空队列

                        var runFulfilled = function runFulfilled(value) {
                            var cb;

                            while ((cb = _this._fulfilledQueue.shift())) {
                                cb(value);
                            }
                        }; // 依次执行失败队列中的函数，并清空队列

                        var runRejected = function runRejected(error) {
                            var cb;

                            while ((cb = _this._rejectedQueue.shift())) {
                                cb(error);
                            }
                        };
                        /* 如果resolve的参数为Promise对象，则必须等待该Promise对象状态改变后,
      当前Promsie的状态才会改变，且状态取决于参数Promsie对象的状态
      */

                        if (_instanceof(val, MyPromise)) {
                            val.then(
                                function(value) {
                                    _this._value = value;
                                    runFulfilled(value);
                                },
                                function(err) {
                                    _this._value = err;
                                    runRejected(err);
                                }
                            );
                        } else {
                            this._value = val;
                            runFulfilled(val);
                        }
                    } // 添加reject时执行的函数
                },
                {
                    key: "_reject",
                    value: function _reject(err) {
                        if (this._status !== PENDING) return; // 依次执行失败队列中的函数，并清空队列

                        this._status = REJECTED;
                        this._value = err;
                        var cb;

                        while ((cb = this._rejectedQueue.shift())) {
                            cb(err);
                        }
                    } // 添加then方法
                },
                {
                    key: "then",
                    value: function then(onFulfilled, onRejected) {
                        var _this2 = this;

                        // 返回一个新的Promise对象
                        return new MyPromise(function(
                            onFulfilledNext,
                            onRejectedNext
                        ) {
                            // 封装一个成功时执行的函数
                            var fulfilled = function fulfilled(value) {
                                if (isFunction(onFulfilled)) {
                                    callAsync(
                                        onFulfilled,
                                        value,
                                        function(res) {
                                            if (_instanceof(res, MyPromise)) {
                                                // 如果当前回调函数返回MyPromise对象，必须等待其状态改变后在执行下一个回调
                                                res.then(
                                                    onFulfilledNext,
                                                    onRejectedNext
                                                );
                                            } else {
                                                // 否则会将返回结果直接作为参数，传入下一个then的回调函数，并立即执行下一个then的回调函数
                                                onFulfilledNext(res);
                                            }
                                        },
                                        onRejectedNext
                                    );
                                } else {
                                    try {
                                        onFulfilledNext(value);
                                    } catch (err) {
                                        // 如果函数执行出错，新的Promise对象的状态为失败
                                        onRejectedNext(err);
                                    }
                                }
                            }; // 封装一个失败时执行的函数

                            var rejected = function rejected(error) {
                                if (isFunction(onRejected)) {
                                    callAsync(
                                        onRejected,
                                        error,
                                        function(res) {
                                            if (_instanceof(res, MyPromise)) {
                                                // 如果当前回调函数返回MyPromise对象，必须等待其状态改变后在执行下一个回调
                                                res.then(
                                                    onFulfilledNext,
                                                    onRejectedNext
                                                );
                                            } else {
                                                // 否则会将返回结果直接作为参数，传入下一个then的回调函数，并立即执行下一个then的回调函数
                                                onFulfilledNext(res);
                                            }
                                        },
                                        onRejectedNext
                                    );
                                } else {
                                    try {
                                        onRejectedNext(error);
                                    } catch (err) {
                                        // 如果函数执行出错，新的Promise对象的状态为失败
                                        onRejectedNext(err);
                                    }
                                }
                            };

                            switch (_this2._status) {
                                // 当状态为pending时，将then方法回调函数加入执行队列等待执行
                                case PENDING:
                                    _this2._fulfilledQueue.push(fulfilled);

                                    _this2._rejectedQueue.push(rejected);

                                    break;
                                // 当状态已经改变时，立即执行对应的回调函数

                                case FULFILLED:
                                    fulfilled(_this2._value);
                                    break;

                                case REJECTED:
                                    rejected(_this2._value);
                                    break;
                            }
                        });
                    } // 添加catch方法
                },
                {
                    key: "catch",
                    value: function _catch(onRejected) {
                        return this.then(null, onRejected);
                    } // 添加静态resolve方法
                },
                {
                    key: "finally",
                    value: function _finally(cb) {
                        return this.then(
                            function(value) {
                                return MyPromise.resolve(cb()).then(function() {
                                    return value;
                                });
                            },
                            function(reason) {
                                return MyPromise.resolve(cb()).then(function() {
                                    throw reason;
                                });
                            }
                        );
                    }
                }
            ],
            [
                {
                    key: "resolve",
                    value: function resolve(value) {
                        // 如果参数是MyPromise实例或thenable对象，直接返回value
                        return _instanceof(value, MyPromise) ||
                            (value && isFunction(value.then))
                            ? value
                            : new MyPromise(function(resolve) {
                                  return resolve(value);
                              });
                    } // 添加静态reject方法
                },
                {
                    key: "reject",
                    value: function reject(value) {
                        return new MyPromise(function(resolve, reject) {
                            return reject(value);
                        });
                    } // 添加静态all方法
                },
                {
                    key: "all",
                    value: function all(list) {
                        var _this3 = this;

                        return new MyPromise(function(resolve, reject) {
                            var values = [],
                                count = list.length;

                            var _loop = function _loop(i) {
                                // 数组参数如果不是MyPromise实例，先调用MyPromise.resolve
                                _this3.resolve(list[i]).then(function(res) {
                                    values[i] = res; // 所有状态都变成fulfilled时返回的MyPromise状态就变成fulfilled

                                    --count < 1 && resolve(values);
                                }, reject);
                            };

                            for (var i in list) {
                                _loop(i);
                            }
                        });
                    } // 添加静态race方法
                },
                {
                    key: "race",
                    value: function race(list) {
                        var _this4 = this;

                        return new MyPromise(function(resolve, reject) {
                            var _iteratorNormalCompletion = true;
                            var _didIteratorError = false;
                            var _iteratorError = undefined;

                            try {
                                for (
                                    var _iterator = list[Symbol.iterator](),
                                        _step;
                                    !(_iteratorNormalCompletion = (_step = _iterator.next())
                                        .done);
                                    _iteratorNormalCompletion = true
                                ) {
                                    var p = _step.value;

                                    // 只要有一个实例率先改变状态，新的MyPromise的状态就跟着改变
                                    _this4.resolve(p).then(function(res) {
                                        resolve(res);
                                    }, reject);
                                }
                            } catch (err) {
                                _didIteratorError = true;
                                _iteratorError = err;
                            } finally {
                                try {
                                    if (
                                        !_iteratorNormalCompletion &&
                                        _iterator.return != null
                                    ) {
                                        _iterator.return();
                                    }
                                } finally {
                                    if (_didIteratorError) {
                                        throw _iteratorError;
                                    }
                                }
                            }
                        });
                    }
                }
            ]
        );

        return MyPromise;
    })(); // 测试代码

new MyPromise(function(resolve) {
    console.log(1);
    resolve(3);
    MyPromise.resolve()
        .then(function() {
            return console.log(4);
        })
        .then(function() {
            return console.log(5);
        });
})
    .then(function(num) {
        console.log(num);
    })
    .then(function() {
        console.log(6);
    });
console.log(2); // 依次输出：1 2 4 3 5 6
