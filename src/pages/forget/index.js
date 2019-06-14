import React, { Component } from 'react';

import { Layout, } from 'antd';

import CheckUser from './CheckUser';
import UpdatePwssword from './UpdatePawd';

import './index.less';

const { Header,} = Layout;

class Forget extends Component {

    state={
        username:'',
        msg:'',
        isCheckUser:false,//判断是否存在该用户
    }

    //打开修改密码
    goUpdatePawd = (username,msg)=>{
        console.log('username'+username)
        this.setState({
            username:username,
            msg:msg,
            isCheckUser:true,
        })
    }
    
    render() {
        return (
            <div>
                <Header className="header">
                    <div className="logo" />
                </Header>

                {
                    !this.state.isCheckUser ? 
                    <CheckUser goUpdatePawd = {this.goUpdatePawd}></CheckUser> : 
                    <UpdatePwssword username={this.state.username} msg={this.state.msg}></UpdatePwssword>
                }
            </div>
        )
    }
}

export default Forget;




