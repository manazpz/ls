<template>
    <div>
        <!--<div style="height:30px;"></div>-->
        <main class="main_goods_box">
            <ul>
                <li class="goods_item" v-for="item in mDatas" @touchstart.native="showDeleteButton(item.ID)" @touchend.native="clearLoop(item.ID)">
                    <router-link :to="{path:'/problemDetail',query:{'id':item.ID,'name':item.NAME}}" class="goods_item_link">
                        <div>
                            <div class="layout">
                                <span>
                                {{item.TYPE}} {{item.PAY}}
                                </span>
                                <span style="float:right ">
                                {{item.NAME}}
                                </span>
                            </div>
                            <div class="layout">
                            <span>
                            {{item.TITLE}}
                            </span>
                                <span style="float:right ">
                            {{item.PHONE}}
                            </span>
                            </div>
                            <div class="layout">
                            <span style="float:right ">
                            {{item.MODE}}
                            </span>
                            </div>
                            <div class="layout" style="height: 70px">
                                {{item.DETAIL}}
                            </div>
                            <div class="layout">
                            <span>
                                {{item.TIME}}
                            </span>
                                <span style="float:right ">
                                {{item.FLAG}}
                            </span>
                            </div>
                            <div class="layout" style="height:1px;background: #0066cc"></div>
                        </div>
                    </router-link>
                </li>
            </ul>
        </main>
    </div>
</template>
<script>
    import axios from 'axios';
    import {getCookie} from '../assets/js/util.js';
    export default{
        data(){
            return {
                mDatas:[],
                wxData:JSON.parse(decodeURIComponent(getCookie("wx")).replace("j:","")),
            }
        },
        mounted(){
            if(this.wxData == null) {
                window.location.href="/error";
            }else {
                axios.get('/problemList',{ params:{
                        wxCode:this.wxData == null?"":this.wxData.openid
                    }}).then((res)=>{
                    this.mDatas = res.data;
                },(err)=>{

                });
            }
        },
        methods:{
            showDeleteButton(e) {
                clearInterval(this.Loop); //再次清空定时器，防止重复注册定时器
                this.Loop = setTimeout(function() {
                    this.$dialog.confirm({   //这是个弹出框，用的ydui
                        title: '温馨提示',
                        mes: '是否删除此条消息',
                        opts: () => {
                            this.$dialog.loading.open('删除中...');
                            axios.post('/oc/del',{id:e}).then((res)=>{
                                this.$dialog.loading.close();
                                this.$dialog.toast({
                                    mes: res.body.info,
                                    timeout: 1000
                                });
                                window.location.reload();
                            },(err)=>{

                            });
                        }
                    });
                }.bind(this), 1000);
            },
            clearLoop(e) {
                clearInterval(this.Loop);
            },
        }
    }
</script>
<style>
    @import '../assets/css/problemList.css';
</style>
