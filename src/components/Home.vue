<template>
	<div class="home">
		<div class="m_layout">
            <!--<div style="height:30px;"></div>-->
            <!-- 轮播图-->
            <HomeBannerView></HomeBannerView>
            <!--商品区-->
            <HomeMainView></HomeMainView>
            <!--<div style="height:30px;"></div>-->
        </div>
	</div>
</template>
 <script>

    import HomeBannerView from './HomeBanner.vue';
    import HomeMainView from './HomeMain.vue';
    import {} from '../assets/js/home.js';
    export default{
       components:{
           HomeBannerView,
           HomeMainView
       },
       mounted(){
       }
    }
</script>
<style>
@import '../assets/css/home.css';
</style>