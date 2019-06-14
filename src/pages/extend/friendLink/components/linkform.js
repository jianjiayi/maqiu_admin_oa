
import React, { Component } from 'react'
import { Form, Button, Input, Select, message } from 'antd';

import UploadCropper from '@/components/upload/cropper';

const FormItem = Form.Item;

const { Option } = Select;

class SortForm extends Component {
    state = {
        loading: false,
        showBtn: false,


        logo: '',
    }
    componentDidMount() {
        this.setState({
            logo: this.props.formData.logo
        })
    }

    //传递的组件参数改变是调用
    componentWillReceiveProps(nextProps) {
        if (this.props.formData !== nextProps.formData) {
            let logo = nextProps.formData.logo;
            this.setState({
                logo: logo
            })
        }
    }

    //获取裁切图上传服务器后url
    getCropperImagesUrl = (url) => {
        console.log(url)
        let _this = this;
        _this.setState({
            logo: url
        }, () => {
            _this.props.form.setFieldsValue({ 'logo': _this.state.logo });
        })

        console.log(this.state.logo)
    }
    //编辑头像
    deleteAvatar = () => {
        let _this = this;
        _this.setState({
            logo: ''
        })
    }


    //添加分类
    addLinkSubmit = (e) => {
        let _this = this;
        let userInfo = this.props.form.getFieldsValue();
        console.log(userInfo)
        this.props.form.validateFields((err, values) => {
            console.log(err)
            if (!err) {
                _this.setState({
                    showBtn: true
                });

                let params = {
                    name: userInfo.name,
                    gid: userInfo.gid,
                    logo: _this.state.logo,
                    link: userInfo.link
                }
                console.log(params)

                this.props.formDataSubmit(params);

                _this.setState({
                    logo: ''
                });
                _this.props.form.resetFields();
            }
        })
    }




    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <div className='article-sort-addform' >
                <Form onSubmit={this.addSortSubmit} layout="horizontal">
                    <FormItem label="链接名称">
                        {
                            getFieldDecorator('name', {
                                initialValue: this.props.formData.name,
                                getValueFromEvent: (event) => {
                                    return event.target.value.replace(/\s+/g, "")
                                },
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入链接名称'
                                    }
                                ]
                            })(
                                <Input allowClear placeholder="请输入链接名称"></Input>
                            )
                        }
                    </FormItem>
                    <FormItem label="所属区域">
                        {
                            getFieldDecorator('gid', {
                                initialValue: this.props.formData.gid,
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择所属区域'
                                    }
                                ],
                            })(
                                <Select placeholder="请选择所属区域">
                                    <Option value="0">整站</Option>
                                    <Option value="1">其他</Option>
                                </Select>,
                            )
                        }
                    </FormItem>

                    <FormItem label="链接图标">
                        {
                            getFieldDecorator('logo', {
                                initialValue: this.state.logo,
                                rules: [
                                    {
                                        required: true,
                                        message: '请添加链接图片'
                                    }
                                ],
                            })(
                                <div>
                                    {
                                        this.state.logo ?
                                            <div className='eadit-avatar'>
                                                <div className="avatar">
                                                    <img src={this.state.logo}></img>
                                                </div>
                                                <Button
                                                    className='delete'
                                                    size='small'
                                                    type='primary'
                                                    icon="edit"
                                                    onClick={() => { this.deleteAvatar() }}
                                                ></Button>
                                            </div>
                                            :
                                            <UploadCropper
                                                UploadVisible={true}
                                                aspectRatio={1 / 1}
                                                getCropperImagesUrl={this.getCropperImagesUrl}
                                            ></UploadCropper>
                                    }
                                </div>

                            )
                        }
                    </FormItem>

                    <FormItem label="链接地址">
                        {
                            getFieldDecorator('link', {
                                initialValue: this.props.formData.link,
                                getValueFromEvent: (event) => {
                                    return event.target.value.replace(/\s+/g, "")
                                },
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入链接地址'
                                    }
                                ],
                            })(
                                <Input addonBefore="Http://" allowClear placeholder="请输入链接链接"></Input>
                            )
                        }
                    </FormItem>

                    <FormItem className="submit-button">
                        <Button type="primary" loading={this.props.btnLodding} onClick={this.addLinkSubmit} block>提交</Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
}

export default Form.create()(SortForm)
