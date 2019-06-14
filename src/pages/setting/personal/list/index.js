import React, { Component } from 'react';

import { Spin, Icon, message,Tag } from 'antd';

import './index.less';

//分装好的axios
import http from '@/api';

class PersonalList extends Component {
    state = {
        loading: true,
        dataSource: {},
    }

    componentDidMount() {
        this.request();
    }
    //ajax加载数据
    request = (status, pages) => {//status:状态码，pages:查询页数
        let _this = this;
        _this.setState({
            loading: true,
        });
        http.get('/user/getUserInfo', {}).then(res => {
            console.log(res);

            _this.setState({
                loading: false
            }, () => {
                if (res === undefined) {
                    message.error('网络问题,或服务器异常，稍后重试');
                    return;
                }

                if (res.status === 200) {
                    let data = res.data.data.data;
                    _this.setState({
                        dataSource: data
                    });
                } else {
                    message.error('账号或密码输入错误');
                }
            })

        });

    }

    render() {
        return (
            <div className='personnal-list'>
                <Spin tip="加载中" style={{ height: 'calc(100vh - 74px)' }} spinning={this.state.loading} indicator={<Icon type="minus" spin />}>
                    <ul className='list' style={{ display: this.state.loading ? 'none' : 'flex' }}>
                        <li className='item'>
                            <div className='label'>
                                <label>头像</label>
                            </div>
                            <div className='content'>
                                <div className='avatar'>
                                    <img src={this.state.dataSource.head_img}></img>
                                </div>
                            </div>
                        </li>
                        <li className='item'>
                            <div className='label'>
                                <label>账号</label>
                            </div>
                            <div className='content'>
                                <div className='control'>
                                    <span className='text'>{this.state.dataSource.username}</span>
                                </div>
                            </div>
                        </li>
                        <li className='item'>
                            <div className='label'>
                                <label>昵称</label>
                            </div>
                            <div className='content'>
                                <div className='control'>
                                    <span className='text'>{this.state.dataSource.nickname}</span>
                                </div>
                            </div>
                        </li>
                        <li className='item'>
                            <div className='label'>
                                <label>绑定邮箱</label>
                            </div>
                            <div className='content'>
                                <div className='control'>
                                    <span className='text'>{this.state.dataSource.email}</span>
                                </div>
                            </div>
                        </li>
                        <li className='item'>
                            <div className='label'>
                                <label>用户级别</label>
                            </div>
                            <div className='content'>
                                <div className='control'>
                                    <span className='text'>
                                        {
                                            this.state.dataSource.user_roles ?
                                                (
                                                    this.state.dataSource.user_roles.map((e, i) => {
                                                        return <Tag key={i}>{e.role_name}</Tag>
                                                    })
                                                ) : ''
                                        }
                                    </span>
                                </div>
                            </div>
                        </li>
                        <li className='item'>
                            <div className='label'>
                                <label>注册时间</label>
                            </div>
                            <div className='content'>
                                <div className='control'>
                                    <span className='text'>{this.state.dataSource.createdAt}</span>
                                </div>
                            </div>
                        </li>
                        <li className='item'>
                            <div className='label'>
                                <label>登录次数</label>
                            </div>
                            <div className='content'>
                                <div className='control'>
                                    <span className='text'>{this.state.dataSource.count} 次</span>
                                </div>
                            </div>
                        </li>
                        <li className='item'>
                            <div className='label'>
                                <label>最后登录ip</label>
                            </div>
                            <div className='content'>
                                <div className='control'>
                                    <span className='text'>{this.state.dataSource.last_login_ip}</span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </Spin>
            </div>
        )
    }
};


export default PersonalList;