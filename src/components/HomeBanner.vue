<template>
	<div class="home_ban">
		<div class="m_banner clearfix" id="my_banner">
            <ul class="banner_box">
                <li>
                    <div style="position:relative;">
                        <div class="img_circular">
                            <figure>
                                <img :src=" wxData.headimgurl " />
                            </figure>
                            <div style="margin-top: 10px">
                                <span>{{wxData.nickname}}</span>
                            </div>
                        </div>
                        <img src="../assets/images/l1.jpg"/>
                    </div>
                </li>
            </ul>
            <ul class="point_box">
            </ul>
        </div>
	</div>
</template>

<script>
    import {getCookie} from '../assets/js/util.js';
    export default{
        mounted(){
            if(this.wxData == null) {
                window.location.href="/error";
            }
        },
        data(){
            return {
                wxData:getCookie("wx")==null?{}:JSON.parse(decodeURIComponent(getCookie("wx")).replace("j:",""))
            }
        },
        methods:{
        }
    }
</script>