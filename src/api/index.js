import axios from "axios";
import qs from "qs";
import { Redirect } from 'react-router-dom';
import { BASE_URL, HTTP_TIMEOUT } from "@/config";

// 添加请求拦截器
axios.interceptors.request.use(
    config => {
        let TOKEN;
        //获取本地记录的token
        let LOCAL_USER = localStorage.getItem('$REMEMBER_USER') ? JSON.parse(localStorage.getItem('$REMEMBER_USER')) : '{}';
        if (JSON.stringify(LOCAL_USER) !== "{}") {
            //获取本地保存的token
            TOKEN = LOCAL_USER.token
        } else {
            //获取登录后保存在sessionStorage中的token
            let SESSION_USER = JSON.parse(sessionStorage.getItem('$user'));
            if(SESSION_USER){
                TOKEN = SESSION_USER.token;
            }
        }
        //设置Authorization = tokern
        if (TOKEN) {
            config.headers.Authorization = `Bearer ${TOKEN}`
        }

        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// 添加响应拦截器
axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response) {

            switch (error.response.status) {
                case 401://登录超时
                    localStorage.setItem('$REMEMBER_USER', JSON.stringify({}));
                    // window.location = '/login'
            }
        }
        return Promise.reject(error.response);
    }
);

export default {
    post(url, data) {
        return axios({
            method: "post",
            baseURL: BASE_URL,
            url,
            data: qs.stringify(data),
            timeout: HTTP_TIMEOUT,
        })
            .then(response => {
                return response;
            })
            .catch(error => {
                return error;
            });
    },
    get(url, data) {
        return axios({
            method: "get",
            baseURL: BASE_URL,
            url,
            params: data, // get 请求时带的参数
            timeout: HTTP_TIMEOUT,
        })
            .then(response => {
                return response;
            })
            .catch(error => {
                return error;
            });
    }
};
