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
    o.return = unit;
    o.lift = lift;
    o.lift2 = lift2;

    o.prototype.bindM = bind;
    o.prototype.takeRight = takeRight;
    o.prototype.join = join;
    o.prototype.fail = fail || default_fail;

    function default_fail( s )
    {
        throw new Error( s );
    }

    function join()
    {
        return this.bindM( x => x );
    }

    function lift( f )
    {
        return m_a => m_a.bindM( x => o.return( f( x )));
    }

    function lift2( f )
    {
        return (m_a, m_b) => m_a.bindM( x => 
            m_b.bindM( y => 
                o.return( f( x, y ))
            )
        );
    }

    function takeRight( m_b )
    {
        return this.bindM( x => m_b );
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
            return do_helper( v => arg.bindM( x => g( v.concat( x ))), args );
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
    this.__log = [];
    return this;
}

function writer_bind( f )
{
    const ret = f( this.__value );
    ret.__log = this.__log.concat( ret.__log );
    return ret;
}

//const a = Maybe.return(2)
//,     b = Maybe.return(null)
//,     c = Maybe.return(1)
//,     f = (x,y,z) => Maybe.return( 2*x - ( y - z ))
//,     g = x => Maybe.return( x + 1 )
//;
//console.log( Monad.do( g, a ));
//console.log( Monad.do( f, a, b, c ));


