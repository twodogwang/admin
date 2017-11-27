import axios from 'axios';
import {
  Message
} from 'element-ui';
import store from '../store';
import {
  getToken
} from '@/utils/auth';
import {
  MessageBox
} from 'element-ui';

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 150000, // 请求超时时间
  withCredentials: true,
  headers: {
    'X-Requested-with': 'XMLHttpRequest',
    'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
  }
});

// request拦截器
service.interceptors.request.use(config => {
  /* if (store.getters.token) {
    config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  } */
  // config.headers['"x-requested-with'] = "XMLHttpRequest";
  // console.log(config)
  return config;
}, error => {
  // Do something with request error
  console.log(error); // for debug
  Promise.reject(error);
});

// respone拦截器
service.interceptors.response.use(
  response => {
    // debugger;
    /**
     * code为非0是抛错 可结合自己业务进行修改
     */
    const res = response.data;

    if (res.code !== 0) {
      if (res.code == 300 || res.code === 50012 || res.code === 50014) {
        MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload(); // 为了重新实例化vue-router对象 避免bug
          });
        });
      }
      if (!res.data || res.data == '' || res.data == null) {
        Message({
          message: res.msg,
          type: 'error',
          duration: 5 * 1000
        });
        // return Promise.reject('error');
      } else {
        Message({
          message: res.data,
          type: 'error',
          duration: 5 * 1000
        });
      }
      console.log('eeeeeeeeeeeeeeeeeeeeeeeeee');
      return Promise.reject('error');
    } else {
      const result = {};
      Object.assign(result, response.data);
      if (result.data) {
        // debugger;
        if (result.data.list && result.data.list[0]) {
          const length = result.data.list.length;
          const data = result.data.list;
          if (data[0].cardSign) {
            for (let i = 0; i < length; i++) {
              if (data[i].cardSign === 0) {
                data[i].cardSign = '0';
                data[i].cardSignType = '禁用';
              } else {
                data[i].cardSign = '1';
                data[i].cardSignType = '启用';
              }
              if (data[i].propertyStatus === 0) {
                data[i].propertyStatus = '0';
                data[i].propertyStatusType = '禁用';
              } else {
                data[i].propertyStatus = '1';
                data[i].propertyStatusType = '启用';
              }
              if (data[i].ownerStatus === 0) {
                data[i].ownerStatus = '0';
                data[i].ownerStatusType = '禁用';
              } else {
                data[i].ownerStatus = '1';
                data[i].ownerStatusType = '启用';
              }
            }
          }
        }
        if (result.data.list && result.data.list[0]) {
          if (result.data.list[0].talkback && result.data.list[0].talkback[0]) {
            const length = result.data.list.length;
            const data = result.data.list;
            let temp = '';
            for (let j = 0; j < length; j++) {
              for (let k = 0; k < data[j].talkback.length; k++) {
                temp += data[j].talkback[k].mobilephone + '  ';
              }
              data[j].talkbackmobilephone = temp;
              temp = '';
            }
          }
        }
        Message({
          message: res.msg,
          type: 'success',
          duration: 3 * 1000
        });
      }
      // console.log(response.data === result);
      return res;
    }
  },
  error => {
    console.log('err' + error); // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);

export default service;
/*
var Timer = (function() {
  var Timer = [];
  for (var i = 30; i < 60; i++) {
    if (i < 10) {
      var time = '09:0' + i;
    } else {
      var time = '09:' + i;
    }
    Timer.push(time);
  }
  for (i = 10; i < 21; i++) {
    for (var m = 0; m < 60; m++) {
      if (m < 10) {
        if (i < 10) {
          time = '0' + i + ':0' + m;
        } else {
          time = i + ':0' + m;
        }
      } else {
        if (i < 10) {
          time = '0' + i + ':' + m;
        } else {
          time = i + ':' + m;
        }
      }
      Timer.push(time);
    }
  }
  return Timer;
})();

var linedata = [
  ['10:20', 18.4, 18.58, 600, 20, 16, 18],
  ['10:21', 18.56, 18.25, 600, 20, 16, 18],
  ['10:22', 18.3, 18.22, 600, 20, 16, 18],
  ['10:23', 18.18, 18.69, 600, 20, 16, 18],
  ['10:24', 18.42, 18.29, 600, 20, 16, 18],
  ['10:25', 18.26, 18.19, 600, 20, 16, 18],
  ['10:26', 18.33, 18.07, 600, 20, 16, 18],
  ['10:27', 18.08, 18.04, 600, 20, 16, 18],
  ['10:28', 17.96, 17.86, 700, 20, 16, 18],
  ['10:29', 17.85, 17.81, 700, 20, 16, 18],
  ['10:30', 17.79, 17.93, 800, 20, 16, 18],
  ['11:02', 17.78, 17.83, 500, 20, 16, 18],
  ['11:03', 17.84, 17.9, 500, 20, 16, 18],
  ['11:04', 17.97, 18.36, 1000, 20, 16, 18],
  ['11:05', 18.3, 18.57, 1000, 20, 16, 18],
  ['11:06', 18.53, 18.68, 1000, 20, 16, 18],
  ['11:09', 18.75, 19.08, 1000, 20, 16, 18],
  ['11:10', 18.85, 18.64, 1000, 20, 16, 18],
  ['11:11', 18.64, 18.44, 1000, 20, 16, 18],
  ['11:12', 18.55, 18.27, 1000, 20, 16, 18],
  ['11:13', 18.13, 18.14, 1000, 20, 16, 18],
  ['11:16', 18.01, 18.1, 1000, 20, 16, 18],
  ['11:17', 18.2, 18.14, 1000, 20, 16, 18],
  ['11:18', 18.23, 18.16, 1000, 20, 16, 18],
  ['11:19', 18.08, 18.2, 1000, 20, 16, 18],
  ['11:20', 18.15, 18.25, 1000, 20, 16, 18]
];
var standardTime = '11:20';

function replenishData(linedata, standardTime) {
  var time = standardTime.split(':');
  var newLineData = [];
  var aa = 0;
  for (var i = 0; i < linedata.length; i++) {
    if (linedata[i][0] == Timer[aa]) {
      newLineData.push(linedata[i]);
      aa++;
    } else {
      // var newSubData = [];
      for (var m = 0; m < Timer.length; m++) {
        if (linedata[i][0] == Timer[m]) {
          var endIndex = m;
          break;
        }
      }
      if (linedata[i - 1] == undefined) {
        var beginIndex = -1;
      } else {
        for (m = 0; m < Timer.length; m++) {
          if (linedata[i - 1][0] == Timer[m]) {
            var beginIndex = m;
            break;
          }
        }
      }
      aa = endIndex + 1;
      console.log(newLineData);
      console.log(Timer[beginIndex] + ',' + Timer[endIndex]);
    }
  }
}
replenishData(linedata, standardTime);
 */
