<template>
    <div>
        <!--<div style="height:30px;"></div>-->
        <main>
            <ul>
                <li v-for="item in mDatas" style="margin-top: 20px">
                        <div class="div_layout">
                            <div class="img_layout">
                                <div class="img_phone_circular">
                                    <figure>
                                        <img :src=" item.HEAD_PORTRAIT " />
                                    </figure>
                                </div>
                            </div>
                            <div class="img_layout">
                                <p style="margin-left: 10px">{{item.NAME}}</p>
                                <p style="margin-left: 10px">{{item.OFFICE}}</p>
                                <p style="margin-left: 10px;border: 1px solid #ccc;padding: 0 7px;">{{item.FIELD}}</p>
                            </div>
                            <div class="img_layout" style="float: right;margin-right: 10px">
                                <p style="border: 1px solid red;padding: 0 5px;border-radius: 12px;color: red;">{{item.IS_FLAG}}</p>
                                <router-link :to="{path:'/phoneCounselingDetail',query:item}">
                                    <button>电话咨询</button>
                                </router-link>
                            </div>
                        </div>
                     <div class="div_layout" style="height:1px;background: #0066cc"></div>
                </li>

            </ul>
        </main>
        <!--<div style="height:30px;"></div>-->
    </div>
</template>

<script>
    import axios from 'axios';
    import {getCookie} from '../assets/js/util.js';
    export default{
        data(){
            return {
                mDatas:[],
                wxData:JSON.parse(decodeURIComponent(getCookie("wx")).replace("j:",""))
            }
        },
        mounted(){
            if(this.wxData == null) {
                window.location.href="/error";
            }else{
                axios.get('/lawyerList').then((res)=>{
                    this.mDatas = res.data;
                },(err)=>{

                });
            }

        },
        methods: {
        }
    }
</script>

<style>
    @import '../assets/css/lawyer.css';
</style>
