import fly from './index'
export default {
    // ? 首页
    /**
     * 主页轮播
     */
    getHeader() {
        return fly.get('/banner')
    },
    /**
     * 推荐歌单
     */
    getPersonalized() {
        return fly.get('/personalized')
    },
    /**
     * 新碟  对应专辑
     */
    newDisc() {
        return fly.get(`/top/album?offset=0&limit=30`)
    },
    /**
     * 新歌-音乐新势力
     */
    newSong() {
        return fly.get(`/personalized/newsong`)
    },
    /**
     * 推荐电台
     */
    djRecommend() {
        return fly.get(`/dj/recommend`)
    },
    /**
     * 推荐节目
     */
    programRecommend() {
        return fly.get(`/program/recommend`)
    },
    /**
     * 热搜榜
     */
    hotSearchList() {
        return fly.get(`/search/hot/detail`)
    },
    /**
     * 默认关键词
     */
    searchDefalut() {
        return fly.get(`/search/default`)
    },
    /**
     * 搜索联想词
     * @param {*} keywords 关键词
     */
    searchSuggest(keywords) {
        return fly.get(`/search/suggest?keywords=${keywords}&type=mobile`)
    },
    /**
     * 搜索结果
     * @param {*} keyword 关键词
     * @param {*} type 类型
     * @param {*} offset 起始位置
     */
    keywordSearch(keyword, type = 1018, offset = 0) {
        return fly.get(`/search?keywords=${keyword}&type=${type}&offset=${offset}`)
    },

    // ? 歌手
    /**
     * 歌手列表
     * @param {*} type 歌手类型
     * @param {*} page 页数
     * @param {*} initial 名称分类
     */
    artistList(type, page, initial) {
        return fly.get(`/artist/list?cat=${type}&initial=${initial}&limit=30&offset=${(page-1)*30}`)
    },

    // ? 歌手详情
    /**
     * 歌手详情
     * @param {*} id 歌手id
     */
    getArtistDetails(id) {
        return fly.get(`/artist/desc?id=${id}`)
    },
    /**
     * 歌手热歌
     * @param {*} id 歌手id
     * @param {*} offset 起始位置
     */
    artists(id, offset) {
        return fly.get(`/artists?id=${id}&offset=${offset}&limit=30`)
    },
    /**
     * mv
     * @param {*} id 歌手id
     * @param {*} offset 起始位置
     */
    getArtistMv(id, offset) {
        return fly.get(`/artist/mv?id=${id}&offset=${offset}&limit=30`)
    },
    /**
     * 歌手所有专辑
     * @param {*} id 歌手id
     * @param {*} offset 起始位置
     */
    getAlbums(id, offset) {
        return fly.get(`/artist/album?id=${id}&limit=30&offset=${offset}`)
    },

    // ? 电台详情
    /**
     * 电台详情
     * @param {*} rid 电台id
     */
    djDetail(rid) {
        return fly.get(`/dj/detail?rid=${rid}`)
    },
    /**
     * 电台节目列表
     * @param {*} rid 电台id
     * @param {number} page 页数
     */
    programList(rid, offset) {
        return fly.get(`dj/program?rid=${rid}&limit=30&$offset=${offset}`)
    },
    /**
     * 节目详情
     * @param {*} id 电台节目id
     */
    programDetail(id) {
        return fly.get(`/dj/program/detail?id=${id}`)
    },
    /**
     * 电台节目评论
     * @param {*} id 电台节目id
     */
    programComment(id) {
        return fly.get(`/comment/dj?id=${id}&limit=20`)
    },

    // ? 歌单详情
    /**
     * 歌单详情
     * @param {*} id 歌单id
     */
    getPlaylistDetails(id) {
        return fly.get(`/playlist/detail?id=${id}`)
    },

    // ? 专辑详情
    /**
     * 专辑详情
     * @param {*} id 专辑id
     */
    getAlbum(id) {
        return fly.get(`/album?id=${id}`)
    },

    // ? 歌曲详情
    /**
     * 歌曲详情
     * @param {*} id 歌曲id
     */
    getSongdetail(id) {
        return fly.get(`/song/detail?ids=${id}`)
    },
    getSongUrl(ids) {
        if ((typeof ids) === 'array') {
            ids = ids.join(',')
        }
        return fly.get(`/song/url?id=${ids}`)
    },

    /**
     * 我的(登录、注册)
     */
    userInfo(id) {
        return fly.get(`/user/detail?uid=${id}`)
    },
    /**
     * 手机号登录
     * @param {*} phone 手机号
     * @param {*} password 密码
     */
    loginbyTel(phone, password) {
        return fly.get(`/login/cellphone?phone=${phone}&password=${password}`)
    },
    /**
     * 邮箱登录
     * @param {*} email 邮箱
     * @param {*} password 密码
     */
    loginbyEmail(email, password) {
        return fly.get(`/login?email${email}&password=${password}`)
    },

    /**
     * 发送验证码
     * @param {*} phone 电话
     */
    sendCaptcha(phone) {
        return fly.get(`/captcha/sent?phone=${phone}`)
    },
    /**
     * 验证验证码
     * @param {*} phone 电话
     * @param {*} captcha 验证码
     */
    verifyCaptcha(phone, captcha) {
        return fly.get(`/captcha/verify?phone=${phone}&captcha=${captcha}`)
    },
    /**
     * 注册
     * @param {*} captcha 验证码
     * @param {*} phone 电话
     * @param {*} password 密码
     * @param {*} nickname 用户名
     */
    register(captcha, phone, password, nickname) {
        return fly.get(`/register/cellphone?phone=${phone}&password=${password}&captcha=${captcha}&nickname=${nickname}`)
    },
    /**
     * 检查手机是否注册
     * @param {*} phone 手机
     */
    checkTel(phone) {
        return fly.get(`/cellphone/existence/check?phone=${phone}`)
    }
}