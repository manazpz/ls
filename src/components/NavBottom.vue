<template>
    <div class="footer">
        <footer class="fixBottomBox">
            <ul>

                <router-link tag="li" to="/home" class="tabItem">
                    <a href="javascript:;" class="tab-item-link">
                        <span class="tab-item-span">我要提问</span>
                    </a>
                </router-link>
                <hr style="height:40px;margin-top:7px" />
                <router-link tag="li" to="/problemList" class="tabItem">
                    <a href="javascript:;" class="tab-item-link">
                        <span class="tab-item-span">我的提问</span>
                    </a>
                </router-link>
                <hr style="height:40px;margin-top:7px" />
                <router-link tag="li" to="/state" class="tabItem">
                    <a href="javascript:;" class="tab-item-link">
                        <span class="tab-item-span">免责声明</span>
                    </a>
                </router-link>
            </ul>
        </footer>
    </div>
</template>