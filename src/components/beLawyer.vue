<template xmlns:v-cddv-input="http://www.w3.org/1999/xhtml" xmlns:v-cddv-msg="http://www.w3.org/1999/xhtml"
          xmlns:v-cddv-final-check="http://www.w3.org/1999/xhtml">
    <div>
        <div class="div_layout" >
            <p class="div_layout_p">申请成为律师</p>
        </div>
            <div class="div_layout" style="height:1px;background: #0066cc"></div>
            <div class="div1_layout">
                <span style="height: 10px">姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名：</span>
                <input v-model="NAME" type="text" style="height: 25px;width: 70%;border: 1px solid #808080; border-radius: 5px;" >
            </div>

            <div class="div1_layout">
                <span style="height: 10px ">事&nbsp;&nbsp;&nbsp;务&nbsp;&nbsp;&nbsp;&nbsp;所：</span><input v-model="OFFICE" style="height: 25px; width: 70%;border: 1px solid #808080; border-radius: 5px;">
            </div>
            <div class="div1_layout">
                <span style="height: 10px">擅&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;长：</span><input v-model="FIELD" style="height: 25px; width: 70%;border: 1px solid #808080; border-radius: 5px;">
            </div>
            <div class="div1_layout">
                <span style="height: 10px">可接听时段：</span><input v-model="CALLTIME" style="height: 25px; width: 70%;border: 1px solid #808080; border-radius: 5px;">
            </div>
            <div class="div1_layout">
                <span style="height: 10px">价格/元/&nbsp;分：</span><input v-model="MONEY" style="height: 25px; width: 70%;border: 1px solid #808080; border-radius: 5px;">
            </div>
            <div class="lay">
                <button type="submit" @click="submit" style = 'width: 100%;height: 36px;margin: 25px auto 25px;border-radius: 4px;background: #0066cc;font-size: 18px;' >申请</button>
            </div>
            <div class="lay">
                <p>温馨提示：</p>
                <p>1、您申请成为律师需管理员进行资质审核,预计48小时内回复。</p>
            </div>
    </div>
</template>
<script>
    import axios from 'axios';
    import {getCookie} from '../assets/js/util.js';
    export default{
        data(){
            return{
                NAME:'',
                OFFICE:'',
                FIELD:'',
                CALLTIME:'',
                MONEY:'',
                wxData:JSON.parse(decodeURIComponent(getCookie("wx")).replace("j:","")),
            }
        },
        mounted(){

        },
        methods:{
            submit: function () {
                if(this.NAME == ''){
                    alert("姓名不能为空！");
                    return;
                }
                if(this.OFFICE == ''){
                    alert("事务所不能为空！");
                    return;
                }
                if(this.FIELD == ''){
                    alert("擅长不能为空！");
                    return;
                }
                if(this.CALLTIME == ''){
                    alert("可接听时段不能为空！");
                    return;
                }
                if(this.MONEY == ''){
                    alert("价格不能为空！");
                    return;
                }
                let param = new FormData();
                //请求参数
                param.append('WX_CODE', this.wxData==null?"":this.wxData.openid);
                param.append('WX_IMG', this.wxData==null?"":this.wxData.headimgurl);
                param.append('NAME', this.NAME);
                param.append('OFFICE', this.OFFICE);
                param.append('FIELD', this.FIELD);
                param.append('MONEY', this.MONEY);
                param.append('CALLTIME', this.CALLTIME);
                debugger;
                let config = {
                    headers: {'Content-Type': 'multipart/form-data'}
                };
                axios.post('/server/lawyer/add',param,config).then((res)=>{
                    if(res.status == "200"){
                        this.$toast.show({text:res.data.msg,position:'bottom',time:1500});
                        this.init();
                    }

                },(err)=>{

                });

            },
            init:function () {
                this.NAME='';
                this.OFFICE='';
                this.FIELD='';
                this.CALLTIME='';
                this.MONEY='';
            }
        }
    }

</script>

<style>
    @import '../assets/css/lawyer.css';
</style>

