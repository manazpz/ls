<template xmlns:v-cddv-input="http://www.w3.org/1999/xhtml" xmlns:v-cddv-msg="http://www.w3.org/1999/xhtml"
          xmlns:v-cddv-final-check="http://www.w3.org/1999/xhtml">
    <div>
        <!--<div style="height:30px;"></div>-->

        <main>

            <div class="div_layout">
                <div class="img_layout">
                    <div class="img_phone_circular">
                        <figure>
                            <img :src=" mData.HEAD_PORTRAIT " />
                        </figure>
                    </div>
                </div>
                <div class="img_layout">
                    <p style="margin-left: 10px">{{mData.NAME}}</p>
                    <p style="margin-left: 10px">{{mData.OFFICE}}</p>
                    <p style="margin-left: 10px">{{mData.FIELD}}</p>
                </div>
                <div class="img_layout" style="float: right;margin-right: 10px">
                    <span style="color: #F23030">￥</span><span style="color: #F23030">{{mData.MONEY}}</span><span>/分钟</span>
                </div>
            </div>
            <div class="div_layout" style="height:1px;background: #0066cc"></div>
            <div class="div1_layout">
                <span style="height: 10px">称&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;呼：</span>
                <input v-model="consumers" type="text" style="height: 25px;width: 70%;border: 1px solid #808080; border-radius: 5px;" >
            </div>

            <div class="div1_layout">
                <span style="height: 10px">接收电话：</span><input v-model="phone" style="height: 25px; width: 70%;border: 1px solid #808080; border-radius: 5px;">
            </div>
            <div class="div1_layout">
                <span style="height: 10px">购买时长：</span>
                <input type="radio" id="10" value="10" v-model="duration" @change="radioChange(10)">
                <label for="10">10分钟</label>
                <input type="radio" id="20" value="20" v-model="duration" @change="radioChange(20)">
                <label for="20">20分钟</label>
                <input type="radio" id="30" value="30" v-model="duration" @change="radioChange(30)">
                <label for="30">30分钟</label>
            </div>
            <div class="div1_layout" style="padding-bottom: 22px;border-bottom: 1px solid #0066cc;">
                <span style="height: 10px">共需支付：{{price}} 元</span>
            </div>
            <div class="lay">
                <button type="submit" @click="pay" style = 'width: 100%;height: 36px;margin: 25px auto 25px;border-radius: 4px;background: #0066cc;font-size: 18px;' >提交</button>
            </div>
            <div class="lay">
                <p>温馨提示：</p>
                <p>1、请尽量将问题描述清楚；</p>
                <p>2、系统将根据您所提问的类型和内容推荐最适合的律师；</p>
                <p>3、电话咨询需购买10分钟以上，若有剩余，剩余金额不予退还；</p>
                <p>4、请尽量保证电话在指定的时间段畅通；</p>
                <p>5、超过购买时长，律师可主动结束通话；</p>
            </div>

        </main>

        <!--<div style="height:30px;"></div>-->
    </div>
</template>
<script>
    import axios from 'axios';
    import {getCookie} from '../assets/js/util.js';
    import wexinPay from '../assets/js/wxpay.js';
    export default{
        mounted(){
            if(this.wxData == null) {
                window.location.href="/error";
            }
        },
        data(){
            return {
                mData: this.$route.query,
                consumers:'',
                duration:'',
                phone:'',
                price:0,
                wxData:JSON.parse(decodeURIComponent(getCookie("wx")).replace("j:","")),
             }
        },
        methods:{
            radioChange(data){
                var price = this.mData.MONEY;
                this.price = data * price;
            },
            pay(){
                if(this.consumers == ''){
                   alert("称呼不能为空！");
                   return;
                }
                if(this.duration == ''){
                    alert("购买时长不能为空！");
                    return;
                }
                if(this.phone == ''){
                    alert("联系方式不能为空！");
                    return;
                }
                if(this.price == 0){
                    alert("价格不能为空！");
                    return;
                }
                let param = {
                    "trade_name":this.mData.NAME,"trade_OFFICE":this.mData.OFFICE,"trade_type":this.mData.FIELD,"trade_openid":this.mData.OPENID,
                    "trade_charge":this.mData.MONEY,"consumers":this.consumers,"phone":this.phone,"ls_id":this.mData.ID,
                    "duration":this.duration,"price":this.price,"openid":this.wxData.openid,"wx_name":this.wxData.nickname
                };
                axios.post('/wx/pay',param).then((res)=>{
                    if(res.status == "200"){
                        wexinPay(res.data,function success(res) {
                            alert("支付成功！");
                            window.location.href = '/lawyerList';
                        },function error(res) {
                            alert("支付失败！");
                        });
                    }

                },(err)=>{
                    alert("请求失败！");
                });
            }
        }
    }
</script>

<style>
    @import '../assets/css/lawyer.css';
</style>

