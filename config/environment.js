const path = require('path');

//node js exports applying
module.exports = {
    paths: {
        //path to source files directory
        source: path.resolve(__dirname, '../src/'),


        //path to build files directory
        output: path.resolve(__dirname, '../dist/'),
    }, 

    server: {
        host: '127.0.0.1', 
        port: 3000
    }, 

    limits: {
        /* Image files size in bytes. Below this value the image file will be served as DataURL (inline base64). */
        images: 8192, 

        /* Font files size in bytes. Below this value the font file will be served as DataURL (inline base64). */
        fonts: 8192
    }
};

