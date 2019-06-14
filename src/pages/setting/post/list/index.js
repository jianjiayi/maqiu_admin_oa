import React, { Component } from 'react';

import { Spin, Icon, Switch, Button, Modal, Tag, message } from 'antd';

import MqPagination from '@/components/pagination';

import Empty from '@/components/empty';

import moment from 'moment';

import PostEditForm from '../components/postform';

import './index.less';

//分装好的axios
import http from '@/api';

class PostList extends Component {
    state = {
        loading: true,
        showBtn:false,

        detailModel: false,
        modelData: {},
        resourceArray:[],
        bulletinID:'',

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
        };
        _this.setState({
            loading: true,
        },()=>{
            http.post('/role/resourceList', params).then(res => {
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

    

    //修改公告状态失败
    changeRoleStatus = (id, status) => {
        console.log(id, status);
        let _this = this;
        let params = {
            id: id,
            status: status == 1 ? '0' : '1'
        }
        http.post('/role/modifyState', params).then(res => {
            console.log(res);
            if (res === undefined) {
                message.error('网络问题,或服务器异常，稍后重试');
                return;
            }

            if (res.status === 200) {
                let item = _this.state.dataSource.find(item=>item.id === id);
                item.status = params.status;
                _this.setState({
                    dataSource:_this.state.dataSource
                },()=>{
                    message.success('修改角色状态成功');
                })
            } else {
                message.error('修改角色状态失败');
            }
        });
    }

    //点解更新按钮
    updateBulletin = (data) => {
        let _this = this;
        //获取已拥有的权限
        let resourceArray = [];
        data.role_Resource.map((item)=>{
            resourceArray.push(item.id);
        });
        
        _this.setState({
            detailModel: true,
            modelData: data,
            resourceArray:resourceArray,
            bulletinID:data.id,
        })
    }
    //关闭模态框
    closeDetailModel = () => {
        let _this = this;
        _this.setState({
            detailModel: false,
        },()=>{
            _this.setState({
                modelData: {},
                resourceArray:[],
                bulletinID:''
            })
        })
    }

    //提交更新公告
    updateBulletinSubmit = (params) => {
        let _this = this;
        _this.setState({
            showBtn: true
        });
        params.id = _this.state.bulletinID;
        http.post('/role/update', params).then(res => {
            console.log(res);

            _this.setState({
                showBtn: false
            }, () => {
                if (res === undefined) {
                    message.error('网络问题,或服务器异常，稍后重试');
                    return;
                }

                if (res.status === 200) {
                    _this.closeDetailModel();
                    //提示
                    message.success(res.data.msg);
                    _this.request();
                } else {
                    console.log(res.data);
                    message.error(res.data.msg);
                }
            });

        });

    }

    

    

    render() {
        return (
            <div className='role-list'>
                <Spin tip="加载中" spinning={this.state.loading} indicator={<Icon type="minus" spin />}>
                    <div className='pc-table'>
                        <div className='columns'>
                            <span className='title'>ID</span>
                            <span className='title'>角色名称</span>
                            <span className='title'>角色描述</span>
                            <span className='title'>创建时间</span>
                            <span className='title'>状态</span>
                            <span className='title'>操作</span>
                        </div>
                        <ul className='dataSource'>
                            {
                                this.state.dataSource.map((item, index) => {
                                    return <li className='item' key={index}>
                                        <span className='data'>{item.id}</span>
                                        <span className='data'>{item.role_name}</span>
                                        <span className='data'>{item.role_desc}</span>
                                        <span className='data'>
                                                {item.createdAt}
                                        </span>
                                        <span className='data'>
                                            <Switch
                                                checkedChildren={'开'}
                                                unCheckedChildren={'关'}
                                                defaultChecked={item.isDel === '1' ? true : false}
                                                onClick={() => this.changeRoleStatus(item.id, item.isDel)}
                                            />
                                        </span>
                                        <span className='data'>
                                            <Button size='small' type='primary' onClick={() => this.updateBulletin(item)}>修改</Button>
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
                                            <span className='title'>ID : </span>
                                            <span className='data'>{item.id}</span>
                                        </div>

                                        <div className='colums status' style={{ flex: 3 }}>
                                            <span className='title'>创建时间 : </span>
                                            <span className='data'>{item.createdAt}</span>
                                        </div>
                                    </li>
                                    <li className='item'>
                                        <div className='colums' style={{ flex: 1 }}>
                                            <span className='title'>角色名称 : </span>
                                            <span className='data'>{item.role_name}</span>
                                        </div>
                                    </li>
                                    <li className='item'>
                                        <div className='colums' style={{ flex: 1 }}>
                                            <span className='title'>角色描述 : </span>
                                            <span className='data'>{item.role_desc}</span>
                                        </div>
                                    </li>
                                    <li className='item'>
                                        <span className='title'>操作</span>
                                        <span className='data action'>
                                            <Switch
                                                checkedChildren={'开'}
                                                unCheckedChildren={'关'}
                                                defaultChecked={item.isDel === '1' ? true : false}
                                                onClick={() => this.changeRoleStatus(item.id, item.isDel)}
                                            />
                                            <Button size='small' type='primary' onClick={() => this.updateBulletin(item)}>修改</Button>
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

                {/* 更新详情 */}
                <Modal
                    className='article-model-form'
                    title="修改修改配置"
                    width={768}
                    visible={this.state.detailModel}
                    onCancel={this.closeDetailModel}
                    footer={[
                        <Button key="submit"  onClick={() => this.closeDetailModel()}>
                            关闭
                        </Button>,
                    ]}
                >
                    <PostEditForm
                        showBtn = {this.state.showBtn}
                        formData={this.state.modelData}
                        resourceArray={this.state.resourceArray}
                        buttonSubmit = {this.updateBulletinSubmit}
                        >
                    </PostEditForm>
                </Modal>

            </div>
        )
    }
};


export default PostList;