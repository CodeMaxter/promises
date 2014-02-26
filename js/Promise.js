var Promise = (function (Deferred) {
    "use strict";

    // private members
    var Promise, state = null, value = null, deferreds = [],
        doResolve, finale, handle, reject, resolve, self = this;

    finale = function() {
        deferreds.forEach(function(deferred) {
            handle(deferred);
        });

        deferreds.length = 0;
    };

    handle = function(deferred) {
        if (state === null) {
            deferreds.push(deferred);
            return;
        }

        setTimeout(function() {
            var result, callback = state ? deferred.onFulfilled : deferred.onRejected;

            if (null === callback) {
                (state ? deferred.resolve : deferred.reject)(value);
                return;
            }

            try {
                result = callback(value);
            }
            catch (exception) {
                deferred.reject(exception);
                return;
            }

            deferred.resolve(result);
        }.apply(value), 0);
    };

    reject = function(newValue) {
        state = false;
        value = newValue;
        finale();
    };

    resolve = function(newValue) {
        try {
            if (newValue === self) {
                throw new TypeError('A promise cannot be resolved with itself.');
            }

            if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
                var then = newValue.then;
                if (typeof then === 'function') {
                    doResolve(then.bind(newValue), resolve, reject);
                    return;
                }
            }

            state = true;
            value = newValue;
            finale();
        } catch (exception) {
            reject(exception);
        }
    };

    doResolve = function(resolver, onFulfilled, onRejected) {
        var done = false;

        try {
            resolver(function(value) {
                if (done) {
                    return;
                }

                done = true;
                onFulfilled(value);
            }, function(reason) {
                if (done) {
                    return;
                }

                done = true;
                onRejected(reason);
            });
        } catch (exception) {
            if (done) {
                return;
            }

            done = true;
            onRejected(exception);
        }
    };

    /**
     * 
     * @param function resolver
     * @returns Promise
     */
    Promise = function(resolver) {
        if (typeof this !== 'object') {
            throw new TypeError('Promises must be constructed via new');
        }

        if (typeof resolver !== 'function') {
            throw new TypeError('Promise constructor takes a function argument')
        }

        this.value = null;

        doResolve(resolver, resolve, reject);
    };

    Promise.prototype = {
        then: function(onFulfilled, onRejected) {
            return new Promise(function(resolve, reject) {
                handle(new Deferred(onFulfilled, onRejected, resolve, reject))
            });
        }
    };

    // return module
    return Promise;
}(Deferred));