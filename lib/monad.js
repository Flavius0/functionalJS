export {
    Monad
    , Maybe
    , Writer
}

/*
 * A Monad Constructor
 */
function Monad( o, bind )
{
    o.u = unit;
    o.prototype.b = bind;
    o.prototype.l = lift;
    o.prototype.j = join;

    function join()
    {
        return this.__value;
    }

    function lift( f )
    {
        return o.u( f( this.__value ));
    }

    function unit( v )
    {
        return new o( v );
    }
}

/*
 * Some monad definitions
 */
Monad( Maybe, maybe_bind );

function Maybe( v ) 
{
    if( v === null || typeof v === 'undefined' ) {
        this.__value = null;
    } else {
        this.__value = v
    }
    return this;
}

function maybe_bind( f )
{
    if( this.__value ) {
        return f( this.__value );
    } else {
        return this;
    }
}

/*
 * Writer Monad
 */

Monad( Writer, writer_bind );

function Writer( v )
{
    this.__value = v;
    this.__log = '';
    return this;
}

function writer_bind( f )
{
    const ret = f( this.__value );
    ret.__log = `${ret.__log}{this.__log}`;
    return ret;
}

