import React, { Component } from 'react';

import { Form, Button, Input, Icon, message } from 'antd';


import './index.less';

//分装好的axios
import http from '@/api';

const FormItem = Form.Item;

class CheckUser extends Component {
    state = {
        loading: false,
        showBtn: true,
        windowsHeight: '',
    }
    onRef = (ref) => {
        this.child = ref
    };

    //校验用户名
    checkUserSubmit = (e) => {
        let _this = this;
        let userInfo = this.props.form.getFieldsValue();
        console.log(userInfo)
        this.props.form.validateFields((err, values) => {
            console.log(err)
            if (!err) {
                _this.setState({
                    loading: true
                });

                let params = {
                    username: userInfo.username,
                }
                console.log(params)

                http.post('/user/forget/getUser', params).then(res => {
                    console.log(res);

                    _this.setState({
                        loading: false
                    }, () => {
                        if(res === undefined){
                            message.error('网络问题,或服务器异常，稍后重试');
                            return;
                        }

                        if (res.status === 200) {
                            //重置表单
                            _this.props.form.resetFields();
                            //提示
                            message.success(res.data.msg);
                            //跳转页面
                            _this.props.goUpdatePawd(userInfo.username, res.data.msg);
                        } else {
                            console.log(res.data);
                            message.error(res.data.msg);
                        }
                    });

                });
            }
        })
    }

    goLogin = () => {
        this.props.history.push('/login')
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className='forget-checkuser'>
                <div className='header'>
                    <h3>
                        <span>
                            找回密码
                       </span>
                    </h3>
                </div>
                <div className='form-edit-area'>
                    <div className='label'>
                        <b>输入要找回账号(用户名)</b>
                    </div>
                    <Form className='form' onSubmit={this.checkUserSubmit} layout="horizontal" >
                        <FormItem>
                            {
                                getFieldDecorator('username', {
                                    initialValue: '',
                                    getValueFromEvent: (event) => {
                                        return event.target.value.replace(/\s+/g, "")
                                    },
                                    rules: [
                                        {
                                            required: true,
                                            message: '用户名不能为空'
                                        }, {
                                            min: 3,
                                            message: '用户名长度必须大于3个字符',
                                        },
                                    ]
                                })(
                                    <Input allowClear prefix={<Icon type="user"></Icon>} placeholder="请输入用户名"></Input>
                                )
                            }
                        </FormItem>
                        <FormItem className='submit-button'>
                            <Button type="primary" loading={this.state.loading} size="large" onClick={this.checkUserSubmit} block>下一步</Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        )
    }
}

export default Form.create()(CheckUser);




