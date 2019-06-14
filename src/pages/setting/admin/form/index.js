
import React, { Component } from 'react'
import { Form, Button, Input, Icon, Radio, message, Select } from 'antd';

import md5 from 'js-md5';

import './index.less';
import '@/assets/less/form.less';

//分装好的axios
import http from '@/api';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { Option } = Select;

class AdminForm extends Component {
    state = {
        loading: false,
        showBtn: true,
        roleList:[],
    }
    componentDidMount() {
        this.request();
    }
    //ajax加载数据
    request = () => {//status:状态码，pages:查询页数
        let _this = this;
        let params = {};
        _this.setState({
            loading: true,
        },()=>{
            http.post('/role/list', params).then(res => {
                console.log(res);
                if (res === undefined) {
                    message.error('网络问题,或服务器异常，稍后重试');
                    return;
                }
    
                if (res.status === 200) {
                    let list = res.data.data.list;
                    _this.setState({
                        roleList: list,
                    },()=>{
                        _this.setState({
                            loading: false
                        })
                    });
                } else {
                    _this.setState({
                        loading: false,
                    }, () => {
                        message.error(res.data.msg);
                    });
                }
            });
        });
    }

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
                    roleId: userInfo.roleId
                }
                console.log(params)

                http.post('/user/admin/register', params).then(res => {
                    console.log(res);
                    _this.setState({
                        loading: false
                    }, () => {
                        if (res === undefined) {
                            message.error('网络问题,或服务器异常，稍后重试');
                            return;
                        }

                        if (res.status === 200) {
                            //重置表单
                            _this.props.form.resetFields();
                            message.success('添加系统用户成功');
                        } else {
                            message.error(res.data.msg);
                        }
                    });
                });
            }
        })
    }


    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className='admin-addform' >
                <Form onSubmit={this.registerSubmit} layout="horizontal" className="formRegister">
                    <FormItem label="用户名">
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
                    <FormItem label="初始密码">
                        {
                            getFieldDecorator('password', {
                                initialValue: '111111',
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
                                <Input allowClear disabled prefix={<Icon type="lock"></Icon>} placeholder="请输入密码"></Input>
                            )
                        }
                    </FormItem>
                    <FormItem label="绑定邮箱">
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

                    <Form.Item label="系统角色" hasFeedback>
                        {getFieldDecorator('roleId', {
                            rules: [
                                { 
                                    required: true, 
                                    message: '系统角色不能为空' 
                                }
                            ],
                        })(
                            <Select placeholder="请选择一个系统角色">
                                {
                                    this.state.roleList.map((item,index)=>{
                                        return <Option value={item.id} key={index}>{item.role_name}</Option>
                                    })
                                }
                            </Select>,
                        )}
                    </Form.Item>

                    <FormItem className="submit-button">
                        <Button type="primary" loading={this.state.loading} onClick={this.registerSubmit} block>添加</Button>
                    </FormItem>
                </Form>

            </div>
        )
    }
}

export default Form.create()(AdminForm)
