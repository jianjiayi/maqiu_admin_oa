import React, { Component } from 'react';

import { Form, Button, Input, Spin, message, Icon, Checkbox, Select } from 'antd';

import './index.less';
import '@/assets/less/form.less';

//分装好的axios
import http from '@/api';

const FormItem = Form.Item;

class BulletinForm extends Component {

    state = {
        loading: false,
        selectResource: [],
        role_Resource: [],
    }

    componentDidMount() {
        this.request();
    }

    //ajax加载数据
    request = () => {//status:状态码，pages:查询页数
        let _this = this;
        let params = {}
        _this.setState({
            loading: true,
        });
        http.post('/resource/list', params).then(res => {
            console.log(res);
            if (res === undefined) {
                message.error('网络问题,或服务器异常，稍后重试');
                return;
            }

            if (res.status === 200) {
                let list = res.data.data.listData;
                _this.setState({
                    role_Resource: list,
                }, () => {
                    _this.setState({
                        loading: false,
                    });
                })
            } else {

            }
        });

    }


    handleSubmit = () => {
        let _this = this;

        //获取输入框内容
        let dataInfo = _this.props.form.getFieldsValue();
        _this.props.form.validateFields((err, values) => {
            console.log(err)
            if (!err) {
                let params = dataInfo
                console.log(params)

                _this.props.buttonSubmit(params);
                _this.setState({
                    selectResource: [],
                });
                _this.props.form.resetFields();
            }
        })
    }
    onChange = (checkedValues) => {
        console.log(checkedValues);
        let _this = this;
        _this.setState({
            selectResource: checkedValues
        }, () => {
            _this.props.form.setFieldsValue({ 'role_Resource': _this.state.selectResource })
        })
    }


    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <div className="role-set">
                <Spin tip="加载中" spinning={this.state.loading} indicator={<Icon type="minus" spin />}>
                    <Form>
                        <FormItem label="角色名称">
                            {
                                getFieldDecorator('role_name', {
                                    initialValue: this.props.formData.role_name,
                                    getValueFromEvent: (event) => {
                                        return event.target.value.replace(/\s+/g, "")
                                    },
                                    rules: [
                                        {
                                            required: true,
                                            message: '角色名称不能为空'
                                        },
                                    ]
                                })(<Input placeholder="请输入角色名称"></Input>)
                            }
                        </FormItem>
                        <FormItem label="角色描述">
                            {
                                getFieldDecorator('role_desc', {
                                    initialValue: this.props.formData.role_desc,
                                    getValueFromEvent: (event) => {
                                        return event.target.value.replace(/\s+/g, "")
                                    },
                                    rules: [
                                        {
                                            required: true,
                                            message: '角色描述不能为空'
                                        },
                                    ]
                                })(<Input placeholder="请输入角色描述"></Input>)
                            }
                        </FormItem>

                        <FormItem className="middle-flex-start" label="角色权限" style={{ width: '100%' }}>
                            {
                                getFieldDecorator('role_Resource', {
                                    initialValue: this.props.resourceArray,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请为角色添加权限'
                                        },
                                    ]
                                })(
                                    <div>
                                        <Checkbox.Group
                                            style={{ width: '100%' }}
                                            defaultValue={this.props.resourceArray}
                                            onChange={this.
                                                onChange}
                                            key={this.props.formData.id}>
                                            {
                                                this.state.role_Resource ? (
                                                    this.state.role_Resource.map((data, index) => {
                                                        return <ul className='role-box' key={index}>
                                                            <li className='route-resource'>
                                                                <div className='route'>
                                                                    <Icon type={data.icon}></Icon>
                                                                    <span className='route-name'>{data.name}</span>
                                                                </div>
                                                                <div className='resource'>
                                                                    <span className='item'>
                                                                        <Checkbox value={data.id}>浏览</Checkbox>
                                                                    </span>
                                                                </div>
                                                            </li>

                                                            {
                                                                data.children ?
                                                                    (
                                                                        data.children.map((item, indx) => {
                                                                            return <li className='route-resource' key={indx}>
                                                                                <div className='route'>
                                                                                    <Icon type={item.icon}></Icon>
                                                                                    <span className='route-name'>{item.name}</span>
                                                                                </div>
                                                                                <div className='resource'>
                                                                                    <span className='item'>
                                                                                        <Checkbox value={item.id}>浏览</Checkbox>
                                                                                    </span>
                                                                                    {
                                                                                        item.children ?
                                                                                            (
                                                                                                item.children.map((v, i) => {
                                                                                                    return <span className='item' key={i}>
                                                                                                        <Checkbox value={v.id}>{v.name}</Checkbox>
                                                                                                    </span>
                                                                                                })
                                                                                            ) : ''
                                                                                    }
                                                                                </div>
                                                                            </li>
                                                                        })
                                                                    ) : ''
                                                            }

                                                        </ul>
                                                    })) : ''
                                            }
                                        </Checkbox.Group>

                                    </div>
                                )
                            }
                        </FormItem>
                        <FormItem className="submit-button">
                            <Button type="primary" loading={this.props.showBtn} block onClick={this.handleSubmit}>提交</Button>
                        </FormItem>
                    </Form>
                </Spin>
            </div>
        )
    }
};


export default Form.create()(BulletinForm);