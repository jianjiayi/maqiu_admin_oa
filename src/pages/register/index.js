import React, { Component } from 'react';

import { Form, Button, Input, Icon, Checkbox, message } from 'antd';

import md5 from 'js-md5';

import MqFooter from '@/components/layout/footer';

import WaveWrapper from '@/components/waveWrapper';

//获取验证码
import CodeButton from '@/components/CodeButton';

import './index.less';

//分装好的axios
import http from '@/api';

const FormItem = Form.Item;

class Register extends Component {
    state = {
        loading: false,
        showBtn: true,
        windowsHeight: '',
    }
    onRef = (ref) => {
        this.child = ref
    };

    //注册
    registerSubmit = (e) => {
        let _this = this;
        let userInfo = this.props.form.getFieldsValue();
        console.log(userInfo)
        this.props.form.validateFields((err, values) => {
            console.log(err)
            if (!err) {
                _this.setState({
                    loading: true
                });
                //密码加密
                userInfo.password = md5(userInfo.password + userInfo.username);

                let params = {
                    username: userInfo.username,
                    password: userInfo.password,
                    email: userInfo.email,
                    codeNum: userInfo.codeNum,
                }
                console.log(params)

                http.post('/user/register', params).then(res => {
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
                            message.success('注册成功，快去登录吧！');
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

            <div className="register" style={{ height: this.state.windowsHeight }}>
                <Form onSubmit={this.registerSubmit} layout="horizontal" className="formRegister">
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
                    <FormItem>
                        {
                            getFieldDecorator('password', {
                                initialValue: '',
                                getValueFromEvent: (event) => {
                                    return event.target.value.replace(/\s+/g, "")
                                },
                                rules: [
                                    {
                                        required: true,
                                        message: '密码不能为空',
                                    }, {
                                        min: 6,
                                        message: '密码不能少于6个字符',
                                    }, {
                                        max: 12,
                                        message: '密码不能大于12个字符',
                                    }
                                ],
                            })(
                                <Input allowClear type="password" prefix={<Icon type="lock"></Icon>} placeholder="请输入密码"></Input>
                            )
                        }
                    </FormItem>
                    <FormItem>
                        {
                            getFieldDecorator('email', {
                                initialValue: '',
                                getValueFromEvent: (event) => {
                                    return event.target.value.replace(/\s+/g, "")
                                },
                                rules: [
                                    {
                                        required: true,
                                        type: 'email',
                                        message: '请输入邮箱'
                                    }
                                ],
                            })(
                                <Input allowClear prefix={<Icon type="credit-card"></Icon>} placeholder="请输入邮箱"></Input>
                            )
                        }
                    </FormItem>
                    <div className='control-flex2'>
                        <FormItem className='codeNum'>
                            {
                                getFieldDecorator('codeNum', {
                                    initialValue: '',
                                    getValueFromEvent: (event) => {
                                        return event.target.value.replace(/\s+/g, "")
                                    },
                                    rules: [
                                        {
                                            required: true,
                                            message: '邮箱验证码'
                                        }
                                    ],
                                })(
                                    <Input allowClear placeholder="邮箱验证码"></Input>
                                )
                            }
                        </FormItem>
                        <FormItem>
                            <CodeButton
                                onRef={this.onRef}
                                buttonType='email'
                                inputVal={this.props.form.getFieldValue('email')}
                            ></CodeButton>
                        </FormItem>
                    </div>

                    <FormItem>
                        <Button type="primary" loading={this.state.loading} size="large" onClick={this.registerSubmit} block>注册</Button>
                    </FormItem>

                    <FormItem>
                        <Button size="large" onClick={this.goLogin} block>已有账号，去登陆</Button>
                    </FormItem>
                </Form>

                <WaveWrapper className="wave-wrapper"></WaveWrapper>

                <MqFooter className="footer"></MqFooter>

            </div>
        )
    }
}


export default Form.create()(Register);




