import React, { Component } from 'react';

import { Form, message, } from 'antd'
import moment from 'moment';
import 'moment/locale/zh-cn';

import PostEditForm from '../components/postform';

//分装好的axios
import http from '@/api';

moment.locale('zh-cn')

class PostForm extends Component {
    state = {
        loading: false,
        dataSource:{
            id:0,
            name:'',
            desc:'',
            resource:[]
        },
        resourceArray:[],
        showBtn: false,
        modelData: {},
    }

    handleSubmit = (params) => {
        let _this = this;

        _this.setState({
            showBtn: false,
        }, () => {
            http.post('/role/create', params).then(res => {
                console.log(res);
    
                if (res === undefined) {
                    message.error('网络问题,或服务器异常，稍后重试');
                    return;
                }
    
                if (res.status === 200) {
                    _this.setState({
                        showBtn: false,
                    }, () => {
                        message.success('角色创建成功');
                    })
                } else {
                    message.error(res.data.msg);
                }
            });
        })
    }


    render() {
        return (
            <div className="role-form">
                <PostEditForm
                    showBtn = {this.state.showBtn}
                    formData={this.state.dataSource}
                    resourceArray={this.state.resourceArray}
                    buttonSubmit = {this.handleSubmit}
                    >
                </PostEditForm>
            </div>
        )
    }
};


export default Form.create()(PostForm);