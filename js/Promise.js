/**
 * A promise can be in one of 2 states.
 * The ERROR and SUCCESS states are terminal, the PENDING state is the only
 * start state.
 */
var Promise = /*Promise || */(function() {
    "use strict";

    /**
     * Constructor
     * 
     * @param function resolver
     * @returns Promise
     */
    var Promise = function(resolver) {
        // private members
        var _self = this, _value = null, _deferreds = [], _finally, _handle, 
            _reject, _resolve, PENDING = 0, REJECTED = -1, FULFILLED = 1, 
            _state = PENDING;

        _finally = function() {
            for (var index = 0, length = _deferreds.length; index < length; ++index) {
                _handle(_deferreds[index]);
            }

            _deferreds.length = 0;
        };

        _handle = function(deferred) {
            if (PENDING === _state) {
                _deferreds.push(deferred);
                return;
            }

            setTimeout(function() {
                var result, callback = FULFILLED === _state ? deferred.onFulfilled : deferred.onRejected;

                if (null === callback) {
                    (FULFILLED === _state ? deferred.resolve : deferred.reject)(_value);
                    return;
                }

                try {
                    result = callback(_value);
                } catch (exception) {
                    deferred.reject(exception);
                    return;
                }

                deferred.resolve(result);
            }.apply(_value), 0);
        };

        _reject = function(newValue) {
            _state = REJECTED;
            _value = newValue;
            _finally();
        };

        _resolve = function(newValue) {
            try {
                if (newValue === _self) {
                    throw new TypeError('A promise cannot be resolved with itself.');
                }

                if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
                    var then = newValue.then;
                    if (typeof then === 'function') {
                        then.call(newValue, _resolve, _reject)
                        return;
                    }
                }

                _state = FULFILLED;
                _value = newValue;
                _finally();
            } catch (exception) {
                _reject(exception);
            }
        };

        if (typeof this !== 'object') {
            throw new TypeError('Promises must be constructed via new');
        }

        if (typeof resolver !== 'function') {
            throw new TypeError('Promise constructor takes a function argument')
        }

        // Privileged members
        this.then = function(onFulfilled, onRejected) {
            return new Promise(function(resolve, reject) {
                _handle(Promise.defer(onFulfilled, onRejected, resolve, reject));
            });
        };

        try {
            resolver(_resolve, _reject);
        } catch (e) {
            _reject(e);
        }
    };

    // Static methods
    Promise.reject = function(reason) {
        return new Promise(function(resolve, reject) {
            reject(reason);
        });
    };

    Promise.resolve = function(value) {
        if (value instanceof Promise) {
            return value;
        }

        return new Promise(function(resolve) {
            resolve(value);
        });
    };

    Promise.prototype = {
        done: function(onFulfilled, onRejected) {
            var self = arguments.length ? this.then.apply(this, arguments) : this;
            self.then(null, function(reason) {
                setTimeout(function() {
//                    throw reason;
                }, 0);
            });

            return undefined;
        },
        'catch': function(onRejected) {
            this.then(null, onRejected);
            return this;
        },
        isComplete: function() {
            return _state !== PENDING;
        },
        isRejected: function() {
            return _state === REJECTED;
        },
        isResolved: function() {
            return _state === FULFILLED;
        }
    };

//    Promise.defer = _getDeferred;
    Promise.defer = function(onFulfilled, onRejected, resolve, reject) {
        return {
//            promise: new Promise(function (resolve, reject) {}),
            onFulfilled: typeof onFulfilled === 'function' ? onFulfilled : null,
            onRejected: typeof onRejected === 'function' ? onRejected : null,
            resolve: resolve,
            reject: reject
        };
    };

    // return module
    return Promise;
})();