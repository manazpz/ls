export default {
    loading: (state) => {
        return state.isShow;
    },
    shownav: (state) => {
        return state.isNavShow;
    },
    shownav1: (state) => {
        return state.isNavShow1;
    },
    showhead: (state) => {
        return state.isHeadShow;
    },
    getUserInfo: (state) => {
        return state.userInfo;
    }
}
