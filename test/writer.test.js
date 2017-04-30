import { Writer } from "lib/monad"
import * as assert from 'assert'

export function writer_test() {
    describe('Writer', function() {
        describe('simple', function() {
            it('should track state in a second variable', function() {
                const val = 2
                ,     w = Writer.u(2)
                ,     res = w.b( addOneW ).b( doubleW ).b( addOneW )
                ;
                assert.equal( res.j(), 7 );
                assert.equal( res.__log, ' <+1> 6 <*2> 3 <+1> 2' )
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
        const ret = Writer.u(x).l( addOne );
        ret.__log = ` <+1> ${x}`;
        return ret;
    }
    function doubleW( x ) 
    {
        const ret = Writer.u(x).l( double );
        ret.__log = ` <*2> ${x}`;
        return ret;
    }
}

