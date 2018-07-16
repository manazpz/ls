var Alert = require('./Toast.vue') // 引入vue模板
var Toast = {} // 定义插件对象
Toast.install = function (Vue, options) { // vue的install方法，用于定义vue插件
    // 如果toast还在，则不再执行
    if(document.getElementsByClassName('alertBox').length){
        return
    }
    let toastTpl = Vue.extend(Alert) // 创建vue构造器
    let $vm = new toastTpl() // 实例化vue实例
    // 此处使用$mount来手动开启编译。用$el来访问元素，并插入到body中
    let tpl = $vm.$mount().$el
    document.body.appendChild(tpl)

    Vue.prototype.$toast = { // 在Vue的原型上添加实例方法，以全局调用
        show(options) { // 控制toast显示的方法
            if (typeof options === 'string') { // 对参数进行判断
                $vm.text = options // 传入props
            }
            else if (typeof options === 'object') {
                Object.assign($vm, options) // 合并参数与实例
            }
            $vm.show = true // 显示toast
            setTimeout(() => {
                $vm.show = false;
            }, options.time);
        },
        hide() { // 控制toast隐藏的方法
            $vm.show = false
        }
    }
}
export default Toast; // 导出Toast（注意：此处不能用module exports导出，在一个文件中，不能同时使用require方式引入，而用module exports导出，两种方式不能混用）
