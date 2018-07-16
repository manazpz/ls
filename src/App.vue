<template>
  <div id="app">
    <!--<loading v-show="loading"></loading>-->
    <!--<Back v-show="showhead"></Back>-->
    <router-view style="margin-bottom: 60px"></router-view>
    <NavBottomView v-show="shownav"></NavBottomView>
    <NavBottomView1 v-show="shownav1"></NavBottomView1>
  </div>
</template>

<script>
    import NavBottomView from './components/NavBottom.vue';
    import NavBottomView1 from './components/NavBottom1.vue';
    import Back from './components/Back.vue';
    import {mapGetters,mapActions} from 'vuex';
    export default {
        name: 'app',
        computed:mapGetters(['loading','shownav','showhead','shownav1']),
        //监听路由的变化
        watch:{
            $route(to,from){
                this.$store.dispatch('hideHead');
                switch (to.path){
                    case '/index':
                    case '/problemDetail':
                        this.$store.dispatch('hideNav');
                        this.$store.dispatch('hideNav1');
                        break;
                    case '/home':
                    case '/state':
                    case '/problemList':
                        this.$store.dispatch('hideNav1');
                        break;
                    case '/lawyerList':
                    case '/phoneCounselingDetail':
                        this.$store.dispatch('hideNav');
                        break;
                }

            }
        },
        data(){
          return {
              minHeight:0
          }
        },
        mounted(){
            this.$store.dispatch('hideHead');
            switch (this.$route.path){
                case '/error':
                case '/index':
                case '/problemDetail':
                    this.$store.dispatch('hideNav');
                    this.$store.dispatch('hideNav1');

                    break;
                case '/home':
                case '/state':
                case '/problemList':
                    this.$store.dispatch('hideNav1');
                    break;
                case '/lawyerList':
                case '/phoneCounselingDetail':
                case '/PhoneCounselingList':
                    this.$store.dispatch('hideNav');
                    break;
            }
        },
        components:{
            NavBottomView,Back,NavBottomView1
        },
        methods:{

      }
    }
</script>

<style>
  @import './assets/css/home.css';
</style>
