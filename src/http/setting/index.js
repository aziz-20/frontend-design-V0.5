export const   get = (url, params) => {
    return ({
        method: 'get',
        url,
        params
    })
}

export  const post = (url, data) => {
    return ({
        method: 'post',
        url,
        data
    })
}

export const put = (url, data) => {
    return ({
        method: 'put',
        url,
        data
    })
}

export const del = (url, data) => {

    return ({  
        method: 'delete',
        url,
        data
    })
}

export function tansParams(params) {
    let result = ''
    for (const propName of Object.keys(params)) {
      const value = params[propName];
      var part = encodeURIComponent(propName) + "=";
      if (value !== null && value !== "" && typeof (value) !== "undefined") {
        if (typeof value === 'object') {
          for (const key of Object.keys(value)) {
            if (value[key] !== null && value[key] !== "" && typeof (value[key]) !== 'undefined') {
              let params = propName + '[' + key + ']';
              var subPart = encodeURIComponent(params) + "=";
              result += subPart + encodeURIComponent(value[key]) + "&";
            }
          }
        } else {
          result += part + encodeURIComponent(value) + "&";
        }
      }
    }
    return result
  }



