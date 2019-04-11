function resolvePromise(promise, x, resolve, reject) {
    if (promise === x) {
        return reject(new TypeError("-----eroer"));
    }
    if ((x !== null && typeof x === "object") || typeof x === "function") {
        try {
            let then = x.then;
            if (typeof then === "function") {
                then.call(x, data => {
                    resolvePromise(promise, data, resolve, reject);
                });
            } else {
                resolve(x);
            }
        } catch (error) {
            reject(error);
        }
    } else {
        resolve(x);
    }
}

class Promise {
    constructor(callback){
        this.status = 'pedding';
        this.value = undefined;
        this.reason = undefined;
        this.resolve = (data) => {
          if(this.status === 'pedding'){
            this.status = 'resolve';
            this.value = data;
          }
        }
        
    }
}
