// class MyPromise {
//     constructor(callback) {
//         this.status = "pedding";
//         this.onFulfilled = function() {};
//         this.onRejected = function() {};

//         this.resolve = function(param) {
//             if (this.status !== "pedding") {
//                 return;
//             }
//             this.status = "resolve";
//             this.value = param;
//             this.onFulfilled(param);
//         };

//         this.reject = function(param) {
//             if (this.status !== "pedding") {
//                 return;
//             }
//             this.status = "reject";
//             this.error = param;
//             this.onRejected(param);
//         };
//         callback(this.resolve.bind(this), this.reject.bind(this));
//     }

//     then(onFulfilled, onRejected) {
//         if (this.status === "resolve") {
//             onFulfilled(this.value);
//         } else if (this.status === "reject") {
//             onRejected(this.error);
//         } else if (this.status === "pedding") {
//             this.onFulfilled = onFulfilled;
//             this.onRejected = onRejected;
//         }
//     }
// }

// function ES5Promise(callback) {
//     this.status = "pedding";
//     this.onFulfilled = function() {};
//     this.onRejected = function() {};

//     this.resolve = function(param) {
//         if (this.status !== "pedding") {
//             return;
//         }
//         this.status = "resolve";
//         this.value = param;
//         // this.onFulfilled(param);
//         return new ES5Promise((resolve, reject) => {
//             try {
//                 resolve(this.onFulfilled(param));
//             } catch (error) {
//                 reject(error);
//             }
//         });
//     };

//     this.reject = function(param) {
//         if (this.status !== "pedding") {
//             return;
//         }
//         this.status = "reject";
//         this.error = param;
//         return new ES5Promise((resolve, reject) => {
//             reject(this.onRejected(param));
//         });
//     };
//     callback(this.resolve.bind(this), this.reject.bind(this));
// }

// ES5Promise.prototype.then = function(onFulfilled, onRejected) {
//     if (this.status === "resolve") {
//         return new ES5Promise((resolve, reject) => {
//             try {
//                 resolve(onFulfilled(this.value));
//             } catch (error) {
//                 reject(onFulfilled(this.value));
//             }
//         });
//     } else if (this.status === "reject") {
//         return new ES5Promise((resolve, reject) => {
//             reject(onRejected(this.error));
//         });
//     } else if (this.status === "pedding") {
//         this.onFulfilled = onFulfilled;
//         this.onRejected = onRejected;
//     }
// };

// module.exports = {
//     MyPromise,
//     ES5Promise
// };
var executeAsync;
if (typeof process == "object" && process.nextTick) {
    executeAsync = process.nextTick;
} else if (typeof setImmediate == "function") {
    executeAsync = setImmediate;
} else {
    executeAsync = function(fn) {
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
}
const PEDDING = "pedding";
const RESOLVE = "resolve";
const REJECT = "reject";
function isFunction(fn) {
    return typeof fn === "function";
}

class MyPromise {
    constructor(callback) {
        if (typeof callback !== "function") {
            return new Error("Promise callback must be a function");
        }
        this._status = PEDDING;
        this._value = undefined;
        this._error = undefined;
        this.onSuccess = [];
        this.onError = [];
    }
    resolve(params) {
        if (this._status !== PEDDING) {
            return;
        }
        this._status = RESOLVE;
        this._value = params;
    }
    reject(params) {
        if (this._status !== PEDDING) {
            return;
        }
        this._status = REJECT;
        this._error = params;
    }
    then(onFulfilled, onRejected) {
        return new MyPromise((resolve, reject) => {
            let success = value => {
                if (isFunction(onFulfilled)) {
                    callAsync(onFulfilled, value);
                } else {
                    try {
                        resolve(value);
                    } catch (error) {
                        reject(error);
                    }
                }
            };
            // 封装一个失败时执行的函数
            let error = error => {
                if (isFunction(onRejected)) {
                    callAsync(
                        onRejected,
                        error,
                        res => {
                            if (res instanceof MyPromise) {
                                // 如果当前回调函数返回MyPromise对象，必须等待其状态改变后在执行下一个回调
                                res.then(onFulfilledNext, onRejectedNext);
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
        });
    }
}
