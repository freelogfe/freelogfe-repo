/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
// import {extend} from 'dva/fetch';
import axios from 'axios';
import {notification} from 'antd';
import NProgress from '@/components/fNprogress';
// import '~'

// notification.config({
//   duration: 1000000
// });


const codeMessage: any = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

export const apiHost = `${window.location.protocol}//qi.${(window.location.host.match(/(?<=\.).*/) || [''])[0]}`;

if (window.location.hostname.includes('.com')) {
  // const arr = window.location.hostname.split('.');
  // arr[0] = 'qi';
  axios.defaults.baseURL = apiHost;
  axios.defaults.withCredentials = true;
}

/**
 * 异常处理程序
 */
const errorHandler = (error: { response: Response }): Response => {
  const {response} = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const {status, url} = response;

    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  return response;
};

// Add a request interceptor
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  NProgress.start();
  return config;
}, function (error) {
  // Do something with request error
  NProgress.done();
  return Promise.reject(error);
});

/**
 * 配置request请求时的默认参数
 */
axios.interceptors.response.use(function (response) {
  // console.log(response, 'response');
  // Do something with response data
  NProgress.done();
  if (response.status !== 200) {
    const error = {
      description: codeMessage[response.status],
      message: response.status,
    };
    notification.error(error);
    throw new Error(JSON.stringify(error));
  }
  const {data} = response;
  if (data.errcode !== 0 || data.ret !== 0) {

    notification.error({
      message: data.msg,
    });
    throw new Error(JSON.stringify(data));
  }
  return data;
}, function (error) {
  // console.log(error, 'errorerror');
  // Do something with response error
  NProgress.done();
  return Promise.reject(error);
});

export default axios;
