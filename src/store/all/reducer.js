import { fromJS } from 'immutable'
import * as constants from './constants'

//添加默认值
let userInfo = sessionStorage.getItem('$user') ?
    JSON.parse(sessionStorage.getItem('$user')) :
    fromJS({});
let navArrays = sessionStorage.getItem('$navArrays') ?
    JSON.parse(sessionStorage.getItem('$navArrays')) :
    fromJS(
        [
            {
                name: "首页",
                path: "/home",
                icon: "home"
            }
        ]
    );
let defaultState = fromJS({
    navArrays,
    userInfo,
})


export default (state = defaultState, action) => {
    switch (action.type) {
        //登陆成功
        case constants.LOGIN_IN_SUCCESS:
            sessionStorage.setItem('$user', JSON.stringify(action.userInfo));
            return state.set('userInfo', action.userInfo);
        //注销登录
        case constants.LOGIN_OUT:
            localStorage.setItem('$REMEMBER_USER', JSON.stringify({}));
            sessionStorage.setItem('$user', JSON.stringify({}));
            return state.set('userInfo', fromJS({}));
        //设置添加面包屑
        case constants.NAV_ARRAYS:
            sessionStorage.setItem('$navArrays', JSON.stringify(action.newNav));
            return state.set('navArrays', action.newNav);
        //删除指定的面包屑
        case constants.DEL_ARRAYS:
            let ARRAYS = JSON.parse(sessionStorage.getItem('$navArrays'));
            ARRAYS = ARRAYS.filter(tag => tag.path !== action.item.path);
            sessionStorage.setItem('$navArrays', JSON.stringify(ARRAYS));
            return state.set('navArrays', fromJS(ARRAYS))
        default:
            return state
    }
}





