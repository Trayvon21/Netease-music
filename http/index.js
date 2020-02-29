import Fly from '../lib/fly/wx'
const fly = new Fly

// 配置基础路径
fly.config.baseURL = 'https://www.trayvon21.cn/'

// 请求拦截器 添加token
fly.interceptors.request.use(config => {
    wx.showLoading({
        title: '加载中...',
        mask: true,
    });
    // 配置超时时间
    config.timeout = 100000
    let token = wx.getStorageSync('token')
    if (token) {
        // 请求头添加认证信息
        config.headers["Authorization"] = token
    }
    return config
})


// 响应拦截器 只返回需要的data
fly.interceptors.response.use(
    response => {
        wx.hideLoading();
        return response.data
    },
    err => {
        console.log(err)
    }
)


export default fly