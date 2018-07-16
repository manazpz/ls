<template>
    <div>
        <div style="height:10px;"></div>
        <div>
            <select name="type" id="type" class="state pickout" >
                <option value="pt_0">选择问题类型</option>
                <option value="pt_1">未成年保护</option>
                <option value="pt_2">婚姻家庭</option>
                <option value="pt_3">交通事务</option>
                <option value="pt_4">经济纠纷</option>
                <option value="pt_5">劳务事务</option>
                <option value="pt_6">医疗纠纷</option>
                <option value="pt_7">合同法务</option>
                <option value="pt_8">人事纠纷</option>
                <option value="pt_9">知识产权</option>
                <option value="pt_10">刑事案件</option>
                <option value="pt_11">网络侵权</option>
                <option value="pt_12">其他</option>
            </select>
        </div>
        <span class="span_right" style="color: #A4A4A4;">还可以输入{{areaNum}}字</span>
        <div class="lay">
            <textarea v-model="detail" placeholder="请尽可能地清晰描述您的问题，系统将会为您匹配相关领域的专业律师为您解答，限定150字；" class="area" @change="LimitTextArea()" @keyup="LimitTextArea()" @keydown="LimitTextArea()"></textarea>
        </div>
        <div class="lay">
            <!--<input id="pic" type="file" name = 'pic' accept = "image/*" multiple/>-->

            <a href="javascript:;" class="a-upload">
                <input id="pic" type="file" name = 'pic' accept = "image/*" multiple/>
                <!--点击这里上传文件-->
            </a>


        </div>
        <span style=" margin: 10px;float:right;color: #A4A4A4;">注图片非必选</span>
        <div class="lay">
            <input v-model="title" type="text" style = 'width:100%;height: 30px' @change="LimitTitle()" @keyup="LimitTitle()" @keydown="LimitTitle()" placeholder="请输入你的主题（限20字）">
        </div>
        <span style="margin-left: 10px;margin-right: 10px;float:right;color: #A4A4A4;">主题还可以输入{{inputNum}}字</span>
        <span style="float: left; margin: 0 6px 0 13px;">日期</span>
        <img src="../assets/images/date.png" style="float: left;width: 30px;height: 30px; margin-top: -5px;">
        <div class="lay">
            <input type="text" name="DATE" id="DATE" style = 'width:100%;height: 30px' readonly class="input" placeholder="请填写日期" />
        </div>
        <div class="lay">
            <span>咨询方式：</span>
            <input type="radio" name="bedStatus" id="fc" value="fc" v-model="mode">
            <label for="fc">免费咨询</label>
            <input type="radio" name="bedStatus" id="cc" value="cc" v-model="mode" style="margin-left: 14px;">
            <label for="cc">收费咨询</label>
            <p id="rate" style="display:none;">需支付：￥{{price}}</p>
        </div>
        <div class="lay">
            <input v-model="name" type="text" style = 'width:100%;height: 30px' placeholder="姓名" />
        </div>
        <div class="lay">
            <input v-model="phone" type="text" style = 'width:100%;height: 30px' placeholder="联系方式" />
        </div>
        <div class="lay">
            <button type="submit" style = 'width:100%;height: 40px;background: rgb(0, 102, 204); font-size: 18px;' @click="submit">提交</button>
        </div>
    </div>
</template>
<script>
    import pickout from '../assets/js/pickout.js';
    import '../assets/js/mobiscroll_date.js';
    import '../assets/js/mobiscroll.js';
    import wexinPay from '../assets/js/wxpay.js';
    import axios from 'axios';
    import {getCookie} from '../assets/js/util.js';
    import Toast from '../components/toast/index';
    export default{
        data(){
            return{
                detail:'',
                title:'',
                areaNum:150,
                inputNum:20,
                mode:'fc',
                name:'',
                phone:'',
                price:'0.01',
                wxData:JSON.parse(decodeURIComponent(getCookie("wx")).replace("j:","")),

            }
        },
        mounted(){
            pickout.to({
                el:'.state',
                theme: 'green'
            });
            pickout.updated('.state');

            var currYear = (new Date()).getFullYear();
            var opt={};
            opt.date = {preset : 'date'};
            opt.datetime = {preset : 'datetime'};
            opt.time = {preset : 'time'};
            opt.default = {
                theme: 'android-ics light', //皮肤样式
                display: 'modal', //显示方式
                mode: 'scroller', //日期选择模式
                dateFormat: 'yyyy-mm-dd',
                lang: 'zh',
                showNow: true,
                nowText: "今天",
                startYear: currYear - 50, //开始年份
                endYear: currYear + 10 //结束年份
            };

            $("#DATE").mobiscroll($.extend(opt['date'], opt['default']));


            $('input[type=radio][name=bedStatus]').change(function() {
                if (this.value == 'fc') {
                    $("#rate")[0].style.display = 'none';
                }
                if (this.value == 'cc') {
                    $("#rate")[0].style.display = 'block';
                }
            });

        },
        methods:{
            LimitTextArea() {
                var maxlimit = 150;
                this.areaNum = maxlimit - this.detail.length;
                if (this.detail.length > maxlimit) {
                    this.detail = this.detail.substring(0, maxlimit);
                    this.areaNum = 0;
                    alert("字数在10-150！");
                }
            },
            LimitTitle() {
                var maxlimit = 20;
                this.inputNum = maxlimit - this.title.length;
                if (this.title.length > maxlimit) {
                    this.title = this.title.substring(0, maxlimit);
                    this.inputNum = 0;
                    alert("字数在20！");
                }
            },
            submit: function () {
                if($("#type")[0].value == 'pt_0'){
                    this.$toast.show({text:'请重新选择问题类型',position:'bottom',time:1500});
                    return;
                }
                if(this.detail == ''){
                    alert("问题描述不能为空！");
                    return;
                }
                if(this.title == ''){
                    alert("主题不能为空！");
                    return;
                }
                if($('#DATE')[0].value == ''){
                    alert("时间不能为空！");
                    return;
                }
                if(this.name == 0){
                    alert("姓名不能为空！");
                    return;
                }
                if(this.phone == 0){
                    alert("联系方式不能为空！");
                    return;
                }
                let files = $("#pic").get(0).files;
                let param = new FormData();
                //请求参数
                for(var i=0; i< files.length; i++){
                    param.append("file",files[i]);   // 文件对象
                }
                param.append('WX_CODE', this.wxData==null?"":this.wxData.openid);
                param.append('WX_NAME', this.wxData==null?"":this.wxData.nickname);
                param.append('TYPE', $("#type")[0].value);
                param.append('DETAIL', this.detail);
                param.append('TITLE', this.title);
                param.append('TIME', $('#DATE')[0].value);
                param.append('MODE', this.mode);
                param.append('NAME', this.name);
                param.append('PHONE', this.phone);
                if(this.mode == "fc")
                    param.append('PRICE', '');
                if(this.mode == "cc")
                    param.append('PRICE', this.price);

                let config = {
                    headers: {'Content-Type': 'multipart/form-data'}
                };
                axios.post('/problem',param,config).then((res)=>{
                    if(res.status == "200"){
                        if(res.data.status == "1"){
                            this.$toast.show({text:res.data.msg,position:'bottom',time:1500});
                        }else {
                            wexinPay(res.data,function success(res) {
                                alert("支付成功！");
                            },function error(res) {
                                alert("支付失败！");
                            });
                        }
                        this.init();
                    }

                },(err)=>{

                });

            },
            init:function () {
                $("#type")[0].value = 'pt_0';
                $('#DATE')[0].value = '';
                this.detail = '';
                this.title = '';
                this.time = '';
                this.mode = 'fc';
                this.name = '';
                this.phone = '';
                var file = $("#pic") ;
                file.after(file.clone().val(""));
                file.remove();
            }
        }
    }

</script>
<style>
    @import '../assets/css/pickout.css';
    @import '../assets/css/mobiscroll.css';
    @import '../assets/css/mobiscroll_date.css';
</style>
