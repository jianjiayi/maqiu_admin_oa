import React, { Component } from 'react';

import { Form,  Spin, message, Icon, } from 'antd'
import moment from 'moment';
import 'moment/locale/zh-cn';

import BulletinEditForm from '../components/bulletinform';

import './index.less';
import '@/assets/less/form.less';

//分装好的axios
import http from '@/api';

moment.locale('zh-cn')

class BulletinForm extends Component {
    state = {
        loading: false,
        showBtn: false,
        modelData: {},
    }

    handleSubmit = (params) => {
        let _this = this;

        _this.setState({
            showBtn: true
        });

        console.log(params)

        http.post('/message/create', params).then(res => {
            console.log(res);

            _this.setState({
                showBtn: false
            }, () => {
                if (res === undefined) {
                    message.error('网络问题,或服务器异常，稍后重试');
                    return;
                }

                if (res.status === 200) {
                    //提示
                    message.success(res.data.msg);
                } else {
                    console.log(res.data);
                    message.error(res.data.msg);
                }
            });

        });
    }


    render() {
        return (
            <div className="article">
                <Spin tip="加载中" spinning={this.state.loading} indicator={<Icon type="minus" spin />}>
                    <BulletinEditForm
                        showBtn = {this.state.showBtn}
                        formData={this.state.modelData}
                        buttonSubmit = {this.handleSubmit}
                        >
                    </BulletinEditForm>
                </Spin>
            </div>
        )
    }
};


export default Form.create()(BulletinForm);