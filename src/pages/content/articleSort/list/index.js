import React, { Component } from 'react';

import { Spin, Icon, Form, Input, Upload, Button, Modal, Tag, message, Collapse, } from 'antd';


import Empty from '@/components/empty';

import SortForm from '../components/sortform.js';

import './index.less';

//分装好的axios
import http from '@/api';

const Panel = Collapse.Panel;

class ArticleSortList extends Component {
    state = {
        loading: false,
        sortTreeList: [],
        showBtn: false,
        modelData:{
            pcode:0,
            name:'',
            outlink:''
        },
        modelID:'',
    }

    componentDidMount() {
        this.request();
    }
    //ajax加载数据
    request = () => {//status:状态码，pages:查询页数
        let _this = this;
        _this.setState({
            loading: true,
        });
        let params = {
            pcode: 0,//默认查询顶级分类
            status: [0, 1]//所有状态启动台
        }
        http.post('/sort/list', params).then(res => {
            console.log(res);
            if (res === undefined) {
                message.error('网络问题,或服务器异常，稍后重试');
                return;
            }

            if (res.status === 200) {
                let listData = res.data.data.listData;
                _this.setState({
                    sortTreeList: listData,
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

    //修改分类状态
    changeStatusSubmit = (id, status) => {
        console.log(id);
        let _this = this;
        Modal.confirm({
            title: '提示',
            centered: true,
            content: `确定要` + (status === '1' ? '关闭' : '开启') + `该分类以及其所有子分类？`,
            onOk: () => {
                let params = {
                    id: id,//修改分类的id
                    status: status === '1' ? '0' : '1' //所有状态启动台
                }
                http.post('/sort/modifyState', params).then(res => {
                    console.log(res);
                    if (res === undefined) {
                        message.error('网络问题,或服务器异常，稍后重试');
                        return;
                    }

                    if (res.status === 200) {
                        _this.request();
                    } else {
                        message.error(res.data.msg);
                    }
                });

            }
        })
    }

    //修改分类排序
    settingSorting = (id, sortnum) => {
        console.log(id, sortnum);
        let _this = this;
        let params = {
            id: id,
            sort: sortnum
        }
        http.post('/sort/setSorting', params).then(res => {
            console.log(res);
            if (res.status === 200) {
                _this.request();
                message.success('修改分类排序成功');
            } else {
                message.error('修改分类排序失败');
            }
        });
    }

    //编辑
    lookDetailInfo = (data) => {
        let _this = this;
        _this.setState({
            detailModel: true,
            modelData: data,
            modelID:data.id,
        })
    }
    //关闭模态框
    closeDetailModel = () => {
        this.setState({
            detailModel: false,
            modelData: {},
            modelID:''
        })
    }

    //修改分类
    editSortSubmit = (params) => {
        let _this = this;
        params.id = _this.state.modelID;
        http.post('/sort/update', params).then(res => {
            console.log(res);
            _this.setState({
                showBtn: false
            }, () => {
                if(res === undefined){
                    message.error('网络问题,或服务器异常，稍后重试');
                    return;
                }

                if (res.status === 200) {
                    _this.closeDetailModel();
                    _this.request();
                    //重置表单
                    message.success('修改分类成功');
                } else {
                    message.error(res.data.msg);
                }
            });
        });
    }



    render() {


        const genExtra = (item, index, length) => (
            <div className='button-group'>
                <Tag
                    className='sortting btn'
                    color="orange"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}>{item.sorting}</Tag>
                <Button
                    className='btn'
                    size='small'
                    type="link"
                    disabled={index === 0 ? true : false}
                    onClick={(e) => {
                        e.stopPropagation();
                        this.settingSorting(item.id, 1);
                    }}
                >上移</Button>
                <Button
                    className='btn'
                    size='small'
                    type="link"
                    disabled={index === length ? true : false}
                    onClick={(e) => {
                        e.stopPropagation();
                        this.settingSorting(item.id, -1);
                    }}
                >下移</Button>
                <Button
                    className='edit-button btn'
                    size='small'
                    type="primary"
                    onClick={(e) => {
                        e.stopPropagation();
                        this.lookDetailInfo(item)
                    }}>编辑</Button>
                <Button
                    className='dele-button btn'
                    size='small'
                    type={item.status === '0' ? 'danger' : 'primary'}
                    onClick={(e) => {
                        e.stopPropagation();
                        this.changeStatusSubmit(item.id, item.status);
                    }}>{item.status === '1' ? '关闭' : '开启'}</Button>
            </div>

        );

        //生成分类列表
        const renderPanelItem = (item, index, length) => {
            let i = 0;
            i++;
            return item.children ? (
                <Panel
                    style={{ paddingLeft: 20 * i + 'px' }}
                    key={item.id}
                    header={index * 1 + 1 + '、' + item.name}
                    extra={genExtra(item, index, length)}
                >
                    <Collapse bordered={false} key={item.id}>
                        {item.children.map((childItem, childIndex) => renderPanelItem(childItem, childIndex, item.children.length - 1))}
                    </Collapse>

                </Panel>
            ) : (
                    <Panel
                        style={{ paddingLeft: 20 * i + 'px' }}
                        key={item.id}
                        header={index * 1 + 1 + '、' + item.name}
                        extra={genExtra(item, index, length)}
                        showArrow={false}>
                    </Panel>
                )
        };

        return (
            <div className='article-sort-list'>
                <Spin tip="加载中" spinning={this.state.loading} indicator={<Icon type="minus" spin />}>
                    <Collapse bordered={false}>
                        {
                            this.state.sortTreeList.map((item, index) => {
                                return renderPanelItem(item, index, this.state.sortTreeList.length - 1)
                            })

                        }
                    </Collapse>
                    {/* 空页面 */}
                    <Empty styleDisplay={this.state.sortTreeList.length <= 0 ? 'block' : 'none'}></Empty>
                </Spin>


                {/* 编辑分类 */}
                <Modal
                    className='sort-modal'
                    title="分类详情"
                    centered
                    maskClosable
                    closable={false}
                    visible={this.state.detailModel}
                    footer={[
                        <Button key="submit"  onClick={() => this.closeDetailModel()}>
                            取消
                        </Button>,
                    ]}
                >
                    <SortForm
                        btnLodding = {this.state.showBtn}
                        formData={this.state.modelData}
                        formDataSubmit={this.editSortSubmit}
                    ></SortForm>
                </Modal>
            </div>

        )
    }
};


export default ArticleSortList;