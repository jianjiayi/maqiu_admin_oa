import React, { Component } from 'react';

import { Button, message } from 'antd';

import './index.less';

//分装好的axios
import http from '@/api';

class CodeButton extends Component {
    state = {
        count: 60,
        disabled: false,
        liked: true,
    }
    componentDidMount() {
        this.props.onRef(this)
    }
    componentWillUnmount(){
        clearTimeout(this.countDown);
        this.setState = (state,callback)=>{
            return;
        }
    }
    //倒计时
    countDown() {
        const { count } = this.state;
        if (count === '01') {
            this.setState({
                count: 60,
                disabled: false,
            });
        } else {
            this.setState({
                count: (count - 1) < 10 ? '0' + (count - 1) : count - 1,
                disabled: true,
            });
            setTimeout(this.countDown.bind(this), 1000);
        }
    }
    //点击按钮
    handleClick = () => {
        const { inputVal, buttonType } = this.props;
        const { disabled } = this.state;
        if (inputVal) {
            if (disabled) {
                return;
            }
            this.countDown();
            switch (buttonType) {
                case 'email':
                    //邮箱发送验证码
                    this.sendEmailCode(inputVal);
                    return;
                case 'phone':
                    this.senPhoneCode(inputVal);
                    return;
            }
        } else {
            switch (buttonType) {
                case 'email':
                    message.error('请输入邮箱');
                    return;
                case 'phone':
                    message.error('请输入手机号');
                    return;
            }
        }
    };

    //邮箱发送验证码
    sendEmailCode = (inputVal) => {
        let params = {
            toMail: inputVal
        }
        http.post('/sendMail/code', params).then(res => {
            console.log(res);
            if (res.status === 200) {
                message.success('验证码已发送，注意查收');
            } else {
                this.setState({
                    disabled: false
                })
                message.error('验证码发送失败');
            }
        });
    }
    //手机号发送验证码
    senPhoneCode = () => {

    }

    render() {
        return (
            <Button
                className='CodeButton'
                disabled={this.state.disabled}
                onClick={() => this.handleClick()}>
                {
                    !this.state.disabled
                        ? '获取验证码'
                        : `${this.state.count} 秒后重发`
                }
            </Button>
        )
    }
};


export default CodeButton;