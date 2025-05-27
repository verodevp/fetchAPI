const path = require ('path');

module.exports={
    entry : './src/script.js',
    output : {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js' //nome del file generato
    },
    module: {
        rules: [
         {
        test: /\.css$/,              // permette di importare CSS nei file JS
        use: ['style-loader', 'css-loader']
      }
    ]
},
    mode: 'development',
   
    devServer: {
         static: './dist',
        port: 3000,
        open: true // facoltativo
    }
}