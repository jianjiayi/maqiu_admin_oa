
import React, { Component } from 'react'
import { Form, Button, Input, Select, message } from 'antd';

import UploadImages from '@/components/upload/images';

const FormItem = Form.Item;

const { Option } = Select;

class SortForm extends Component {
    state = {
        loading: false,
        showBtn: false,
        pic: '',
        fileList:[],
    }
    componentDidMount() {
        this.setState({
            pic: this.props.formData.pic,
            fileList: this.props.fileList,
        },()=>{
            console.log(this.state.fileList)
        })
        
    }

    //传递的组件参数改变是调用
    componentWillReceiveProps(nextProps) {
        if (this.props.formData !== nextProps.formData) {
            let pic = nextProps.formData.pic;
            this.setState({
                pic: pic,
                fileList: nextProps.fileList,
            })
        }
    }

    //获取裁切图上传服务器后url
    getUploadImages = (filelist) => {
        let _this = this;
        filelist.map((item) => {
            if (item.response !== undefined) {
                console.log(item.response.data.imgUrl)
                let url = item.response.data.imgUrl;
                _this.setState({
                    pic: url
                }, () => {
                    _this.props.form.setFieldsValue({ 'pic': _this.state.pic });
                })
            }
        })
    }
    //编辑
    deleteAvatar = () => {
        let _this = this;
        _this.setState({
            pic: ''
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
                    title: userInfo.title,
                    gid: userInfo.gid,
                    pic: _this.state.pic,
                    link: userInfo.link,
                    subtitle: userInfo.subtitle
                }
                console.log(params)

                this.props.formDataSubmit(params);

                _this.setState({
                    pic: ''
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
                    <FormItem label="标题">
                        {
                            getFieldDecorator('title', {
                                initialValue: this.props.formData.title,
                                getValueFromEvent: (event) => {
                                    return event.target.value.replace(/\s+/g, "")
                                },
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入标题'
                                    }
                                ]
                            })(
                                <Input allowClear placeholder="请输入标题"></Input>
                            )
                        }
                    </FormItem>
                    <FormItem label="副标题">
                        {
                            getFieldDecorator('subtitle', {
                                initialValue: this.props.formData.subtitle,
                                getValueFromEvent: (event) => {
                                    return event.target.value.replace(/\s+/g, "")
                                },
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入副标题'
                                    }
                                ]
                            })(
                                <Input allowClear placeholder="请输入副标题"></Input>
                            )
                        }
                    </FormItem>
                    <FormItem label="所属分组">
                        {
                            getFieldDecorator('gid', {
                                initialValue: this.props.formData.gid,
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择所属分组'
                                    }
                                ],
                            })(
                                <Select placeholder="请选择所属分组">
                                    <Option value="0">整站</Option>
                                    <Option value="1">其他</Option>
                                </Select>,
                            )
                        }
                    </FormItem>

                    <FormItem label="图片">
                        {
                            getFieldDecorator('pic', {
                                initialValue: this.state.pic,
                                rules: [
                                    {
                                        required: true,
                                        message: '请添加图片'
                                    }
                                ],
                            })(
                                <UploadImages
                                    fileList={this.state.fileList}
                                    numbers={1}
                                    uploadImages={this.getUploadImages}
                                ></UploadImages>
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
                                        message: '请输入跳转链接地址'
                                    }
                                ],
                            })(
                                <Input addonBefore="Http://" allowClear placeholder="请输入跳转链接链接"></Input>
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
