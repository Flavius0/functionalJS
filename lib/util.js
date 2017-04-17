export {
    compose as o
    , bindF
    , range
}

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

