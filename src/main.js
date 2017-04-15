
// TODO:
//  - foldL/foldR
//  - currying
//  - function composition

function range( first = 0, last = Infinity, step = 1 )
{
    return { [Symbol.iterator]: iterate }

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

function map( f, iterable )
{
    return {
        [Symbol.iterator]: () => {
            const iter = iterable[Symbol.iterator]();
            return { 
                next: (...args) => {
                    const v = iter.next( ...args );
                    return v.done ? v 
                                  : { value: f( v.value ), done: false }
                }
            };
        }
    };
}

function filter( f, iterable )
{
    return {
        [Symbol.iterator]: () => {
            const iter = iterable[Symbol.iterator]();
            return { next: gen_next( iter )};
        }
    }

    function gen_next( iter )
    {
        return next;

        function next(...args) {
            const v = iter.next( ...args );
            return v.done 
                    ? v : f( v.value ) 
                    ? v : next( ...args )
            ;
        }
    }
}

function foldL() 
{
    throw "Implement me!";
}

function foldR() 
{
    throw "Implement me!";
}

