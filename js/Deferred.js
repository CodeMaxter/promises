var Deferred = (function () {
    "use strict";

    /**
     * Constructor
     * 
     * @param {type} onFulfilled
     * @param {type} onRejected
     * @param {type} resolve
     * @param {type} reject
     * @returns Deferred
     */
    var Deferred = function (onFulfilled, onRejected, resolve, reject) {
        this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
        this.onRejected = typeof onRejected === 'function' ? onRejected : null;
        this.resolve = resolve;
        this.reject = reject;
    };

    return Deferred;
}());