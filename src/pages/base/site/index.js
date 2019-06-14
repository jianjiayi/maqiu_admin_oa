import React, { Component } from 'react';

import { Form, Button, Input, Spin, message, Icon, } from 'antd';

import UploadCropper from '@/components/upload/cropper';

import './index.less';
import '@/assets/less/form.less';

//分装好的axios
import http from '@/api';

const FormItem = Form.Item;
const { TextArea } = Input;

class Site extends Component {
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
        http.post('/site/list', params).then(res => {
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
    getCropperImagesUrl = (url) => {
        let _this = this;
        let data = _this.state.dataSource;
        data.logo = url;
        _this.setState({
           dataSource:data
        }, () => {
            _this.props.form.setFieldsValue({ 'logo': _this.state.dataSource.logo });
        })
    }

    //删除图片
    deleteCroperImages = () => {
        let _this = this;
        let data = _this.state.dataSource;
        data.logo = '';
        _this.setState({
            dataSource:data
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
                    title: formInfo.title,
                    subtitle: formInfo.subtitle,
                    domain: formInfo.domain,
                    logo: formInfo.logo,
                    keywords: formInfo.keywords,
                    description: formInfo.description,
                    icp: formInfo.icp,
                    statistical: formInfo.statistical,
                    copyright: formInfo.copyright,
                }
                console.log(params)
                let ajaxurl = '/site/create';
                if (_this.state.dataId) {
                    params.id = _this.state.dataId;
                    ajaxurl = '/site/update'
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
                            message.success('修改站点信息成功');
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
                        <FormItem label="站点标题">
                            {
                                getFieldDecorator('title', {
                                    initialValue: this.state.dataSource.title,
                                    getValueFromEvent: (event) => {
                                        return event.target.value.replace(/\s+/g, "")
                                    },
                                    rules: [
                                        {
                                            required: true,
                                            message: '站点标题不能为空'
                                        },
                                    ]
                                })(<Input placeholder="请输入标题"></Input>)
                            }
                        </FormItem>
                        <FormItem label="站点副标题">
                            {
                                getFieldDecorator('subtitle', {
                                    initialValue: this.state.dataSource.subtitle,
                                    getValueFromEvent: (event) => {
                                        return event.target.value.replace(/\s+/g, "")
                                    },
                                    rules: [
                                        {
                                            required: true,
                                            message: '站点副标题不能为空'
                                        },
                                    ]
                                })(<Input placeholder="请输入副标题"></Input>)
                            }
                        </FormItem>

                        <FormItem label="站点域名">
                            {
                                getFieldDecorator('domain', {
                                    initialValue: this.state.dataSource.domain,
                                    getValueFromEvent: (event) => {
                                        return event.target.value.replace(/\s+/g, "")
                                    },
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入站点域名'
                                        }
                                    ],
                                })(
                                    <Input addonBefore="Http://" allowClear placeholder="请输入站点域名"></Input>
                                )
                            }
                        </FormItem>
                        <FormItem className="middle-flex-start" label="站点LOGO">
                            {
                                getFieldDecorator('logo', {
                                    initialValue: this.state.dataSource.logo,
                                    rules: [
                                        {
                                            required: true,
                                            message: '站点LOGO不能为空'
                                        },
                                    ]
                                })(<div className='pics-list'>
                                    <div className='content'>
                                        {

                                            this.state.dataSource.logo ?
                                                <div className='avatar'>
                                                    <img src={this.state.dataSource.logo}></img>
                                                    <Icon className='delete' type="close-circle" onClick={() => { this.deleteCroperImages() }} />
                                                </div> : <UploadCropper
                                                    filename={'logo'}
                                                    UploadVisible={true}
                                                    aspectRatio={16 / 9}
                                                    getCropperImagesUrl={this.getCropperImagesUrl}
                                                ></UploadCropper>
                                        }
                                    </div>
                                </div>)
                            }
                        </FormItem>

                        <FormItem label="站点备案">
                            {
                                getFieldDecorator('icp', {
                                    initialValue: this.state.dataSource.icp,
                                    getValueFromEvent: (event) => {
                                        return event.target.value.replace(/\s+/g, "")
                                    },
                                    rules: [
                                        {
                                            required: true,
                                            message: '站点备案不能为空'
                                        },
                                    ]
                                })(<Input placeholder="输入站点备案"></Input>)
                            }
                        </FormItem>

                        <FormItem label="站点关键字">
                            {
                                getFieldDecorator('keywords', {
                                    initialValue: this.state.dataSource.keywords,
                                    getValueFromEvent: (event) => {
                                        return event.target.value.replace(/\s+/g, "")
                                    },
                                    rules: [
                                        {
                                            required: true,
                                            message: '站点关键字不能为空'
                                        },
                                    ]
                                })(<Input placeholder="输入站点关键字"></Input>)
                            }
                        </FormItem>

                        <FormItem label="站点描述">
                            {
                                getFieldDecorator('description', {
                                    initialValue: this.state.dataSource.description,
                                    getValueFromEvent: (event) => {
                                        return event.target.value.replace(/\s+/g, "")
                                    },
                                    rules: [
                                        {
                                            required: true,
                                            message: '站点描述不能为空'
                                        },
                                    ]
                                })(<TextArea rows={4} placeholder="请输入站点描述"></TextArea>)
                            }
                        </FormItem>

                        <FormItem label="尾部信息">
                            {
                                getFieldDecorator('copyright', {
                                    initialValue: this.state.dataSource.copyright,
                                    rules: [
                                        {
                                            required: true,
                                            message: '尾部信息不能为空'
                                        },
                                    ]
                                })(<TextArea rows={4} placeholder="请输入尾部信息"></TextArea>)
                            }
                        </FormItem>

                        <FormItem label="统计代码">
                            {
                                getFieldDecorator('statistical', {
                                    initialValue: this.state.dataSource.statistical,
                                    rules: []
                                })(<TextArea rows={4} placeholder="请输入统计代码"></TextArea>)
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


export default Form.create()(Site);