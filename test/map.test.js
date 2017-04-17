import { map } from "lib/iterable"
import * as assert from 'assert'

export function map_test() {
    describe('map', function() {
        describe('simple', function() {
            it('should apply a function to every element', function() {
                let actual = [...map(x => x+1, [1,2,3])]
                ,   expected = [2, 3, 4]
                ;
                assert.deepEqual(expected, actual);
            });
        });

        describe('extended', function() {
            it('should apply a function to every element', function() {
                let input = [{x: 1, y: 2}, {x:4, y:3}, {x:22, y:30}]
                ,   actual = [...map( p => Math.sqrt(p.x ** 2 + p.y ** 2), input)]
                ,   expected = [Math.sqrt(5), 5, Math.sqrt(22**2 + 900)]
                ;
                assert.deepEqual(expected, actual);
            });
        });

        describe('generator', function() {
            it('using a generator function', function() {
                let actual = [...map(x => x**2, gen())]
                ,   expected = [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
                ;
                assert.deepEqual(expected, actual);

                function* gen()
                {
                    for(let i = 0; i < 10; i++) {
                        yield i;
                    }
                }
            });
        });
    });
}

