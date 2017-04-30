export {
    Monad
    , Maybe
    , Writer
}

/*
 * A Monad Constructor
 */
function Monad( o, bind, fail = default_fail )
{
    o.u = unit;
    o.prototype.b = bind;
    o.prototype.l = lift;
    o.prototype.l2 = lift2;
    //o.prototype.j = join;  // Should only be used if fmap instead of bind would be defined?
    o.prototype.f = fail;

    function default_fail( s )
    {
        throw new Error( s );
    }

    function join()
    {
        return this.__value;
    }

    function lift( f )
    {
        return o.u( f( this.__value ));
    }

    function lift2( f )
    {
        throw new Error( 'Implement me' );
    }

    function takeRight( m_b )
    {
        return this.b( x => m_b );
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

