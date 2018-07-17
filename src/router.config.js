import Home from './components/Home.vue'
import State from './components/State.vue'
import Index from './components/Index.vue'
import ProblemList from './components/ProblemList.vue'
import ProblemDetail from './components/ProblemDetail.vue'
import LawyerList from './components/LawyerList.vue'
import PhoneCounselingDetail from  './components/PhoneCounselingDetail.vue'
import PhoneCounselingList from  './components/PhoneCounselingList.vue'
import error from  './components/error.vue'
import beLawyer from  './components/beLawyer.vue'
export default [{
    path: '/home',
    component: Home
},{
    path: '/error',
    component: error
},{
    path: '/index',
    component: Index
}, {
    path: '/',
    redirect: '/index'
}, {
    path: '*',
    redirect: '/index'
}, {
    path: '/state',
    component: State
}, {
    path: '/problemList',
    component: ProblemList
}, {
    path: '/problemDetail',
    component: ProblemDetail
}, {
    path: '/lawyerList',
    component: LawyerList
}, {
    path: '/phoneCounselingDetail',
    component: PhoneCounselingDetail
}, {
    path: '/phoneCounselingList',
    component: PhoneCounselingList
}, {
    path: '/beLawyer',
    component: beLawyer
}]
