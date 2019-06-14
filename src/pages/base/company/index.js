import React, { Component } from 'react';

import { Form, Button, Input, Spin, message, Icon, } from 'antd';

import UploadCropper from '@/components/upload/cropper';

import './index.less';
import '@/assets/less/form.less';

//分装好的axios
import http from '@/api';

const FormItem = Form.Item;

class Company extends Component {
    state = {
        loading: false,
        showBtn: false,

        dataSource: {},
        dataId: '',
        logo: '',
    }

    componentDidMount() {
        this.request();
    }
    //ajax加载数据
    request = () => {//status:状态码，pages:查询页数
        let _this = this;
        _this.setState({
            loading: true,
        });
        let params = {}
        http.post('/company/list', params).then(res => {
            console.log(res);
            if (res === undefined) {
                message.error('网络问题,或服务器异常，稍后重试');
                return;
            }

            if (res.status === 200) {
                _this.setState({
                    dataSource: res.data.data.list,
                    dataId: res.data.data.list.id ? res.data.data.list.id : ''
                }, () => {
                    _this.setState({
                        loading: false,
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
    }

    //获取裁切图上传服务器后url
    getCropperImagesUrl = (url,filename) => {
        console.log(url,filename)
        let _this = this;
        let data = _this.state.dataSource;
        data[filename] = url;
        console.log(data)
        _this.setState({
            dataSource: data
        }, () => {
            if(filename ==='weixinPic'){
                _this.props.form.setFieldsValue({ 'weixinPic' : _this.state.dataSource[filename] });
            }else{
                _this.props.form.setFieldsValue({ 'blicensePic' : _this.state.dataSource[filename] });
            }
        })
    }

    //删除图片
    deleteCroperImages = (filename) => {
        let _this = this;
        let data = _this.state.dataSource;
        data[filename] = '';
        _this.setState({
            dataSource: data
        });
    }

    handleSubmit = () => {
        let _this = this;
        let formInfo = _this.props.form.getFieldsValue()
        console.log(formInfo)
        this.props.form.validateFields((err, values) => {
            console.log(err)
            if (!err) {
                _this.setState({
                    showBtn: true
                });

                let params = {
                    name: formInfo.name,
                    address: formInfo.address,
                    postcode: formInfo.postcode,
                    contact: formInfo.contact,
                    mobile: formInfo.mobile,
                    phone: formInfo.phone,
                    fax: formInfo.fax,
                    email: formInfo.email,
                    qq: formInfo.qq,
                    weixin: formInfo.weixin,
                    weixinPic: formInfo.weixinPic,
                    blicense: formInfo.blicense,
                    blicensePic: formInfo.blicensePic,
                }
                console.log(params)
                let ajaxurl = '/company/create';
                if (_this.state.dataId) {
                    params.id = _this.state.dataId;
                    ajaxurl = '/conpany/update'
                }

                http.post(ajaxurl, params).then(res => {
                    console.log(res);
                    if (res === undefined) {
                        message.error('网络问题,或服务器异常，稍后重试');
                        return;
                    }

                    if (res.status === 200) {
                        _this.setState({
                            showBtn: false
                        }, () => {
                            message.success('修改公司信息成功');
                        });
                    } else {
                        _this.setState({
                            showBtn: false
                        }, () => {
                            message.error(res.data.msg);
                        });
                    }
                });
            }
        })
    }


    render() {
        const { getFieldDecorator } = this.props.form;


        return (
            <div className="site">
                <Spin tip="加载中" spinning={this.state.loading} indicator={<Icon type="minus" spin />}>
                    <Form>
                        <FormItem label="公司名称">
                            {
                                getFieldDecorator('name', {
                                    initialValue: this.state.dataSource.name,
                                    getValueFromEvent: (event) => {
                                        return event.target.value.replace(/\s+/g, "")
                                    },
                                    rules: [
                                        {
                                            required: true,
                                            message: '公司名称不能为空'
                                        },
                                    ]
                                })(<Input placeholder="请输入公司名称"></Input>)
                            }
                        </FormItem>
                        <FormItem label="公司地址">
                            {
                                getFieldDecorator('address', {
                                    initialValue: this.state.dataSource.address,
                                    getValueFromEvent: (event) => {
                                        return event.target.value.replace(/\s+/g, "")
                                    },
                                    rules: [
                                        {
                                            required: true,
                                            message: '公司地址不能为空'
                                        },
                                    ]
                                })(<Input placeholder="请输入公司地址"></Input>)
                            }
                        </FormItem>
                        <FormItem label="邮政编码">
                            {
                                getFieldDecorator('postcode', {
                                    initialValue: this.state.dataSource.postcode,
                                    getValueFromEvent: (event) => {
                                        return event.target.value.replace(/\s+/g, "")
                                    },
                                    rules: [
                                        {
                                            required: true,
                                            message: '邮政编码不能为空'
                                        },
                                    ]
                                })(<Input placeholder="请输入邮政编码"></Input>)
                            }
                        </FormItem>
                        <FormItem label="联系人">
                            {
                                getFieldDecorator('contact', {
                                    initialValue: this.state.dataSource.contact,
                                    getValueFromEvent: (event) => {
                                        return event.target.value.replace(/\s+/g, "")
                                    },
                                    rules: [
                                        {
                                            required: true,
                                            message: '联系人不能为空'
                                        },
                                    ]
                                })(<Input placeholder="请输入联系人"></Input>)
                            }
                        </FormItem>
                        <FormItem label="手机号码">
                            {
                                getFieldDecorator('mobile', {
                                    initialValue: this.state.dataSource.mobile,
                                    getValueFromEvent: (event) => {
                                        return event.target.value.replace(/\s+/g, "")
                                    },
                                    rules: [
                                        {
                                            required: true,
                                            message: '手机号码不能为空'
                                        },
                                    ]
                                })(<Input placeholder="请输入手机号码"></Input>)
                            }
                        </FormItem>
                        <FormItem label="电话号码">
                            {
                                getFieldDecorator('phone', {
                                    initialValue: this.state.dataSource.phone,
                                    getValueFromEvent: (event) => {
                                        return event.target.value.replace(/\s+/g, "")
                                    },
                                    rules: [
                                        {
                                            required: true,
                                            message: '电话号码不能为空'
                                        },
                                    ]
                                })(<Input placeholder="请输入电话号码"></Input>)
                            }
                        </FormItem>
                        <FormItem label="电子邮箱">
                            {
                                getFieldDecorator('email', {
                                    initialValue: this.state.dataSource.email,
                                    getValueFromEvent: (event) => {
                                        return event.target.value.replace(/\s+/g, "")
                                    },
                                    rules: [
                                        {
                                            required: true,
                                            message: '电子邮箱不能为空'
                                        },
                                        {
                                            required: true,
                                            type: 'email',
                                            message: '请输入邮箱'
                                        }
                                    ]
                                })(<Input placeholder="请输入电子邮箱"></Input>)
                            }
                        </FormItem>
                        <FormItem label="传真号码">
                            {
                                getFieldDecorator('fax', {
                                    initialValue: this.state.dataSource.fax,
                                    getValueFromEvent: (event) => {
                                        return event.target.value.replace(/\s+/g, "")
                                    },
                                    rules: []
                                })(<Input placeholder="请输入传真号码"></Input>)
                            }
                        </FormItem>
                        
                        <FormItem label="QQ号码">
                            {
                                getFieldDecorator('qq', {
                                    initialValue: this.state.dataSource.qq,
                                    getValueFromEvent: (event) => {
                                        return event.target.value.replace(/\s+/g, "")
                                    },
                                    rules: []
                                })(<Input placeholder="请输入QQ号码"></Input>)
                            }
                        </FormItem>
                        
                        <FormItem className="middle-flex-start" label="微信二维码">
                            {
                                getFieldDecorator('weixinPic', {
                                    initialValue: this.state.dataSource.weixinPic,
                                    rules: []
                                })(<div className='pics-list'>
                                    <div className='content'>
                                        {

                                            this.state.dataSource.weixinPic ?
                                                <div className='avatar'>
                                                    <img src={this.state.dataSource.weixinPic}></img>
                                                    <Icon className='delete' type="close-circle" onClick={() => { this.deleteCroperImages('weixinPic') }} />
                                                </div> : <UploadCropper
                                                    filename={'weixinPic'}
                                                    UploadVisible={true}
                                                    aspectRatio={1 / 1}
                                                    getCropperImagesUrl={this.getCropperImagesUrl}
                                                ></UploadCropper>
                                        }
                                    </div>
                                </div>)
                            }
                        </FormItem>
                        <FormItem label="微信账号">
                            {
                                getFieldDecorator('wexin', {
                                    initialValue: this.state.dataSource.wexin,
                                    getValueFromEvent: (event) => {
                                        return event.target.value.replace(/\s+/g, "")
                                    },
                                    rules: []
                                })(<Input placeholder="请输入微信号码"></Input>)
                            }
                        </FormItem>


                        <FormItem className="middle-flex-start" label="营业执照">
                            {
                                getFieldDecorator('blicensePic', {
                                    initialValue: this.state.dataSource.blicensePic,
                                    rules: []
                                })(<div className='pics-list'>
                                    <div className='content'>
                                        {

                                            this.state.dataSource.blicensePic ?
                                                <div className='avatar'>
                                                    <img src={this.state.dataSource.blicensePic}></img>
                                                    <Icon className='delete' type="close-circle" onClick={() => { this.deleteCroperImages('blicensePic') }} />
                                                </div> : <UploadCropper
                                                    filename={'blicensePic'}
                                                    UploadVisible={true}
                                                    aspectRatio={1 / 1}
                                                    getCropperImagesUrl={this.getCropperImagesUrl}
                                                ></UploadCropper>
                                        }
                                    </div>
                                </div>)
                            }
                        </FormItem>

                        <FormItem label="执照编码">
                            {
                                getFieldDecorator('blicense', {
                                    initialValue: this.state.dataSource.blicense,
                                    getValueFromEvent: (event) => {
                                        return event.target.value.replace(/\s+/g, "")
                                    },
                                    rules: []
                                })(<Input placeholder="请输入营业执照编码"></Input>)
                            }
                        </FormItem>


                        <FormItem className="submit-button">
                            <Button type="primary" loading={this.state.showBtn} block onClick={this.handleSubmit}>提交</Button>
                        </FormItem>
                    </Form>
                </Spin>
            </div>
        )
    }
};


export default Form.create()(Company);