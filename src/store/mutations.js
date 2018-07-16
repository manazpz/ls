import getters from './getter.js';
const state = {
    isShow: true,
    isNavShow: true,
    isNavShow1: true,
    isHeadShow:true,
    userInfo: {}
}
const mutations = {
    showLoading: (state) => {
        state.isShow = true
    },
    hideLoading: (state) => {
        state.isShow = false
    },
    showNav: (state) => {
        state.isNavShow = true
    },
    hideNav: (state) => {
        state.isNavShow = false
    },
    showNav1: (state) => {
        state.isNavShow1 = true
    },
    hideNav1: (state) => {
        state.isNavShow1 = false
    },
    showHead: (state) => {
        state.isHeadShow = true
    },
    hideHead: (state) => {
        state.isHeadShow = false
    },
    setUserInfo: (state, userInfo) => {
        state.userInfo = userInfo;
    }
}

export default {
    getters,
    state,
    mutations
}
