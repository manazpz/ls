<template>
    <div>
        <div class="m_banner clearfix" id="my_banner">
            <ul class="banner_box">
                <li>
                    <img src="../assets/images/l1.jpg"/>
                </li>
            </ul>
            <ul class="point_box">
            </ul>
        </div>
        <div class="home_n">
            <nav class="m_nav">
                <ul>
                    <li class="nav_item">
                        <a href="/home" class="nav_item_link">
                            <img src="../assets/images/nav0.png" alt="" >
                            <span>在线咨询</span>
                        </a>
                    </li>
                    <li class="nav_item">
                        <a href="/lawyerList" class="nav_item_link">
                            <img src="../assets/images/nav1.png" alt="" >
                            <span>电话咨询</span>
                        </a>
                    </li>
                    <li class="nav_item">
                        <a href="/beLawyer" class="nav_item_link">
                            <img src="../assets/images/nav2.png" alt="" >
                            <span>成为律师</span>
                        </a>
                    </li>
                    <!--<li class="nav_item">-->
                        <!--<a href="/home" class="nav_item_link">-->
                            <!--<img src="../assets/images/nav0.png" alt="" >-->
                            <!--<span>在线咨询</span>-->
                        <!--</a>-->
                    <!--</li>-->
                    <!--<li class="nav_item">-->
                        <!--<a href="/lawyerList" class="nav_item_link">-->
                            <!--<img src="../assets/images/nav0.png" alt="" >-->
                            <!--<span>电话咨询</span>-->
                        <!--</a>-->
                    <!--</li>-->
                    <!--<li class="nav_item">-->
                        <!--<a href="/home" class="nav_item_link">-->
                            <!--<img src="../assets/images/nav0.png" alt="" >-->
                            <!--<span>在线咨询</span>-->
                        <!--</a>-->
                    <!--</li>-->
                    <!--<li class="nav_item">-->
                        <!--<a href="/lawyerList" class="nav_item_link">-->
                            <!--<img src="../assets/images/nav0.png" alt="" >-->
                            <!--<span>电话咨询</span>-->
                        <!--</a>-->
                    <!--</li>-->
                </ul>
            </nav>
        </div>
    </div>
</template>
<style>
    .box.bottom {
        overflow: hidden;
        top: 45%;
        bottom: 50px;
        width: 60%;
        height: 50px;
        margin: 0 0 0 -30%;
        line-height: 50px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space:nowrap;
    }

</style>
<script>
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
            }
        },
        methods:{
        }
    }
</script>

<style>
    @import '../assets/css/home.css';
</style>
