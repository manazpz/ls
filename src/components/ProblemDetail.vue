<template>
    <div>
        <div id="problem" style="padding: 10px;">
            <div class="layout">
                <span>微&nbsp;&nbsp;信&nbsp;&nbsp;名：</span>{{mDatas[0]==null?"":mDatas[0].WX_NAME}}
            </div>
            <div class="layout">
                <span>问题类型：</span>{{mDatas[0]==null?"":mDatas[0].TYPE}}
            </div>
            <div class="layout">
                <span>标&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;题：</span>{{mDatas[0]==null?"":mDatas[0].TITLE}}
            </div>
            <div class="layout">
                <span>内&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;容：</span>{{mDatas[0]==null?"":mDatas[0].DETAIL}}
            </div>
            <div class="layout">
                <span>时&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;间：</span>{{mDatas[0]==null?"":mDatas[0].TIME}}
            </div>
            <div class="layout">
                <span>咨询方式：</span>{{mDatas[0]==null?"":mDatas[0].MODE}}
            </div>
            <div class="layout">
                <span>名&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;字：</span>{{mDatas[0]==null?"":mDatas[0].NAME}}
            </div>
            <div class="layout">
                <span>联系方式：</span>{{mDatas[0]==null?"":mDatas[0].PHONE}}
            </div>
            <div class="layout">
                <span>是否处理：</span>{{mDatas[0]==null?"":mDatas[0].FLAG}}
            </div>
            <div class="layout">
                <section class="layout">
                    <ul >
                        <li v-for="item in mDatas">
                            <img v-lazy="item.URL" alt="" style="display: block;height: 200px;width: 50%; margin: 0 auto;">
                        </li>
                    </ul>
                </section>
            </div>
            <div class="layout">
                <p style="color: #F23030;font-size: 22px;text-align: center;display:block;padding-top: 10px">< < < 问答详情 > > ></p>
                <li style="height: 100px"  v-for="item in mHf">
                    <div>
                        <div class="layout">
                    <span style="font-size: 18px">
                            {{item.QUESTIONER==''?"厦门说法 回复":item.QUESTIONER+" 追问"}}:
                            </span>
                            <span style="float:right;font-size: 18px">
                            {{item.CTEATETIME}}
                            </span>
                        </div>
                        <div class="layout" style="padding-left: 30px">
                            <p style="font-size: 18px">{{item.CONTENT}}</p>
                        </div>
                    </div>
                </li>
            </div>
        </div>
        <div class="footer_s">
            <footer>
                <input class="input_s" id="inquiries" /><button class="button_s" type="button" @click="inquiries">发送</button>
            </footer>
        </div>
    </div>
</template>
<script>
    import axios from 'axios';
    import {getCookie} from '../assets/js/util.js';
    export default{
        mounted(){
            if(this.wxData == null) {
                window.location.href="/error";
            }else {
                this.fetchData(this.$route.query.id);
            }
                document.getElementById('problem').style.height = window.screen.height+"px";

        },
        data(){
            return {
                mDatas:[],
                mHf:[],
                wxData:JSON.parse(decodeURIComponent(getCookie("wx")).replace("j:","")),
            }
        },
        methods:{
            fetchData(id){
                axios.get('/problemDetail',{ params:{
                        mId:id
                    }}).then((res)=>{
                        this.mDatas = res.data;
                },(err)=>{

                });
                axios.get('/inquiriesList',{ params:{
                        basicId:id
                    }}).then((res)=>{
                        this.mHf = res.data;
                },(err)=>{

                });
            },
            inquiries(){
                if(this.mDatas[0].MODE == "收费咨询") {
                    if($('#inquiries')[0].value == ''){
                        this.$toast.show({text:"收费才可追问！",position:'bottom',time:1500});
                    }else {
                        let params = {
                            wxCode:this.wxData.openid,
                            basicId:this.$route.query.id,
                            questioner:this.$route.query.name,
                            content:$('#inquiries')[0].value
                        };
                        axios.post('/inquiries',params).then((res)=>{
                            this.$toast.show({text:res.data.msg,position:'bottom',time:1500});
                            if(res.data.status == 1){
                                window.location.reload();
                            }
                        },(err)=>{

                        });
                    }
                }else {
                    this.$toast.show({text:"收费才可追问！",position:'bottom',time:1500});
                }

            }
        }
    }
</script>
<style>
    @import '../assets/css/problemList.css';
</style>