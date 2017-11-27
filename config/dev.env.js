var merge = require('webpack-merge');
var prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"', 
  // BASE_API: '"http://47.92.106.249:5555/znsq"'
  BASE_API: '"http://192.168.1.158:8888/xyzhiping"'
  // BASE_API: '"http://192.168.1.229:8080/xyzhiping"'
  // BASE_API: '"http://127.0.0.1:8080/xyzhiping"'
});
