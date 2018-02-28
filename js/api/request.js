import httpInstance from './httpInstance';

const qs = require('qs');

const fetch = (options) => {
  let {
    method = 'POST',
    data,
    url
  } = options;

  // console.log('rcp', qs.stringify(data));

  switch (method.toLowerCase()) {
    case 'get':
      return httpInstance.get(url);
    case 'delete':
      return httpInstance.delete(url, qs.stringify(data));
    case 'post':
      return httpInstance.post(url, qs.stringify(data));
    case 'put':
      return httpInstance.put(url, qs.stringify(data));
    case 'patch':
      return httpInstance.patch(url, qs.stringify(data));
    default:
      return Promise.resolve({data: null});
  }
};

export default async (options) => {
  return fetch(options).then(response => {
    const { statusText, status } = response;
    let data = response.data;
    if (data instanceof Array) {
      data = {
        list: data
      };
    }
    console.log('resolved response', {
      success: true,
      message: statusText,
      statusCode: status,
      ...data
    });
    return Promise.resolve({
      success: true,
      message: statusText,
      statusCode: status,
      ...data
    });
  }).catch(error => {
    const { response } = error;
    let msg;
    let statusCode;
    if (response && response instanceof Object) {
      const { data, statusText } = response;
      statusCode = response.status;
      msg = data.message || statusText;
    } else {
      statusCode = 600;
      msg = error.message || 'Network Error';
    }
    return Promise.reject(new Error(`状态码: ${statusCode}, ${msg}`));
  });
}
