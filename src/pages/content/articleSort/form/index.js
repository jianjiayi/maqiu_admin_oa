
import React, { Component } from 'react'
import { Form, message } from 'antd';

import SortForm from '../components/sortform.js';

import './index.less';
import '@/assets/less/form.less';

//分装好的axios
import http from '@/api';

class ArticleSortForm extends Component {
    state = {
        showBtn: false,
        formData:{
            pcode:0,
            name:'',
            outlink:''
        }
    }
    //添加分类
    addSortSubmit = (params) => {
        let _this = this;
        http.post('/sort/create', params).then(res => {
            console.log(res);
            _this.setState({
                showBtn: false
            }, () => {
                if(res === undefined){
                    message.error('网络问题,或服务器异常，稍后重试');
                    return;
                }

                if (res.status === 200) {
                    //重置表单
                    message.success('添加分类成功');
                } else {
                    message.error(res.data.msg);
                }
            });
        });
    }
    render() {
        return (
            <div className='article-sort-addform' >
                <SortForm 
                    btnLodding = {this.state.showBtn}
                    formData={this.state.formData}
                    formDataSubmit={this.addSortSubmit}
                ></SortForm>
            </div>
        )
    }
}

export default Form.create()(ArticleSortForm)
