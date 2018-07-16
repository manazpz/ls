import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './router.config'
import Less from 'Less'
import axios from 'axios'
import store from './store/'
import VueLazyload from 'vue-lazyload'
import App from './App.vue'
import Loading from './components/loading'
import Toast from './components/toast'
require('./assets/css/base.css'); //全局引入
Vue.use(Less);
Vue.use(VueRouter);
Vue.use(Toast);
Vue.use(Loading);
Vue.use(VueLazyload, {
    preLoad: 1.3,
    error: require('./assets/images/err.png'),
    loading: require('./assets/images/loading.gif'),
    attempt: 1,
    listenEvents: ['scroll']
});
const router = new VueRouter({
    mode: 'history',
    scorllBehavior: () => ({
        y: 0

    }),
    routes
});
//axios的一些配置，比如发送请求显示loading，请求回来loading消失之类的
//
axios.interceptors.request.use(function(config) { //配置发送请求的信息
    store.dispatch('showLoading');
    return config;
}, function(error) {
    return Promise.reject(error);
});

axios.interceptors.response.use(function(response) { //配置请求回来的信息
    store.dispatch('hideLoading');
    return response;
}, function(error) {
    return Promise.reject(error);
});
axios.defaults.baseURL = 'http://localhost/';
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'
Vue.prototype.$http = axios;
// 登录中间验证，页面需要登录而没有登录的情况直接跳转登录
router.beforeEach((to, from, next) => {
    var url = document.location.toString();
    var arrUrl = url.split("?");
    var para = arrUrl[1];
    document.cookie = para;
    next();
});
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})
