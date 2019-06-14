import React, { Component } from 'react';

import {Spin,Icon,Switch, Button, Modal,message} from 'antd';

import MqPagination from '@/components/pagination';

import Empty from '@/components/empty';

import './index.less';

class ColumnList extends Component{
    state={
        loading: true,

        dataSource: [],//返回数据

        // 分页数据
        total:10,//总页数
        pageSize:1,//每页条数
        current:1,//当前页码
        
    }

    componentDidMount(){
        this.request();
    }
    //ajax加载数据
    request = (status,pages)=>{//status:状态码，pages:查询页数
        let _this = this;
        let dataSource = [
            {
                id:1,
                name:'公司简介',
                code:1,
                pcode:0,
                sort:255,
                status:1
            },
            {
                id:2,
                name:'公司简介',
                code:2,
                pcode:0,
                sort:255,
                status:1
            },
            {
                id:3,
                name:'公司简介',
                code:3,
                pcode:0,
                sort:255,
                status:1
            },
            {
                id:4,
                name:'公司简介',
                code:4,
                pcode:0,
                sort:255,
                status:1
            },
        ]
        
        _this.setState({
            dataSource:dataSource,
            total:30,
            loading:false,
        });
    }

    //删除函数
    handleDeleteBtn=(id)=>{
        console.log(id);
        let _this = this;
        Modal.confirm({
            title: '删除提示',
            content: `您确定要删除吗？`,
            onOk: () => {
                //执行删除、更新视图操作
                let data = _this.state.dataSource;
                data.splice(data.findIndex(item => item.id === id),1)
                _this.setState({
                    dataSource:data
                });

                message.success('删除成功')
            }
        })
    }

    // 分页函数
    changePaging=(val)=>{
        console.log(val);
        let _this = this;
        _this.setState({
            loading:true,
        });
        _this.request(0,val);
    }

    render(){
        return(
            <div className='columnlist'>
                <Spin tip="加载中" spinning={this.state.loading} indicator={<Icon type="minus" spin />}>
                    <div className='pc-table'>
                        <div className='columns'>
                            <span className='title'>栏目名称</span>
                            <span className='title'>栏目编码</span>
                            <span className='title'>父编码</span>
                            <span className='title'>排序</span>
                            <span className='title'>状态</span>
                            <span className='title'>操作</span>
                        </div>
                        <ul className='dataSource'>
                            {
                                this.state.dataSource.map((item,index)=>{
                                    return <li className='item' key={index}>
                                            <span className='data'>{item.name}</span>
                                            <span className='data'>{item.code}</span>
                                            <span className='data'>{item.pcode}</span>
                                            <span className='data'>{item.sort}</span>
                                            <span className='data'>
                                                <Switch checkedChildren={'开'} unCheckedChildren={'关'} />
                                            </span>
                                            <span className='data'>
                                                <Button size='small' type='primary'>编辑</Button>
                                                <Button size='small' type='danger' onClick={() => { this.handleDeleteBtn(item.id) }}>删除</Button>
                                            </span>
                                        </li>
                            }) 
                            }
                        </ul>
                    </div>
                    <div className='h5-table'>
                        {
                            this.state.dataSource.map((item,index)=>{
                                return <ul className='table-cart' key={index}>
                                            <li className='item'>
                                                <div className='colums' style={{flex:2}}>
                                                    <span className='title'>栏目名称 : </span>
                                                    <span className='data'>{item.name}</span>
                                                </div>
                                                <div className='colums status' style={{flex:1}}>
                                                    <span className='title'>状态 :</span>
                                                    <span className='data'>
                                                        <Switch checkedChildren={'开'} unCheckedChildren={'关'} />
                                                    </span>
                                                </div>
                                            </li>
                                            <li className='item'>
                                                <div className='colums' style={{flex:1}}>
                                                    <span className='title'>栏目编码 : </span>
                                                    <span className='data'>{item.code}</span>
                                                </div>
                                                <div className='colums' style={{flex:1}}>
                                                    <span className='title'>父编码 : </span>
                                                    <span className='data'>{item.pcode}</span>
                                                </div>
                                                <div className='colums' style={{flex:1}}>
                                                    <span className='title'>排序 : </span>
                                                    <span className='data'>{item.sort}</span>
                                                </div>
                                            </li>
                                            <li className='item'>
                                                <span className='title'>操作</span>
                                                <span className='data action'>
                                                    <Button size='small' type='primary'>编辑</Button>
                                                    <Button size='small' type='danger' onClick={() => { this.handleDeleteBtn(item.id) }}>删除</Button>
                                                </span>
                                            </li>
                                        </ul>
                            })
                        } 

                    </div>
                    {/* 空页面 */}
                    <Empty styleDisplay = {this.state.dataSource.length<=0?'block':'none'}></Empty>
                    {/* 分页 */}
                    <MqPagination 
                        total = {this.state.total}
                        pageSize = {this.state.pageSize}
                        changePaging = {this.changePaging}
                    ></MqPagination>
                </Spin>
                
            </div>
        )
    }
};


export default ColumnList;