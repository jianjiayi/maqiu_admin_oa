
import React, { Component } from 'react'
import { Form, Button, Input, message, Icon, Radio, InputNumber, Select, Switch, DatePicker, TimePicker, Upload, Checkbox } from 'antd'
import moment from 'moment';

import './index.less';
import '@/assets/less/form.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const TextArea = Input.TextArea;

class ColumnForm extends Component {
    state = {
        userImg: ''
    }
    getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }
    beforeUpload = (file) => {
        const isJPG = file.type === 'image/jpeg';
        if (!isJPG) {
        message.error('You can only upload JPG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
        }
        return isJPG && isLt2M;
    }
    handleChange = (info) => {
        if (info.file.status === 'uploading') {
        this.setState({ loading: true });
        return;
        }
        if (info.file.status === 'done') {
        // Get this url from response in real world.
        this.getBase64(info.file.originFileObj, imageUrl => this.setState({
            userImg: imageUrl,
            loading: false,
        }));
        }
    }
    handleSubmit = () => {
        let userInfo = this.props.form.getFieldsValue()
        console.log(JSON.stringify(userInfo))
        message.success('注册成功！')
    }
    render() {
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            labelCol: {
                xs: { span: 8 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 16 },
                sm: { span: 16 },
            },
        }
        const offsetLayout = {
        wrapperCol: {
            xs: 24,
        }
        }
        return (
        <div>
            <Form>
                <FormItem label="用户名">
                {
                    getFieldDecorator('userName', {
                    initialValue: '',
                    rules: [
                        {
                        required: true,
                        message: '用户名不能为空'
                        },
                        {
                        pattern: new RegExp('^\\w+$', 'g'),
                        message: '用户名必须为字母或数字'
                        }
                    ]
                    })(<Input prefix={<Icon type="user"></Icon>} placeholder="请输入用户名"></Input>)
                }
                </FormItem>
                <FormItem label="密码">
                {
                    getFieldDecorator('userPwd', {
                    initialValue: '',
                    rules: [
                        {
                        required: true,
                        message: '密码不能为空'
                        },
                    ]
                    })(<Input type="password" prefix={<Icon type="lock"></Icon>} placeholder="请输入密码"></Input>)
                }
                </FormItem>
                <FormItem label="性别">
                {
                    getFieldDecorator('sex', {
                    initialValue: '1',
                    rules: []
                    })(<RadioGroup>
                    <Radio value="1">男</Radio>
                    <Radio value="2">女</Radio>
                    </RadioGroup>)
                }
                </FormItem>
                <FormItem label="年龄">
                {
                    getFieldDecorator('age', {
                    initialValue: '18',
                    rules: []
                    })(<InputNumber></InputNumber>)
                }
                </FormItem>
                <FormItem label="当前状态">
                {
                    getFieldDecorator('state', {
                    initialValue: '1',
                    rules: []
                    })(<Select>
                    <Option value="1">咸鱼一条</Option>
                    <Option value="2">咸鱼二条</Option>
                    <Option value="3">咸鱼三条</Option>
                    </Select>)
                }
                </FormItem>
                <FormItem label="标签">
                {
                    getFieldDecorator('state', {
                    initialValue: [],
                    rules: []
                    })(<Select mode="multiple" placeholder="运动">
                    <Option value="1">爬山</Option>
                    <Option value="2">慢跑</Option>
                    <Option value="3">打球</Option>
                    <Option value="4">泳游</Option>
                    </Select>)
                }
                </FormItem>
                <FormItem label="是否已婚">
                {
                    getFieldDecorator('isMarried', {
                    valuePropName: 'checked',
                    initialValue: true,
                    rules: []
                    })(<Switch></Switch>)
                }
                </FormItem>
                <FormItem label="生日">
                {
                    getFieldDecorator('birthday', {
                    initialValue: moment('1992-08-18'),
                    rules: []
                    })(<DatePicker showTime format="YYYY-MM-DD"></DatePicker>)
                }
                </FormItem>
                <FormItem className="middle-flex-start" label="联系地址">
                {
                    getFieldDecorator('address', {
                    initialValue: '家庭住址',
                    rules: []
                    })(<TextArea autosize={{ minRows: 4, maxRows: 6 }}></TextArea>)
                }
                </FormItem>
                <FormItem label="上班时间">
                {
                    getFieldDecorator('time')(<TimePicker></TimePicker>)
                }
                </FormItem>
                <FormItem className="middle-flex-start" label="头像">
                {
                    getFieldDecorator('userImg')(
                    <Upload
                        listType="picture-card"
                        showUploadList={false}
                        action="//jsonplaceholder.typicode.com/posts/"
                        beforeUpload={this.beforeUpload}
                        onChange={this.handleChange}
                    >
                        {
                        this.state.userImg ? <img src={this.state.userImg} alt="" /> : <Icon type="plus"></Icon>
                        }
                    </Upload>
                    )
                }
                </FormItem>
                <FormItem className="submit-button">
                <Button type="primary" block onClick={this.handleSubmit}>提交</Button>
                </FormItem>
            </Form>
        </div>
        )
    }
}

export default Form.create()(ColumnForm)
