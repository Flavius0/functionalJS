var functionaljs =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return head; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return tail; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return forEach; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return map; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return filter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return foldL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return foldR; });


/**
 * Everything about applying functions to iterable stuff
 * See the doc at each function for more information.
 *
 * Note: iterator[Symbol.iterator]() === iterator
 * => This allows the functions to work on an iterable as well as directly on an
 * iterator
 */

/**
 * Get the first element from an iterable object
 *
 * @param {object} iter - Iterable object
 * @return {A} First element ob iter
 */
function head( iter )
{
    if( !iter )
        throw new Error('Iterable is not defined!');

    const tmp = iter[Symbol.iterator]()
    ,     val = tmp.next()
    ;
    if( val.done )
        throw new Error( 'Iterable is empty' );
    return val.value;
}

/**
 * Get an iterator over all but the first element of an iterable object
 *
 * @param {object} iter - Iterable object
 * @return {object} Iterable object
 */
function tail( iter )
{
    if( !iter )
        throw new Error('Iterable is not defined!');

    const tmp = iter[Symbol.iterator]()
    ,     val = tmp.next()
    ;
    if( val.done )
        throw new Error( 'Iterable is empty' );

    return { 
        [Symbol.iterator]: () => {
            const i = iter[Symbol.iterator]();
            i.next();
            return { next: i.next };
        }
    };
}

/**
 * Non-lazy version of map, wich will always return an array, not an iterator.
 * Can be used, if the function has side effects and needs to be execured
 * immediately, e.g. do something with a set of dom nodes.
 *
 * @param {function} f - function to apply to every element
 * @param {object} iter - Iterable object
 * @return {array} containing f(a) for each element of iter
 */
function forEach( f, iter )
{
    return [...map( f, iter )];
}

/**
 * Return an iterater over an iterable object, wich will apply `f` on the
 * element delivered from the original `iterable.next` on each `next` call.
 *
 * @param {function} f - function to apply to every element
 * @param {object} iter - Iterable object
 * @return {object} Iterable object with f(a) for each a in iter
 */
function map( f, iter )
{
    return {
        [Symbol.iterator]: () => {
            const tmp = iter[Symbol.iterator]();
            return { 
                next: (...args) => {
                    const v = tmp.next( ...args );
                    return v.done ? v 
                                  : { value: f( v.value ), done: false };
                }
            };
        }
    };
}

/**
 * Filter an iterable and return an iterable object.
 *
 * ATTENTION (could this be fixed?):
 * In case of infinite iterables, this can well lead to an endless recursion, if
 * the filter is false for every following element
 *
 * @param {function} f - a -> boolean
 * @param {object} iter - Iterable object
 * @return {object} Iterable object containing each a of iter where f(a) === true 
 */
function filter( f, iter )
{
    return {
        [Symbol.iterator]: () => {
            const tmp = iter[Symbol.iterator]();
            return { next: gen_next( tmp )};
        }
    };

    function gen_next( iter )
    {
        return next;

        function next(...args) {
            const v = iter.next( ...args );
            return v.done ? v 
                          : f( v.value ) ? v 
                                         : next( ...args )
            ;
        }
    }
}

/**
 * Reduce a list from the left
 *
 * @param {function} f - b -> a -> b
 * @param {B} acc - element of type b
 * @param {object} iter - Iterable object with elements of type a
 * @return {B} Element of type B
 */
function foldL( f, acc, iter )
{
    const tmp = iter[Symbol.iterator]()
    ,     val = tmp.next()
    ;
    if( val.done )
        return acc;
    else
        return foldL( f, f( acc, head( iter )), tail( iter )); 
}

/**
 * Reduce a list from the right
 *
 * @param {function} f - a -> b -> b
 * @param {B} acc - element of type b
 * @param {object} iter - Iterable object with elements of type a
 * @return {B} Element of type B
 */
function foldR( f, acc, iter ) 
{
    const tmp = iter[Symbol.iterator]()
    ,     val = tmp.next()
    ;
    if( val.done )
        return acc;
    else
        return f( head( iter ), foldR( f, acc, tail( iter )));
}



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return compose; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return bindF; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return range; });


/**
 * Some nice to have utilities for functional programming
 */

/**
 * Function composition
 *
 * @param {function} f 
 * @param {function} g 
 * @return {function} composition of f and g
 */
function compose( f, g )
{
    return (...args) =>  f( g( ...args ));
}

/**
 * Bind parameter to a function and return a function
 *
 * @param {function} f 
 * @param {object} oThis
 * @param {any} ...args
 */
function bindF(f, oThis, ...args)
{
    if( f.bind )
        return f.bind( oThis, ...args );
    else 
        return ( ...other ) => {
            f.call( oThis, ...args, ...other );
        };
}

/**
 * Construct a maybe infinite iterator.
 *
 * @param {number} first - start
 * @param {number} last - end
 * @param {number} step - step width
 * @return {object} iterable object
 */
function range( first = 0, last = Infinity, step = 1 )
{
    return { [Symbol.iterator]: iterate };

    function* iterate()
    {
        let n = first;
        while( n <= last ) {
            yield n;
            n += step;
        }
    }
    /* ATTENTION
     * Tail calls in generator functions will not be optimised, so infinite
     * recusion is not a good idea.
     * => Using good old, ugly loops instead :-(
    function* iterate( f = first, l = last, s = step ) 
    {
        if( f <= l ) {
            yield f;
            yield *iterate( f+s )
        }
    }
    */
}



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lib_iterable__ = __webpack_require__(0);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "head", function() { return __WEBPACK_IMPORTED_MODULE_0_lib_iterable__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "tail", function() { return __WEBPACK_IMPORTED_MODULE_0_lib_iterable__["b"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "forEach", function() { return __WEBPACK_IMPORTED_MODULE_0_lib_iterable__["c"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "map", function() { return __WEBPACK_IMPORTED_MODULE_0_lib_iterable__["d"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "filter", function() { return __WEBPACK_IMPORTED_MODULE_0_lib_iterable__["e"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "foldL", function() { return __WEBPACK_IMPORTED_MODULE_0_lib_iterable__["f"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "foldR", function() { return __WEBPACK_IMPORTED_MODULE_0_lib_iterable__["g"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lib_util__ = __webpack_require__(1);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "o", function() { return __WEBPACK_IMPORTED_MODULE_1_lib_util__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "bindF", function() { return __WEBPACK_IMPORTED_MODULE_1_lib_util__["b"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "range", function() { return __WEBPACK_IMPORTED_MODULE_1_lib_util__["c"]; });






/***/ })
/******/ ]);