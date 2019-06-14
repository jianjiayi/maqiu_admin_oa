import React, { Component } from 'react';

import { Spin, Icon, Switch, Button, Modal, Tag, message } from 'antd';

import MqPagination from '@/components/pagination';

import Empty from '@/components/empty';

import './index.less';

//分装好的axios
import http from '@/api';

class AdminList extends Component {
    state = {
        loading: true,

        detailModel: false,
        modelData: {},

        dataSource: [],//返回数据

        // 分页数据
        total: 10,//总页数
        pageSize: 10,//每页条数
        current: 1,//当前页码

    }

    componentDidMount() {
        this.request();
    }
    //ajax加载数据
    request = () => {//status:状态码，pages:查询页数
        let _this = this;
        let params = {
            page: _this.state.current
        }
        _this.setState({
            loading: true,
        },()=>{
            http.post('/user/admin/getUserList', params).then(res => {
                console.log(res);
                if (res === undefined) {
                    message.error('网络问题,或服务器异常，稍后重试');
                    return;
                }
    
                if (res.status === 200) {
                    let list = res.data.data.list;
                    _this.setState({
                        dataSource: list.data,
                        total: list.meta.total_pages * 10,
                    },()=>{
                        _this.setState({
                            loading: false
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
        });
    }

    //删除函数
    handleDeleteBtn = (id) => {
        console.log(id);
        let _this = this;
        Modal.confirm({
            title: '删除提示',
            centered: true,
            content: `您确定要删除吗？`,
            onOk: () => {
                //执行删除、更新视图操作
                let data = _this.state.dataSource;
                data.splice(data.findIndex(item => item.id === id), 1)
                _this.setState({
                    dataSource: data
                }, () => {
                    message.success('删除成功')
                });
            }
        })
    }

    //修改用户状态失败
    changeAdminStatus = (id, status) => {
        console.log(id, status);
        let _this = this;
        let params = {
            id: id,
            status: status == 1 ? '0' : '1'
        }
        http.post('/user/admin/updateUserStatus', params).then(res => {
            console.log(res);
            if(res === undefined){
                message.error('网络问题,或服务器异常，稍后重试');
                return;
            }
            
            if (res.status === 200) {
                _this.request();
                message.success('修改用户状态成功');
            } else {
                message.error('修改用户状态失败');
            }
        });
    }

    //重置密码
    resetPassword = (username) => {
        let _this = this;
        let params = {
            username: username,
        }
        http.post('/user/admin/helpUpdatePassword', params).then(res => {
            console.log(res);
            if(res === undefined){
                message.error('网络问题,或服务器异常，稍后重试');
                return;
            }

            if (res.status === 200) {
                Modal.info({
                    title: '提示',
                    content: (
                        <div>
                            <p>该用户密码已重置成功</p>
                            <p>请提示该用户到'{res.data.data.email}'邮箱查看密码</p>
                        </div>
                    ),
                    onOk() { },
                });
            } else {
                message.error('重置密码失败');
            }
        });

    }

    //查看用户详情
    lookDetailInfo = (data) => {
        let _this = this;
        _this.setState({
            detailModel: true,
            modelData: data
        })
    }
    //关闭模态框
    closeDetailModel = () => {
        this.setState({
            detailModel: false,
            modelData: {}
        })
    }

    // 分页函数
    changePaging = (val) => {
        console.log(val);
        let _this = this;
        _this.setState({
            current: val
        }, () => {
            _this.request();
        });
    }

    render() {
        return (
            <div className='admin-list'>
                <Spin tip="加载中" spinning={this.state.loading} indicator={<Icon type="minus" spin />}>
                    <div className='pc-table'>
                        <div className='columns'>
                            <span className='title'>id</span>
                            <span className='title'>账号</span>
                            <span className='title'>邮箱</span>
                            <span className='title'>级别</span>
                            <span className='title'>注册时间</span>
                            <span className='title'>状态</span>
                            <span className='title'>操作</span>
                        </div>
                        <ul className='dataSource'>
                            {
                                this.state.dataSource.map((item, index) => {
                                    return <li className='item' key={index}>
                                        <span className='data'>{item.id}</span>
                                        <span className='data'>{item.username}</span>
                                        <span className='data'>{item.email}</span>
                                        <span className='data'>
                                            {
                                                item.user_roles ? 
                                                (
                                                    item.user_roles.map((e,i)=>{
                                                        return <Tag key={i}>{e.role_name}</Tag>
                                                   }) 
                                                ) : ''
                                            }
                                        </span>
                                        <span className='data'>{item.createdAt}</span>
                                        <span className='data'>
                                            <Switch
                                                checkedChildren={'开'}
                                                unCheckedChildren={'关'}
                                                defaultChecked={item.status === '1' ? true : false}
                                                onClick={() => this.changeAdminStatus(item.id, item.status)}
                                            />
                                        </span>
                                        <span className='data'>
                                            <Button size='small' type='primary' onClick={() => this.lookDetailInfo(item)}>查看</Button>
                                            <Button size='small' onClick={() => this.resetPassword(item.username)}>重置密码</Button>
                                        </span>
                                    </li>
                                })
                            }
                        </ul>
                    </div>
                    <div className='h5-table'>
                        {
                            this.state.dataSource.map((item, index) => {
                                return <ul className='table-cart' key={index}>
                                    <li className='item'>
                                        <div className='colums' style={{ flex: 1 }}>
                                            <span className='title'>ID编号 : </span>
                                            <span className='data'>{item.id}</span>
                                        </div>

                                        <div className='colums' style={{ flex: 2 }}>
                                            <span className='title'>级别 : </span>
                                            <span className='data'>
                                            {
                                                item.user_roles ? 
                                                (
                                                    item.user_roles.map((e,i)=>{
                                                        return <Tag key={i}>{e.role_name}</Tag>
                                                   }) 
                                                ) : ''
                                            }
                                            </span>
                                        </div>

                                        <div className='colums status'>
                                            <span className='data'>
                                                <Switch
                                                    checkedChildren={'开'}
                                                    unCheckedChildren={'关'}
                                                    defaultChecked={item.status === '1' ? true : false}
                                                    onClick={() => this.changeAdminStatus(item.id, item.status)}
                                                />
                                            </span>
                                        </div>
                                    </li>
                                    <li className='item'>
                                        <div className='colums' style={{ flex: 1 }}>
                                            <span className='title'>账号 : </span>
                                            <span className='data'>{item.username}</span>
                                        </div>

                                    </li>
                                    <li className='item'>
                                        <span className='title'>注册时间 : </span>
                                        <span className='data'>{item.createdAt}</span>
                                    </li>
                                    <li className='item'>
                                        <span className='title'>操作</span>
                                        <span className='data action'>
                                            <Button size='small' type='primary' onClick={() => this.lookDetailInfo(item)}>查看</Button>
                                            <Button size='small' onClick={() => this.resetPassword(item.username)}>重置密码</Button>
                                        </span>
                                    </li>
                                </ul>
                            })
                        }

                    </div>
                    {/* 空页面 */}
                    <Empty styleDisplay={this.state.dataSource.length <= 0 ? 'block' : 'none'}></Empty>
                    {/* 分页 */}
                    <MqPagination
                        total={this.state.total}
                        pageSize={this.state.pageSize}
                        changePaging={this.changePaging}
                    ></MqPagination>
                </Spin>

                {/* 用户详情 */}
                <Modal
                    className='admin-Info'
                    title="用户详情"
                    centered
                    maskClosable
                    closable={false}
                    visible={this.state.detailModel}
                    footer={[
                        <Button key="submit" type="primary" onClick={() => this.closeDetailModel()}>
                            确定
                        </Button>,
                    ]}
                >
                    <div >
                        <ul className='list' style={{ display: this.state.loading ? 'none' : 'flex' }}>
                            <li className='item'>
                                <div className='label'>
                                    <label>头像</label>
                                </div>
                                <div className='content'>
                                    <div className='avatar'>
                                        <img src={this.state.modelData.head_img}></img>
                                    </div>
                                </div>
                            </li>
                            <li className='item'>
                                <div className='label'>
                                    <label>昵称</label>
                                </div>
                                <div className='content'>
                                    <div className='control'>
                                        <span className='text'>{this.state.modelData.nickname}</span>
                                    </div>
                                </div>
                            </li>
                            <li className='item'>
                                <div className='label'>
                                    <label>账号</label>
                                </div>
                                <div className='content'>
                                    <div className='control'>
                                        <span className='text'>{this.state.modelData.username}</span>
                                    </div>
                                </div>
                            </li>
                            <li className='item'>
                                <div className='label'>
                                    <label>绑定邮箱</label>
                                </div>
                                <div className='content'>
                                    <div className='control'>
                                        <span className='text'>{this.state.modelData.email}</span>
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
                                                this.state.modelData.user_roles ? 
                                                (
                                                    this.state.modelData.user_roles.map((e,i)=>{
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
                                        <span className='text'>{this.state.modelData.createdAt}</span>
                                    </div>
                                </div>
                            </li>
                            <li className='item'>
                                <div className='label'>
                                    <label>登录次数</label>
                                </div>
                                <div className='content'>
                                    <div className='control'>
                                        <span className='text'>{this.state.modelData.count} 次</span>
                                    </div>
                                </div>
                            </li>
                            <li className='item'>
                                <div className='label'>
                                    <label>最后登录ip</label>
                                </div>
                                <div className='content'>
                                    <div className='control'>
                                        <span className='text'>{this.state.modelData.last_login_ip}</span>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </Modal>

                {/* 修改密码 */}
                <Modal
                    title="修改密码"
                    visible={this.state.visible}
                    onOk={this.hideModal}
                    onCancel={this.hideModal}
                    okText="确认"
                    cancelText="取消"
                >

                </Modal>

            </div>
        )
    }
};


export default AdminList;