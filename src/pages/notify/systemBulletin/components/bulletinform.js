import React, { Component } from 'react';

import { Form, Button, Input, Spin, message, Icon, DatePicker, Select } from 'antd'
import moment from 'moment';
import 'moment/locale/zh-cn';

import BraftEditor from '@/components/braftEditor/index2.js';

import './index.less';
import '@/assets/less/form.less';

const FormItem = Form.Item;

const { Option } = Select;

const { TextArea } = Input;

const { RangePicker } = DatePicker;

moment.locale('zh-cn')

class BulletinForm extends Component {
    state = {
        loading: false,
    }

    onRef = (ref) => {
        this.child = ref
    }

    handleSubmit = () => {
        let _this = this;
        //获取富文本内容
        let contentText = _this.child.submitContent();
        //获取输入框内容
        let articleInfo = _this.props.form.getFieldsValue()
        //起始时间
        let startTime = '';
        //结束时间
        let endTime = '';

        _this.props.form.validateFields((err, values) => {
            console.log(err)
            if (!err) {

                articleInfo.date.map((item, index) => {
                    if (index === 0) {
                        startTime = moment(item).valueOf();
                    } else {
                        endTime = moment(item).valueOf();
                    }
                })


                let params = {
                    gid: articleInfo.gid,//栏目编号**
                    title: articleInfo.title,//标题**
                    subtitle: articleInfo.subtitle,//副标题**
                    startTime: startTime,
                    endTime: endTime,
                    content: contentText,//详情
                    tags: articleInfo.tags,//关键字
                    description: articleInfo.description,//描述
                    keywords: articleInfo.keywords,//关键词
                }
                console.log(params)

                _this.props.buttonSubmit(params);
            }
        })
    }


    render() {
        const { getFieldDecorator } = this.props.form;

        const range=(start, end)=> {
            const result = [];
            for (let i = start; i < end; i++) {
                result.push(i);
            }
            return result;
        }

        const disabledDate=(current)=> {
            // Can not select days before today and today
            return current && current < moment().endOf('day');
        }

        const disabledRangeTime=(_, type)=> {
            if (type === 'start') {
                return {
                    disabledHours: () => range(0, 60).splice(4, 20),
                    disabledMinutes: () => range(30, 60),
                    disabledSeconds: () => [55, 56],
                };
            }
            return {
                disabledHours: () => range(0, 60).splice(20, 4),
                disabledMinutes: () => range(0, 31),
                disabledSeconds: () => [55, 56],
            };
        }


        //获取有效期限
        const defaultSelectDate = {
            startDate: this.props.formData.startTime ? moment(parseInt(this.props.formData.startTime)) : null,
            endDate: this.props.formData.endTime ? moment(parseInt(this.props.formData.endTime)) : null
        }

        return (
            <div className="article">
                <Form>
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
                                        message: '标题不能为空'
                                    },
                                ]
                            })(<Input placeholder="请输入标题"></Input>)
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
                                        message: '副标题不能为空'
                                    },
                                ]
                            })(<Input placeholder="请输入副标题"></Input>)
                        }
                    </FormItem>

                    <FormItem label="所属分组">
                        {
                            getFieldDecorator('gid', {
                                initialValue: this.props.formData.gid,
                                rules: [
                                    {
                                        required: true,
                                        message: '标题不能为空'
                                    },
                                ]
                            })(<Select placeholder="请选择所属分组">
                                <Option value="0">整站</Option>
                                <Option value="1">其他</Option>
                            </Select>)
                        }
                    </FormItem>

                    <FormItem label="有效期限">
                        {
                            getFieldDecorator('date', {
                                initialValue: [defaultSelectDate.startDate, defaultSelectDate.endDate],
                                rules: [{
                                    required: true,
                                    message: '请输入有效时间'
                                }]
                            })(<RangePicker
                                style={{ width: '100%' }}
                                disabledDate={disabledDate}
                                disabledTime={disabledRangeTime}
                                showTime={{
                                    hideDisabledOptions: true,
                                    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                                }}
                                format="YYYY-MM-DD HH:mm:ss"
                                placeholder={['起始时间', '结束时间']}
                            />)
                        }
                    </FormItem>

                    <FormItem label="tags">
                        {
                            getFieldDecorator('tags', {
                                initialValue: this.props.formData.tags,
                                getValueFromEvent: (event) => {
                                    return event.target.value.replace(/\s+/g, "")
                                },
                                rules: []
                            })(<TextArea rows={4} placeholder="请输入文章的tag，英文逗号隔开"></TextArea>)
                        }
                    </FormItem>

                    <FormItem label="SEO关键字">
                        {
                            getFieldDecorator('keywords', {
                                initialValue: this.props.formData.keywords,
                                getValueFromEvent: (event) => {
                                    return event.target.value.replace(/\s+/g, "")
                                },
                                rules: []
                            })(<Input placeholder="输入内容页的SEO关键字"></Input>)
                        }
                    </FormItem>

                    <FormItem label="SEO描述">
                        {
                            getFieldDecorator('description', {
                                initialValue: this.props.formData.description,
                                getValueFromEvent: (event) => {
                                    return event.target.value.replace(/\s+/g, "")
                                },
                                rules: []
                            })(<TextArea rows={4} placeholder="请输入内容页SEO描述"></TextArea>)
                        }
                    </FormItem>


                    <FormItem className="middle-flex-start form-editor" label="公告详情">
                        {
                            getFieldDecorator('content', {
                                initialValue: '公告详情描',
                                rules: []
                            })(<BraftEditor
                                onRef={this.onRef}
                                htmlContent={this.props.formData.content}></BraftEditor>)
                        }
                    </FormItem>

                    <FormItem className="submit-button">
                        <Button type="primary" loading={this.props.showBtn} block onClick={this.handleSubmit}>提交</Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
};


export default Form.create()(BulletinForm);