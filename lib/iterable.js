export {
    head
    , tail
    , forEach
    , map
    , filter
    , foldL
    , foldR
}

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

