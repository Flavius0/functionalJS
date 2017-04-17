var path = require('path');

module.exports = {
    entry: './test/bundle.js',
    output: {
        path: path.resolve( __dirname, 'bin' ),
        filename: 'testBundle.js'
    },
    resolve: {
        modules: [
          path.resolve('./'),
          path.resolve('./node_modules')
        ]
    }
};

