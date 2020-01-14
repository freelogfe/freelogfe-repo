import cloneDeep from 'lodash/cloneDeep'

function createLoader(loader) {
    let loading = false
    const handles = []
    let value

    return function lazyLoader(callback) {
        if (value) {
            callback(value)
        } else if (loading) {
            handles.push(callback)
        } else {
            loading = true
            handles.push(callback)
            loader((v) => {
                value = v
                let h
                // eslint-disable-next-line
                while ((h = handles.shift())) {
                    h(v)
                }
            })
        }
    }
}

// 多个缓存loader的创建
function createCacheLoaders(loaderFn, shouldCloned) {
    const loaders = {}
    return function cacheLoaders(params) {
        let id
        if (typeof params !== 'string') {
            try {
                id = JSON.stringify(params)
            } catch (e) {
                // todo 确保缓存的唯一性
            }
        } else {
            id = params
        }

        if (!id) {
            return loaderFn(id)
        }

        let loader = loaders[id]
        if (!loader) {
            loader = createLoader((callback) => {
                loaderFn(params).then(callback)
            })

            loaders[id] = loader
        }

        return new Promise((resolve) => {
            loader((data) => {
                resolve(shouldCloned ? cloneDeep(data) : data)
            })
        })
    }
}


function promisifyLoader(loader) {
    const handler = createLoader(loader)
    return function promiseLoader() {
        return new Promise((resolve) => {
            handler(resolve)
        })
    }
}

function camelize(str) {
    return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ''))
}

function cssSupports(prop, value) {
    if (!value) {
        return camelize(prop) in document.body.style
    } else if (typeof CSS.supports === 'function') {
        return CSS.supports(prop, value)
    }
    const $el = document.createElement('div')
    $el.style[prop] = value
    return $el.style[prop] === value
}

function isSafeUrl(url) {
    const reg = /^.+\.(test)?freelog\.com$/

    try {
        const obj = new URL(url) // 正确的链接检测
        if (reg.test(obj.hostname)) {
            return true
        }
    } catch (e) {
        // path型链接检测
        if ((/^\/[^/]+/.test(url))) {
            return true
        }
    }

    return false
}

function gotoLogin(redirect) {
    // const loginPath = '/login'
    const loginPath = '/auth'
    console.log(' --- ', loginPath, window.location.pathname)
    if (window.location.pathname === loginPath) {
        return
    }

    let loginUrl = `${window.location.origin.replace('console', 'www')}${loginPath}`

    if (isSafeUrl(redirect)) {
        loginUrl += `?redirect=${encodeURIComponent(redirect)}`
    }

    window.location.href = loginUrl
}


function isFunction(fn) {
    return typeof fn === 'function'
}

function versionDescendingOrder(vIt1, vIt2) {
    let [v1_0, v1_1, v1_2] = vIt1.version.split('.'), [v2_0, v2_1, v2_2] = vIt2.version.split('.')
    let v1 = +v1_0 * 100 + (+v1_1 * 10) + (+v1_2),
        v2 = +v2_0 * 100 + (+v2_1 * 10) + (+v2_2)
    if (v2 > v1) return 1
    if (v2 < v1) return -1
    return 0
}


export function togglePolicy(policies, policy, type) {
    toggleArrayItem(type, policies, policy, (i1, i2) => i1.policyId === i2.policyId)
}

function toggleArrayItem(type, arr, target, verify) {
    var index = -1
    for (let i = 0; i < arr.length; i++) {
        if (verify(target, arr[i])) {
            index = i
            break
        }
    }
    switch (type) {
        case 'add': {
            if (index === -1) {
                arr.push(target)
            }
            break
        }
        case 'delete': {
            if (index !== -1) {
                arr.splice(index, 1)
            }
        }
        default: {
        }
    }
}

export const checkResponse = (res) => {
    const {ret, errcode} = res.data
    return ret === 0 && errcode === 0
}

export const getUserInfoFromLocalStorage = () => {
    const localInfo = window.localStorage.getItem('user_session');
    if (localInfo && localInfo !== 'null') {
        return JSON.parse(localInfo);
    }
    return null;
};

export {
    createLoader,
    createCacheLoaders,
    promisifyLoader,
    cssSupports,
    gotoLogin,
    isSafeUrl,
    isFunction,
    versionDescendingOrder,
    // getUserInfo,
}


export default {
    createLoader,
    createCacheLoaders,
    promisifyLoader,
    gotoLogin
}
