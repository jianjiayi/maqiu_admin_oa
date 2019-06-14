import React, { Component } from 'react';

import { Form, Button, Input, Icon, Checkbox, message } from 'antd';

import { Redirect, Link } from 'react-router-dom';

import md5 from 'js-md5';

import MqFooter from '@/components/layout/footer';

import WaveWrapper from '@/components/waveWrapper';

import { connect } from 'react-redux';
import * as actionCreators from '@/store/all/actionCreators';

import './index.less';

//分装好的axios
import http from '@/api';

const FormItem = Form.Item;

class Login extends Component {
    state = {
        loading: false,
        showBtn: true,
        windowsHeight: '',
    }
    componentDidMount() {
        //获取本地记录token
        const LOCAL_USER = localStorage.getItem('$REMEMBER_USER') ? JSON.parse(localStorage.getItem('$REMEMBER_USER')) : {};

        if (JSON.stringify(LOCAL_USER) !== '{}') {
            this.remberLogin(LOCAL_USER)
        }
    }
    //登录
    loginSubmit = (e) => {
        let _this = this;
        let userInfo = this.props.form.getFieldsValue();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                _this.setState({
                    loading: true
                });
                //密码加密
                userInfo.userPwd = md5(userInfo.userPwd + userInfo.userName);

                let params = {
                    username: userInfo.userName,
                    password: userInfo.userPwd,
                    remember: userInfo.remember,
                }
                console.log(params)

                http.post('/user/login', params).then(res => {
                    console.log(res);
                    
                    _this.setState({
                        loading: false
                    }, () => {
                        if(res === undefined){
                            message.error('网络问题,或服务器异常，稍后重试');
                            return;
                        }
    
                        if (res.status === 200) {
                            let data = res.data.data;
                            _this.props.loginSuccess({
                                username: data.nickname,
                                avatar: data.head_img,
                                token: data.token
                            })

                            //判断用户是否点击了记住密码
                            if (userInfo.remember) {
                                localStorage.setItem('$REMEMBER_USER', JSON.stringify(
                                    {
                                        username: data.nickname,
                                        avatar: data.head_img,
                                        token: data.token
                                    }
                                ));
                            } else {
                                localStorage.setItem('$REMEMBER_USER', JSON.stringify({}));
                            }
                            //跳转到首页
                            _this.props.history.push('/home');
                        } else {
                            localStorage.setItem('$REMEMBER_USER', JSON.stringify({}));
                            message.error(res.data.msg);
                        }
                    });

                });
            }
        })
    }
    //记住密码
    handleCheckBox = (e) => {
        console.log(e.target.checked)
    }

    //本地记录账号密码登录
    remberLogin = (data) => {
        let _this = this;
        _this.props.loginSuccess({
            username: data.username,
            avatar: data.avatar,
            token: data.token
        }, () => {
            //跳转到首页
            _this.props.history.push('/home');
        })
    }

    goRegister = () => {
        this.props.history.push('/register')
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        return (

            <div className="login" style={{ height: this.state.windowsHeight }}>
                {
                    this.props.userInfo.size === 0 || this.props.userInfo.size === undefined ?
                        <div>
                            <Form onSubmit={this.loginSubmit} layout="horizontal" className="formLogin">
                                <FormItem>
                                    {
                                        getFieldDecorator('userName', {
                                            initialValue: '',
                                            getValueFromEvent: (event) => {
                                                return event.target.value.replace(/\s+/g, "")
                                            },
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '用户名不能为空'
                                                },
                                            ]
                                        })(
                                            <Input allowClear prefix={<Icon type="user"></Icon>} placeholder="请输入用户名"></Input>
                                        )
                                    }
                                </FormItem>
                                <FormItem hasFeedback>
                                    {
                                        getFieldDecorator('userPwd', {
                                            initialValue: '',
                                            getValueFromEvent: (event) => {
                                                return event.target.value.replace(/\s+/g, "")
                                            },
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入密码'
                                                },
                                                
                                            ],
                                            
                                        })(
                                            <Input allowClear type="password" prefix={<Icon type="lock"></Icon>} placeholder="请输入密码"></Input>
                                        )
                                    }
                                </FormItem>
                                <div className='control-flex2'>
                                    <FormItem>
                                        {
                                            getFieldDecorator('remember', {
                                                valuePropName: 'checked',
                                                initialValue: false
                                            })(
                                                <Checkbox onChange={(e) => this.handleCheckBox(e)}>七天免登陆</Checkbox>
                                            )
                                        }
                                    </FormItem>
                                    <FormItem>
                                        <Link to="/forget">
                                            忘记密码 ?
                                        </Link>
                                    </FormItem>
                                </div>

                                <FormItem>
                                    <Button type="primary" loading={this.state.loading} size="large" onClick={this.loginSubmit} block>登录</Button>
                                </FormItem>

                                <FormItem>
                                    <Button size="large" onClick={this.goRegister} block>注册</Button>
                                </FormItem>
                            </Form>

                            <WaveWrapper className="wave-wrapper"></WaveWrapper>

                            <MqFooter className="footer"></MqFooter>
                        </div> : <Redirect to="/home"></Redirect>
                }

            </div>
        )
    }
}

const mapState = (state) => {
    return {
        userInfo: state.getIn(['all', 'userInfo'])
    }
}

const mapDispatch = (dispatch) => {
    return {
        loginSuccess(userInfo) {
            dispatch(actionCreators.login_success(userInfo))
        }

    }
}

export default connect(mapState, mapDispatch)(Form.create()(Login));




