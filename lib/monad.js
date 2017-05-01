export {
    Monad
    , Maybe
    , Writer
}

/*
 * A Monad Constructor
 */
function Monad( o, bind, fail )
{
    o.u = unit;
    o.prototype.b = bind;
    o.prototype.l = lift;
    //o.prototype.l2 = lift2;
    o.prototype.tR = takeRight;
    //o.prototype.j = join;  // Should only be used if fmap instead of bind would be defined?
    o.prototype.f = fail || default_fail;

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
        return o.u( this.b( f ));
    }

    function lift2( f, m_b )
    {
        return o.u( this.b( x => 
            m_b.b( y => 
                f( x, y )
            )
        ));
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

Monad.do = function( f, ...args )
{
    return do_helper( x => f( ...x ), args );

    function do_helper( g, args )
    {
        if( args.length === 0 ) {
            return g( [] );
        } else {
            const arg = args.shift();
            return do_helper( v => arg.b( x => g( v.concat( x ))), args );
        }
    }
};

/*
 * Some monad definitions
 */
Monad( Maybe, maybe_bind, maybe_fail );

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

function maybe_fail()
{
    return new Maybe( null );
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

//const a = Maybe.u(2)
//,     b = Maybe.u(null)
//,     c = Maybe.u(1)
//,     f = (x,y,z) => Maybe.u( 2*x - ( y - z ))
//,     g = x => Maybe.u( x + 1 )
//;
//console.log( Monad.do( g, a ));
//console.log( Monad.do( f, a, b, c ));


