import { Writer } from "lib/monad"
import * as assert from 'assert'

export function writer_test() {
    describe('Writer', function() {
        describe('simple', function() {
            it('should track state in a second variable', function() {
                const val = 2
                ,     w = Writer.return(2)
                ,     res = w.bindM( addOneW ).bindM( doubleW ).bindM( addOneW )
                ;
                assert.equal( res.__log.join(' '), '2 <+1> 3 <*2> 6 <+1>' )
                assert.equal( res.__value, 7 );
            });
        });
    });
    function addOne( x )
    {
        return x+1;
    }
    function double( x )
    {
        return 2*x;
    }
    function addOneW( x )
    {
        const m_f = Writer.lift( addOne );
        const ret = m_f( Writer.return(x) );
        ret.__log = [`${x} <+1>`];
        return ret;
    }
    function doubleW( x ) 
    {
        const ret = Writer.return( double( x ));
        ret.__log = [`${x} <*2>`];
        return ret;
    }
}

