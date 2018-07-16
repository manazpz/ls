"use strict"
const crypto = require('crypto');
const moment = require('moment');
module.exports = {
    MD5_SUFFXIE: "HUNCSCDMM@#@$^%&^*%#$GFbggnCDSccxczvdsdhagbnfghvZfsdv",
    SKIP_URL:"http://www.dalvshilaila.com:8080",
    md5: (str)  => {
        let md5Obj = crypto.createHash('md5');
        md5Obj.update(str);
        return md5Obj.digest('hex');
    },
    stringToDate:(str) => {
        return moment(str) / 1000;
    },
    getpm: (str)=> {
        switch (str){
            case 'pt_1':
                return "未成年保护";
            case 'pt_2':
                return "婚姻家庭";
            case 'pt_3':
                return "交通事务";
            case 'pt_4':
                return "经济纠纷";
            case 'pt_5':
                return "劳务事务";
            case 'pt_6':
                return "医疗纠纷";
            case 'pt_7':
                return "合同法务";
            case 'pt_8':
                return "人事纠纷";
            case 'pt_9':
                return "知识产权";
            case 'pt_10':
                return "刑事案件";
            case 'pt_11':
                return "网络侵权";
            default :
                return "其他";
        }
    },
    getcm: (str)=> {
        switch (str){
            case 'cc':
                return "收费咨询";
            default :
                return "免费咨询";
        }
    },
    iswr: (str)=> {
        switch (str){
            case 'Y':
                return "已回复";
            default :
                return "未回复";
        }
    },
    ispay: (str)=> {
        switch (str){
            case 'Y':
                return "已支付";
            case 'N':
                return "未支付";
            default :
                return "";
        }
    },
    isLogin: (req, res, next)=>{
        if (!req.session.loginUser) {
            res.status(200).send({ 'msg': '未登录', 'status': -1 }).end();
        } else {
            next();

        }
    },

}