import fly from './index'
export default {

    /**
     * 主页
     */
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

    /**
     * 搜索
     */
    // 热搜榜
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
    keywordSearch(keyword, type = 1018, offset = 0) {
        return fly.get(`/search?keywords=${keyword}&type=${type}&offset=${offset}`)
    },

    /**
     * 歌手页
     */
    //入驻歌手
    artistList(artist_id, page, initial) {
        return fly.get(`/artist/list?cat=${artist_id}&initial=${initial}&limit=30&offset=${(page-1)*30}`)
    },

    /**
     * 歌手详情
     */
    // 歌手信息
    getArtistDetails(id) {
        return fly.get(`/artist/desc?id=${id}`)
    },
    // 专辑
    getAlbum(id) {
        return fly.get(`/artist/album?id=${id}`)
    },
    // 单曲
    artists(id, offset) {
        return fly.get(`/artists?id=${id}&offset=${offset}&limit=30`)
    },
    // MV
    getArtistMv(id, offset) {
        return fly.get(`/artist/mv?id=${id}&offset=${offset}&limit=30`)
    },

    /**
     * 电台节目详情
     */
    //电台信息
    djdetail(id) {
        return fly.get(`/dj/program/detail?id=${id}`)
    },
    // // 电台节目
    // djprogram(id){
    //     return fly.get(`/dj/program?id=${id}`)
    // },
    // 电台评论
    getDjComment(id) {
        return fly.get(`/comment/dj?id=${id}&limit=20`)
    },

    /**
     * 歌单
     */
    getPlaylistDetails(id) {
        return fly.get(`/playlist/detail?id=${id}`)
    },

    /**
     * 用户
     */

    /**
     * 播放器
     */
    /*歌曲详情*/
    getSongdetail(id) {
        return fly.get(`/song/detail?ids=${id}`)
    },

    /**
     * 我的(登录、注册)
     */
    //登录手机/邮箱
    loginbyTel(phone, password) {
        return fly.get(`/login/cellphone?phone=${phone}&password=${password}`)
    },
    loginbyEmail(email, password) {
        return fly.get(`/login?email${email}&password=${password}`)
    },
    //注册
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
    }
}