export {
    Monad
    , Maybe
}

/*
 * A Monad Constructor
 */
function Monad( o, unit, bind )
{
    o.prototype.u = unit;
    o.prototype.b = bind;
    o.prototype.l = lift;

    function lift( f )
    {
        return this.u( f( this.value ));
    }
}

/*
 * Some monad definitions
 */

function Maybe( a ) {
    this.value = this.u( a ).value;
}

function maybe_unit( a )
{
    if( a !== null && typeof a !== 'undefined' ) {
        this.value = a
    } else {
        this.value = null;
    }
    return this;
}

function maybe_bind( f )
{
    if( this.value ) {
        return f( this.value );
    } else {
        return this;
    }
}

Monad(Maybe, maybe_unit, maybe_bind);

//var a = new Maybe(3);
//var b = new Maybe(2);
//var c = a.l(x => x*3).b(x => b.l(y => y * 4).l( y =>  x + y ))
//
//console.log(a,b,c);
