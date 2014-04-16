# JavaScript Promises Library

This library is a light and dead simple [Promises](http://www.promisejs.org/) implementation following a 
well-structured OOP pattern.

I hope to create a compliant with the Promises/A+ specification.

## Usage
To use the library simply include the file with the class:

```html
<script src="js/Promise.js"></script>
```

Now you can create a promise instance:

```JavaScript
var promise = new Promise(function (resolve, reject) {
    // some asynchronous task here
    // resolve(someValue);  If the task was performed successfully
    // reject('some reason'); If the task failed
});
```

## Tutorial
```JavaScript
var promise = new Promise(function(resolve, reject) {
    setTimeout(function () {
        var probability = Math.floor((Math.random()*10) + 1);
        if (probability < 6) {
            resolve(1);
        } else {
            reject('Bad luck. The probability was ' + probability);
        }
    }, 1000);
});

var messages = document.querySelector('#messages');

promise.then(function (val) {
    console.log(val); // 1
    return val + 2;
}).then(function (val) {
    console.log(val); // 3
    return val + 2;
}).then(function (val) {
    console.log(val); // 5
    return val;
}).fail(function (reason) {
    console.log('Fail: %s', reason);
}).done(function (value) {
    console.log('All process is done. Result: %s', value);
});
```

## Constructor

### new Promise(resolver)

This creates and returns a new promise,  `resolver` must be a function;  the `resolver` function is passed two arguments:

 1. `resolve`: Should be called with a single argument.  If it is called with a non-promise value then the promise is fulfilled with that value.  If it is called with a promise (A) then the returned promise takes on the state of that new promise (A).
 2. `reject`: Should be called with a single argument.  The returned promise will be rejected with that argument.

## Public Methods

These methods are invoked on a promise instance by calling `promise.methodName`

#### done: function (onFulfilled)

Add handlers to be called when the Promise object is resolved

#### fail: function (onRejected)

Add handlers to be called when the Promise object is rejected. 

#### isRejected: function ()

Determine whether a Promise object has been rejected.

#### isResolved: function ()

Determine whether a Promise object has been resolved.

#### then(onFulfilled, onRejected)

Add handlers to be called when the Promise object is resolved, rejected.


## Static Methods

These methods are invoked by calling `Promise.methodName`.

#### Promise.reject function (reason)

Return a rejected Promise object with a given reason.

#### Promise.resolve function (value)

Return a Resolved Promise object with a given value.