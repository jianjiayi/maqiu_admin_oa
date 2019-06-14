import React, { Component } from 'react';

import { Spin, Icon, Switch, Button, Modal, Tag, message } from 'antd';

import MqPagination from '@/components/pagination';

import Empty from '@/components/empty';

// import BannerEditForm from '../components/bannerform'

import './index.less';

//分装好的axios
import http from '@/api';

class LinkList extends Component {
    state = {
        loading: true,

        detailModel: false,
        modelData: {},
        articleID: '',

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
        });
        http.post('/banner/list', params).then(res => {
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
                    loading: false
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



    //修改幻灯片状态
    changeBannerStatus = (id, status) => {
        console.log(id, status);
        let _this = this;
        let params = {
            id: id,
            status: status == 1 ? '0' : '1'
        }
        http.post('/banner/modifyState', params).then(res => {
            console.log(res);
            if (res === undefined) {
                message.error('网络问题,或服务器异常，稍后重试');
                return;
            }

            if (res.status === 200) {
                let item = _this.state.dataSource.find(item => item.id === id);
                item.status = params.status;
                _this.setState({
                    dataSource: _this.state.dataSource
                }, () => {
                    message.success('修改幻灯片状态成功');
                })
            } else {
                message.error('修改幻灯片状态失败');
            }
        });
    }

    //修改幻灯片排序
    settingSorting = (id, sortnum) => {
        console.log(id, sortnum);
        let _this = this;
        let params = {
            id: id,
            sort: sortnum
        }
        http.post('/banner/setSorting', params).then(res => {
            console.log(res);
            if (res.status === 200) {
                _this.request();
                message.success('修改幻灯片排序成功');
            } else {
                message.error('修改幻灯片排序失败');
            }
        });
    }


    //点解修改按钮
    changeBannerButton = (data) => {
        let _this = this;
        _this.setState({
            detailModel: true,
            modelData: data,
            linkID: data.id,
        })
    }
    //关闭模态框
    closeModelButton = () => {
        this.setState({
            detailModel: false,
            modelData: {},
            linkID: ''
        })
    }

    //提交修改幻灯片
    updateBannerSubmit = (params) => {
        let _this = this;
        params.id = _this.state.linkID;
        http.post('/banner/update', params).then(res => {
            console.log(res);

            _this.setState({
                showBtn: false
            }, () => {
                if (res === undefined) {
                    message.error('网络问题,或服务器异常，稍后重试');
                    return;
                }

                if (res.status === 200) {

                    //提示
                    message.success(res.data.msg);

                    _this.closeModelButton();

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
            <div className='banner-list'>
                <Spin tip="加载中" spinning={this.state.loading} indicator={<Icon type="minus" spin />}>
                    <div className='pc-table'>
                        <div className='columns'>
                            <span className='title'>ID</span>
                            <span className='title'>分组</span>
                            <span className='title'>图片</span>
                            <span className='title'>地址</span>
                            <span className='title'>标题</span>
                            <span className='title'>副标题</span>
                            <span className='title'>排序</span>
                            <span className='title'>状态</span>

                            <span className='title'>操作</span>
                        </div>
                        <ul className='dataSource'>
                            {
                                this.state.dataSource.map((item, index) => {
                                    return <li className='item' key={index}>
                                        <span className='data'>{item.id}</span>
                                        <span className='data'>{item.gid}</span>
                                        <span className='data'>
                                            <img className='link-logo' src={item.pic}></img>
                                        </span>
                                        <span className='data'>{item.link}</span>
                                        <span className='data'>{item.title}</span>
                                        <span className='data'>{item.subtitle}</span>
                                        <span className='data'>
                                            <Tag color={'#87d068'}>
                                                {item.sorting}
                                            </Tag>
                                        </span>
                                        <span className='data'>
                                            <Switch
                                                checkedChildren={'开'}
                                                unCheckedChildren={'关'}
                                                defaultChecked={item.isDel === '1' ? true : false}
                                                onClick={() => this.changeBannerStatus(item.id, item.isDel)}
                                            />
                                        </span>
                                        <span className='data'>
                                            <Button
                                                className='btn'
                                                size='small'
                                                type="link"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    this.settingSorting(item.id, 1);
                                                }}
                                            >上移</Button>
                                            <Button
                                                className='btn'
                                                size='small'
                                                type="link"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    this.settingSorting(item.id, -1);
                                                }}
                                            >下移</Button>
                                            <Button
                                                size='small'
                                                type='primary'
                                                onClick={() => this.changeBannerButton(item)}
                                            >修改</Button>
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
                                        <div className='colums' style={{ flex: 1 }}>
                                            <span className='title'>排序 : </span>
                                            <span className='data'>{item.sorting}</span>
                                        </div>
                                        <div className='colums status' style={{ flex: 1 }}>
                                            <span className='title'>状态 : </span>
                                            <span className='data'>
                                                <Switch
                                                    checkedChildren={'开'}
                                                    unCheckedChildren={'关'}
                                                    defaultChecked={item.isDel === '1' ? true : false}
                                                    onClick={() => this.changeBannerStatus(item.id, item.isDel)}
                                                />
                                            </span>
                                        </div>

                                    </li>
                                    <li className='item'>
                                        <div className='colums'>
                                            <span className='title'>标题 : </span>
                                            <span className='data'>{item.title}</span>
                                        </div>
                                    </li>
                                    <li className='item'>
                                        <div className='colums' style={{ flex: 1 }}>
                                            <span className='title'>副标题 : </span>
                                            <span className='data'>{item.subtitle}</span>
                                        </div>
                                    </li>
                                    <li className='item'>
                                        <div className='colums' style={{ flex: 1 }}>
                                            <span className='title'>图标 : </span>
                                            <span className='data'>
                                                <img className='link-logo' src={item.pic}></img>
                                            </span>
                                        </div>
                                    </li>
                                    <li className='item'>
                                        <div className='colums' style={{ flex: 1 }}>
                                            <span className='title'>地址 : </span>
                                            <span className='data'>{item.link}</span>
                                        </div>
                                    </li>
                                    <li className='item'>
                                        <div className='colums' style={{ flex: 1 }}>
                                            <span className='title'>创建时间 : </span>
                                            <span className='data'>{item.createdAt}</span>
                                        </div>
                                    </li>
                                    <li className='item'>
                                        <span className='title'>操作</span>
                                        <span className='data action'>
                                            <Button
                                                className='btn'
                                                size='small'
                                                type="link"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    this.settingSorting(item.id, 1);
                                                }}
                                            >上移</Button>
                                            <Button
                                                className='btn'
                                                size='small'
                                                type="link"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    this.settingSorting(item.id, -1);
                                                }}
                                            >下移</Button>
                                            <Button
                                                size='small'
                                                type='primary'
                                                onClick={() => this.changeBannerButton(item)}
                                            >修改</Button>
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

                {/* 更新文章详情 */}
                <Modal
                    className='article-model-form'
                    title="修改链接详情"
                    width={768}
                    visible={this.state.detailModel}
                    onCancel={this.closeModelButton}
                    footer={[
                        <Button key="submit" onClick={() => this.closeModelButton()}>
                            关闭
                        </Button>,
                    ]}
                >

                    {/* <BannerEditForm
                        btnLodding={this.state.showBtn}
                        formData={this.state.modelData}
                        formDataSubmit={this.updateBannerSubmit}
                    ></BannerEditForm> */}
                </Modal>

            </div>
        )
    }
};


export default LinkList;