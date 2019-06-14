import React, { Component } from 'react';

import { withRouter } from 'react-router';

import { Form, Button, Input, Icon, Modal, message } from 'antd';

import md5 from 'js-md5';

import './index.less';


//分装好的axios
import http from '@/api';

const FormItem = Form.Item;;

class UpdatePawd extends Component {
    state = {
        loading: false,
        loginModal: false,
        windowsHeight: '',
    }
    onRef = (ref) => {
        this.child = ref
    };

    //修改密码
    updatePawdSubmit = (e) => {
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
                    newpawd: userInfo.password,
                    codeNum: userInfo.codeNum,
                }
                console.log(params)

                http.post('/user/forget/updatePassword', params).then(res => {
                    console.log(res);

                    _this.setState({
                        loading: false
                    }, () => {
                        if(res === undefined){
                            message.error('网络问题,或服务器异常，稍后重试');
                            return;
                        }

                        if (res.status === 200) {
                            Modal.success({
                                title: '提示',
                                content: '密码修改成功，马上去登陆吧',
                                onOk() {
                                    //重置表单
                                    _this.props.form.resetFields();
                                    //跳转
                                    _this.goLogin()
                                },
                            });
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
        this.props.history.push('/login');
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className='forget-update'>
                <div className='header'>
                    <h3>
                        <span>
                            修改密码
                       </span>
                    </h3>
                </div>
                <div className='form-edit-area'>
                    <div className='label'>
                        <b>{this.props.msg}</b>
                    </div>
                    <Form className='form' onSubmit={this.updatePawdSubmit} layout="horizontal" >

                        <FormItem>
                            {
                                getFieldDecorator('username', {
                                    initialValue: this.props.username,
                                    getValueFromEvent: (event) => {
                                        return event.target.value.replace(/\s+/g, "")
                                    },
                                })(
                                    <Input
                                        disabled
                                        prefix={<Icon type="user"></Icon>}>
                                    </Input>
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
                                getFieldDecorator('codeNum', {
                                    initialValue: '',
                                    getValueFromEvent: (event) => {
                                        return event.target.value.replace(/\s+/g, "")
                                    },
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入验证码'
                                        }
                                    ],
                                })(
                                    <Input allowClear prefix={<Icon type="credit-card"></Icon>} placeholder="请输入邮箱验证码"></Input>
                                )
                            }
                        </FormItem>
                        <FormItem className='submit-button'>
                            <Button type="primary" loading={this.state.loading} size="large" onClick={this.updatePawdSubmit} block>下一步</Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        )
    }
}

export default withRouter(Form.create()(UpdatePawd));




