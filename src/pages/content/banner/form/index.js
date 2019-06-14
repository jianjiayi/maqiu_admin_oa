
import React, { Component } from 'react'
import { Form, message } from 'antd';

import BannerEditForm from '../components/bannerform.js';

import './index.less';
import '@/assets/less/form.less';

//分装好的axios
import http from '@/api';

class LinkForm extends Component {
    state = {
        showBtn: false,
        formData:{
            title:'',
            subtitle:'',
            gid:'0',
            pic:'',
            link:'',
        }
    }
    //添加分类
    addSortSubmit = (params) => {
        let _this = this;
        http.post('/banner/create', params).then(res => {
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
                    message.success('添加链接成功');
                } else {
                    message.error(res.data.msg);
                }
            });
        });
    }
    render() {
        return (
            <div className='banner-addform' >
                <BannerEditForm 
                    fileList={[]}
                    btnLodding = {this.state.showBtn}
                    formData={this.state.formData}
                    formDataSubmit={this.addSortSubmit}
                ></BannerEditForm>
            </div>
        )
    }
}

export default Form.create()(LinkForm)
