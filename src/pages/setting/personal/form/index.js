import React, { Component } from 'react';

import { Form, Spin, Button, Input, message, Icon, } from 'antd';


import UploadCropper from '@/components/upload/cropper';

//获取验证码
import CodeButton from '@/components/CodeButton';

import { connect } from 'react-redux';
import * as actionCreators from '@/store/all/actionCreators';

import './index.less';
import '@/assets/less/form.less';

//分装好的axios
import http from '@/api';

const FormItem = Form.Item;

class ArticleEditor extends Component {
    state = {
        loading: true,
        btnloading: false,
        avatarUrl: '',
        dataSource: {},
    }

    onRef = (ref) => {
        this.child = ref
    };

    componentDidMount() {
        this.request();
    }
    //ajax加载数据
    request = () => {//status:状态码，pages:查询页数
        let _this = this;
        http.get('/user/getUserInfo', {}).then(res => {
            console.log(res);

            _this.setState({
                loading: false,
            }, () => {
                if (res === undefined) {
                    message.error('网络问题,或服务器异常，稍后重试');
                    return;
                }

                let data = res.data.data.data;
                if (res.status === 200) {
                    _this.setState({
                        avatarUrl: data.head_img,
                        dataSource: data,
                    });
                } else {
                    message.error('账号或密码输入错误');
                }
            });
        });
    }
    //获取裁切图上传服务器后url
    getCropperImagesUrl = (url) => {
        let _this = this;
         _this.setState({
            avatarUrl: url
        },()=>{
            _this.props.form.setFieldsValue({ 'head_img': _this.state.avatarUrl })
        })
    }
    //编辑头像
    deleteAvatar = () => {
        let _this = this;
        _this.setState({
            avatarUrl: ''
        })
    }
    //修改资料
    editUserInfoSubmit = () => {
        let _this = this;
        let userInfo = this.props.form.getFieldsValue();
        
        console.log(userInfo)
        this.props.form.validateFields((err, values) => {
            console.log(err);
            if (!err) {
                _this.setState({
                    btnloading: true
                });

                let params = {
                    head_img: _this.state.avatarUrl,
                    nickname: userInfo.nickname,
                    email: userInfo.email,
                    codeNum: userInfo.codeNum,
                }
                console.log(params)

                http.post('/user/update/info', params).then(res => {
                    console.log(res);

                    _this.setState({
                        btnloading: false,
                    }, () => {
                        if (res === undefined) {
                            message.error('网络问题,或服务器异常，稍后重试');
                            return;
                        }

                        if (res.status === 200) {
                            let data = this.state.dataSource;
                            data.codeNum = '';
                            _this.setState({
                                btnloading: false,
                                dataSource: data
                            }, () => {
                                //重置表单
                                _this.props.form.resetFields();
                                message.success('修改资料成功');
                            })
                        } else {
                            message.error(res.data.msg);
                        }

                    })
                });
            }
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <div className="personal-editform">
                <Spin tip="加载中" style={{ height: 'calc(100vh - 74px)' }} spinning={this.state.loading} indicator={<Icon type="minus" spin />}>
                    <Form onSubmit={this.editUserInfoSubmit} layout="horizontal">
                        <FormItem label="头像">
                            {
                                getFieldDecorator('head_img', {
                                    initialValue: this.state.dataSource.head_img,
                                    rules: [
                                        {
                                            required: true,
                                            message: '头像不能为空'
                                        },
                                    ]
                                })(
                                    <div>
                                        {
                                            this.state.avatarUrl ?
                                                <div className='eadit-avatar'>
                                                    <div className="avatar">
                                                        <img src={this.state.avatarUrl}></img>
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
                        <FormItem label="昵称">
                            {
                                getFieldDecorator('nickname', {
                                    initialValue: this.state.dataSource.nickname,
                                    rules: [
                                        {
                                            required: true,
                                            message: '昵称不能为空'
                                        },
                                    ]
                                })(<Input allowClear prefix={<Icon type="user"></Icon>} placeholder="请输入昵称"></Input>)
                            }
                        </FormItem>
                        <FormItem label="绑定邮箱">
                            {
                                getFieldDecorator('email', {
                                    initialValue: this.state.dataSource.email,
                                    rules: [
                                        {
                                            required: true,
                                            type: 'email',
                                            message: '邮箱不能为空'
                                        },
                                    ]
                                })(<Input allowClear prefix={<Icon type="credit-card"></Icon>} placeholder="请输入邮箱"></Input>)
                            }
                        </FormItem>
                        <div className='control-flex2'>
                            <FormItem label="验证码">
                                {
                                    getFieldDecorator('codeNum', {
                                        initialValue: this.state.dataSource.codeNum,
                                        rules: [
                                            {
                                                required: true,
                                                message: '邮箱验证码'
                                            }
                                        ],
                                    })(
                                        <div className='code-box'>
                                            <Input className='code-input' placeholder="邮箱验证码"></Input>
                                            <CodeButton
                                                className='code-button'
                                                onRef={this.onRef}
                                                buttonType='email'
                                                inputVal={this.props.form.getFieldValue('email')}
                                            ></CodeButton>
                                        </div>

                                    )
                                }
                            </FormItem>
                        </div>
                        <FormItem className="submit-button">
                            <Button type="primary" loading={this.state.btnloading} block onClick={this.editUserInfoSubmit}>提交</Button>
                        </FormItem>
                    </Form>
                </Spin>
            </div>
        )
    }
};

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


export default connect(mapState, mapDispatch)(Form.create()(ArticleEditor));