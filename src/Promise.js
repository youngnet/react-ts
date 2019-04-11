class MyPromise {
    constructor(callback) {
        this.status = "pedding";
        this.onFulfilled = function() {};
        this.onRejected = function() {};

        this.resolve = function(param) {
            this.status = "resolve";
            this.value = param;
            this.onFulfilled(param);
        };

        this.reject = function(param) {
            this.status = "reject";
            this.error = param;
            this.onRejected(param);
        };
        callback(this.resolve.bind(this), this.reject.bind(this));
    }

    then(onFulfilled, onRejected) {
        if (this.status === "resolve") {
            onFulfilled(this.value);
        } else if (this.status === "reject") {
            onRejected(this.error);
        } else if (this.status === "pedding") {
            this.onFulfilled = onFulfilled;
            this.onRejected = onRejected;
        }
    }
}

function ES5Promise(callback) {
    this.status = "pedding";
    this.onFulfilled = function() {};
    this.onRejected = function() {};

    this.resolve = function(param) {
        this.status = "resolve";
        this.value = param;
        // this.onFulfilled(param);
        return new ES5Promise((resolve, reject) => {
            try {
                resolve(this.onFulfilled(param));
            } catch (error) {
                reject(error);
            }
        });
    };

    this.reject = function(param) {
        this.status = "reject";
        this.error = param;
        return new ES5Promise((resolve, reject) => {
            reject(this.onRejected(param));
        });
    };
    callback(this.resolve.bind(this), this.reject.bind(this));
}

ES5Promise.prototype.then = function(onFulfilled, onRejected) {
    if (this.status === "resolve") {
        return new ES5Promise((resolve, reject) => {
            try {
                resolve(onFulfilled(this.value));
            } catch (error) {
                reject(onFulfilled(this.value));
            }
        });
    } else if (this.status === "reject") {
        return new ES5Promise((resolve, reject) => {
            reject(onRejected(this.error));
        });
    } else if (this.status === "pedding") {
        this.onFulfilled = onFulfilled;
        this.onRejected = onRejected;
    }
};

module.exports = {
    MyPromise,
    ES5Promise
};
