#!/bin/sh

WEBPACK="./node_modules/.bin/webpack"
MOCHA="./node_modules/.bin/mocha"

echo ""
echo "##########"
echo "Generate test.js via webpack..."
$WEBPACK --target node --config webpack.test.js
echo "...done"

echo ""
echo "##########"
echo "Execute tests via mocha..."
$MOCHA ./bin/testBundle.js
rm ./bin/testBundle.js
echo "...done"


exit 0;
