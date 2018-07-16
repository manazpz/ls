export default {
    showLoading: ({ commit }) => {
        commit('showLoading')
    },
    hideLoading: ({ commit }) => {
        commit('hideLoading')
    },
    showNav: ({ commit }) => {
        commit('showNav')
    },
    hideNav: ({ commit }) => {
        commit('hideNav')
    },
    showNav1: ({ commit }) => {
        commit('showNav1')
    },
    hideNav1: ({ commit }) => {
        commit('hideNav1')
    },
    showHead: ({ commit }) => {
        commit('showHead')
    },
    hideHead: ({ commit }) => {
        commit('hideHead')
    },
    setUserInfo: ({
        commit,
        userInfo,
    }) => {
        commit('setUserInfo', userInfo);
    }
}
