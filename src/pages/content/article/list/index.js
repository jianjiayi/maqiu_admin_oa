import React, { Component } from 'react';

import { Spin, Icon, Switch, Button, Modal, Tag, message } from 'antd';

import MqPagination from '@/components/pagination';

import Empty from '@/components/empty';

import ArticleEditForm from '../components/articleform'

import './index.less';

//分装好的axios
import http from '@/api';

class ArticleList extends Component {
    state = {
        loading: true,

        detailModel: false,
        modelData: {},
        articleID:'',

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
        http.post('/content/list', params).then(res => {
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

    

    //修改文章状态失败
    changeArticleStatus = (id, status) => {
        console.log(id, status);
        let _this = this;
        let params = {
            id: id,
            status: status == 1 ? '0' : '1'
        }
        http.post('/content/modifyState', params).then(res => {
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
                    message.success('修改文章状态成功');
                })
            } else {
                message.error('修改文章状态失败');
            }
        });
    }

    //文章置顶
    changeIsTopStatus = (id, status) => {
        console.log(id, status);
        let _this = this;
        let params = {
            id: id,
            status: status == 1 ? '0' : '1'
        }
        http.post('/content/isTopStatus', params).then(res => {
            console.log(res);
            if (res === undefined) {
                message.error('网络问题,或服务器异常，稍后重试');
                return;
            }

            if (res.status === 200) {
                let item = _this.state.dataSource.find(item=>item.id === id);
                item.istop = params.status;
                _this.setState({
                    dataSource:_this.state.dataSource
                },()=>{
                    message.success('修改文章置顶状态成功');
                })
            } else {
                message.error('修改文章置顶状态失败');
            }
        });
    }

    //点解更新按钮
    updateArticle = (data) => {
        let _this = this;
        _this.setState({
            detailModel: true,
            modelData: data,
            articleID:data.id,
        })
    }
    //关闭模态框
    closeDetailModel = () => {
        this.setState({
            detailModel: false,
            modelData: {},
            articleID:''
        })
    }

    //提交更新文章
    updateArticleSubmit = (params) => {
        let _this = this;
        params.id = _this.state.articleID;
        http.post('/content/update', params).then(res => {
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
                } else {
                    console.log(res.data);
                    message.error(res.data.msg);
                }
            });

        });

    }

    

    

    render() {
        return (
            <div className='article-list'>
                <Spin tip="加载中" spinning={this.state.loading} indicator={<Icon type="minus" spin />}>
                    <div className='pc-table'>
                        <div className='columns'>
                            <span className='title'>ID</span>
                            <span className='title'>栏目</span>
                            <span className='title'>标题</span>
                            <span className='title'>排序</span>
                            <span className='title'>发布时间</span>
                            <span className='title'>访问量</span>
                            <span className='title'>状态</span>
                            <span className='title'>置顶</span>
                            <span className='title'>操作</span>
                        </div>
                        <ul className='dataSource'>
                            {
                                this.state.dataSource.map((item, index) => {
                                    return <li className='item' key={index}>
                                        <span className='data'>{item.id}</span>
                                        <span className='data'>{item.contentSortInfo.name}</span>
                                        <span className='data'>{item.title}</span>
                                        <span className='data'>
                                            <Tag color={'#87d068'}>
                                                {item.sorting}
                                            </Tag>
                                        </span>
                                        <span className='data'>{item.release_date}</span>
                                        <span className='data'>
                                            <Tag color={'#87d068'}>
                                                {item.pageviews}
                                            </Tag>
                                        </span>
                                        <span className='data'>
                                            <Switch
                                                checkedChildren={'开'}
                                                unCheckedChildren={'关'}
                                                defaultChecked={item.status === '1' ? true : false}
                                                onClick={() => this.changeArticleStatus(item.id, item.status)}
                                            />
                                        </span>
                                        <span className='data'>
                                            <Switch
                                                checkedChildren={'是'}
                                                unCheckedChildren={'否'}
                                                defaultChecked={item.istop === '1' ? true : false}
                                                onClick={() => this.changeIsTopStatus(item.id, item.istop)}
                                            />
                                        </span>
                                        <span className='data'>
                                            <Button size='small' onClick={() => this.resetPassword(item.username)}>查看</Button>
                                            <Button size='small' type='primary' onClick={() => this.updateArticle(item)}>修改</Button>
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
                                            <span className='title'>发布时间 : </span>
                                            <span className='data'>{item.release_date}</span>
                                        </div>
                                    </li>
                                    <li className='item'>
                                        <div className='colums' style={{ flex: 1 }}>
                                            <span className='title'>标题 : </span>
                                            <span className='data'>{item.title}</span>
                                        </div>
                                    </li>
                                    <li className='item'>
                                        <div className='colums' style={{ flex: 1 }}>
                                            <span className='title'>分类 : </span>
                                            <span className='data'>{item.contentSortInfo.name}</span>
                                        </div>
                                    </li>
                                    
                                    <li className='item'>
                                        <div className='colums' style={{ flex: 1 }}>
                                            <span className='title'>排序 : </span>
                                            <span className='data'>{item.sorting}</span>
                                        </div>

                                        <div className='colums' style={{ flex: 1 }}>
                                            <span className='title'>访问量 : </span>
                                            <span className='data'>{item.pageviews}</span>
                                        </div>
                                        <div className='colums status' style={{ flex: 1 }}>
                                            <span className='title'>置顶 : </span>
                                            <span className='data'>
                                            <Switch
                                                checkedChildren={'是'}
                                                unCheckedChildren={'否'}
                                                defaultChecked={item.istop === '1' ? true : false}
                                                onClick={() => this.changeIsTopStatus(item.id, item.istop)}
                                            /></span>
                                        </div>
                                    </li>
                                    <li className='item'>
                                        <span className='title'>操作</span>
                                        <span className='data action'>
                                            <Switch
                                                checkedChildren={'开'}
                                                unCheckedChildren={'关'}
                                                defaultChecked={item.status === '1' ? true : false}
                                                onClick={() => this.changeArticleStatus(item.id, item.status)}
                                            />
                                            <Button size='small'  onClick={() => this.lookDetailInfo(item)}>查看</Button>
                                            <Button size='small' type='primary' onClick={() => this.updateArticle(item)}>修改</Button>
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
                    title="修改文章详情"
                    width={768}
                    visible={this.state.detailModel}
                    onCancel={this.closeDetailModel}
                    footer={[
                        <Button key="submit"  onClick={() => this.closeDetailModel()}>
                            关闭
                        </Button>,
                    ]}
                >
                    <ArticleEditForm
                        formData={this.state.modelData}
                        updateSubmit = {this.updateArticleSubmit}
                        >
                    </ArticleEditForm>
                </Modal>

            </div>
        )
    }
};


export default ArticleList;