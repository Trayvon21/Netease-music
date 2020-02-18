import fly from './index'
export default {

    //  index
    // header
    getHeader() {
        return fly.get('/banner')
    }
}