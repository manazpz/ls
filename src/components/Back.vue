<template>
    <div>
        <header style="position: fixed;top: 0;width: 100%; height: 40px;z-index: 2;background: #373A41">
            <div style="display:inline; width: 20%;height: 40px; position: absolute;z-index: 99;">
                <a :href=" link " style="display: block">
                    <router-link :to="{path:link}">
                    <img src="../assets/images/back.png" style="width: 30px;height: 30px;margin: 5px;display:inline;">
                    </router-link>
                </a>
            </div>
            <div style="width: 100%; height: 40px;position:absolute;display:inline;line-height:40px;text-align: center;">
                <span style="display: block;width: 100%; height: 40px; font-size: 18px; color: #fff;">{{title}}</span>
            </div>
        </header>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                title:'',
                link:'/index',
            }
        },
        watch:{
            $route(to,from){
                switch (to.path){
                    case '/home':
                        this.title = "我要提问";
                        this.link = "/index";
                        break;
                    case '/problemList':
                        this.title = "我的提问";
                        this.link = "/index";
                        break;
                    case '/problemDetail':
                        this.title = "问题详情";
                        this.link = "/problemList";
                        break;
                    case '/state':
                        this.title = "免责声明";
                        this.link = "/index";
                        break;
                    case '/lawyerList':
                        this.title = "找律師";
                        this.link = "/index";
                        break;
                    case '/phoneCounselingDetail':
                        this.title = "咨询收费";
                        this.link = "/lawyerList";
                        break;
                    case '/phoneCounselingList':
                        this.title = "列表";
                        this.link = "/index";
                        break;
                }

            }
        },
        mounted(){
            switch (this.$route.path){
                case '/lawyerList':
                    this.title = "找律師";
                    break;
                case '/home':
                    this.title = "我要提问";
                    break;
                case '/problemList':
                    this.title = "我的提问";
                    break;
                case '/problemDetail':
                    this.title = "问题详情";
                    break;
                case '/state':
                    this.title = "免责声明";
                    break;
                case '/phoneCounselingDetail':
                    this.title = "咨询收费";
                    break;
                case '/phoneCounselingList':
                    this.title = "列表";
                    this.link = "/index";
                    break;
            }
        },
    }
</script>
