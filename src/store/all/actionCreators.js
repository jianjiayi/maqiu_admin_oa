import { fromJS } from 'immutable'
import * as constants from './constants'

//保存站点信息
export const save_siteInfo = (siteInfo) => {
    return{
        type:constants.SAVE_SITE_INFO,
        userInfo:fromJS(siteInfo)
    }
};

//登陆成功
export const login_success = (userInfo) => {
    return{
        type:constants.LOGIN_IN_SUCCESS,
        userInfo:fromJS(userInfo)
    }
};


//注销登录
export const login_out = () => {
    return{
        type:constants.LOGIN_OUT
    }
};



//设置面包屑
export const navArrayPush=(newNav)=> {
    return {
        type: constants.NAV_ARRAYS,
        newNav: fromJS(newNav)
    }
};

//删除面包屑
export const navArrayDel=(item)=> {
    return {
        type: constants.DEL_ARRAYS,
        item: item
    }
}