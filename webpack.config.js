var path = require('path');

module.exports = {
    entry: './index.js',
    output: {
        path: path.resolve(__dirname, 'bin'),
        filename: 'functional.js',
        library:  'fjs',
        libraryTarget: 'var'
    },

    resolve: {
        modules: [
          path.resolve('./'),
          path.resolve('./node_modules')
        ]
    }
};

