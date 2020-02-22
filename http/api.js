import fly from './index'
export default {

    /*首页*/

    // *主要*
    // 轮播
    getHeader() {
        return fly.get('/banner')
    },
    // 推荐歌单
    getPersonalized() {
        return fly.get('/personalized')
    },
    // 新碟  对应专辑
    newDisc() {
        return fly.get(`/album/newest`)
    },
    // 新歌-音乐新势力
    newSong() {
        return fly.get(`/personalized/newsong`)
    },

    // 推荐电台
    djprogram() {
        return fly.get(`/personalized/djprogram`)
    },
    // 推荐节目
    recommend() {
        return fly.get(`/program/recommend`)
    },

    // *搜索*
    // 热搜榜-
    hotSearchList() {
        return fly.get(`/search/hot/detail`)
    },
    // 默认关键词
    searchDefalut() {
        return fly.get(`/search/default`)
    },
    // 搜索联想词
    searchSuggest(keywords) {
        return fly.get(`/search/suggest?keywords=${keywords}&type=mobile`)
    },
    // 关键词搜索(9个组件)
    "searchType": [{
            id: 1018,
            name: "综合"
        },
        {
            id: 1,
            name: "单曲"
        },
        {
            id: 1014,
            name: "视频"
        },
        {
            id: 100,
            name: "歌手"
        },
        {
            id: 10,
            name: "专辑"
        },
        {
            id: 1000,
            name: "歌单"
        },
        {
            id: 1009,
            name: "电台"
        },
        {
            id: 1002,
            name: "用户"
        },
        {
            id: 1004,
            name: "MV"
        },
    ],
    keywordSearch(keyword, type = 1018, offset = 0) {
        return fly.get(`/search?keywords=${keyword}&type=${type}&offset=${offset}`)
    },

    /*歌手*/
    //入驻歌手
    artistList(artist_id, page, initial = 'A') {
        return fly.get(`/artist/list?cat=${artist_id}&initial=${initial}&limit=30&offset=${(page-1)*30}`)
    },
    artistType: [{
            id: '5001',
            name: '入驻歌手',
        },
        {
            id: '1001',
            name: '华语男歌手',
        },
        {
            id: '1002',
            name: '华语女歌手',
        },
        {
            id: '1003',
            name: '华语组合/乐队',
        },
        {
            id: '2001',
            name: '欧美男歌手',
        },
        {
            id: '2002',
            name: '欧美女歌手',
        },
        {
            id: '2003',
            name: '欧美组合/乐队',
        },
        {
            id: '6001',
            name: '日本男歌手',
        },
        {
            id: '6002',
            name: '日本女歌手',
        },
        {
            id: '6003',
            name: '日本组合/乐队',
        },
        {
            id: '7001',
            name: '韩国男歌手',
        },
        {
            id: '7002',
            name: '韩国女歌手',
        },
        {
            id: '7003',
            name: '韩国组合/乐队',
        },
        {
            id: '4001',
            name: '其他男歌手',
        },
        {
            id: '4002',
            name: '其他女歌手',
        },
        {
            id: '4003',
            name: '其他组合/乐队',
        },
    ],
    'initial': [
        "热", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
    ],

    /*我的*/
    //*登录*（手机/邮箱）
    loginbyTel(phone, password) {
        return fly.get(`/login/cellphone?phone=${phone}&password=${password}`)
    },
    loginbyEmail(email, password) {
        return fly.get(`/login?email${email}&password=${password}`)
    },

    //*注册*
    // 发送验证码(phone: 手机号码)
    sendCaptcha(phone) {
        return fly.get(`/captcha/sent?phone=${phone}`)
    },
    // 验证验证码(phone: 手机号,captcha: 验证码)
    verifyCaptcha(phone, captcha) {
        return fly.get(`/captcha/verify?phone=${phone}&captcha=${captcha}`)
    },
    // 注册(captcha: 验证码,phone : 手机号码,password: 密码,nickname: 昵称)
    register(captcha, phone, password, nickname) {
        return fly.get(`/register/cellphone?phone=${phone}&password=${password}&captcha=${captcha}&nickname=${nickname}`)
    },
    // 检测手机是否已被注册(phone: 手机号)
    checkTel(phone) {
        return fly.get(`/cellphone/existence/check?phone=${phone}`)
    },

    //*用户资料*

    /*歌单详情*/
    //获取歌单


    /*专辑详情*/
    getAlbum(id, limit) {
        return fly.get(`/artist/album?id=${id}&limit=${limit}`)
    },
    /*电台-节目详情*/
    djdetail(id) {
        return fly.get(`/dj/program/detail?id=${id}`)
    },

    /*歌曲详情*/
    getSongdetail(id) {
        return fly.get(`/song/detail?ids=${id}`)
    },

    /*播放详情*/
    //歌单播放
    //获取音乐
    //音乐是否可用
    //歌词




}