import React, { Component } from 'react';

import { Switch, Button } from 'antd';

import './index.less'

class TableList extends Component{
    render(){
        return(
            <div className='TableList'>
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
                        <li className='item'>
                            <span className='data'>公司简介</span>
                            <span className='data'>1</span>
                            <span className='data'>0</span>
                            <span className='data'>255</span>
                            <span className='data'>
                                <Switch checkedChildren={'开'} unCheckedChildren={'关'} />
                            </span>
                            <span className='data'>
                                <Button size='small' type='primary'>编辑</Button>
                                <Button size='small' type='danger'>删除</Button>
                            </span>
                        </li>
                        <li className='item'>
                            <span className='data'>公司简介</span>
                            <span className='data'>1</span>
                            <span className='data'>0</span>
                            <span className='data'>255</span>
                            <span className='data'>
                                <Switch checkedChildren={'开'} unCheckedChildren={'关'} />
                            </span>
                            <span className='data'>
                                <Button size='small' type='primary'>编辑</Button>
                                <Button size='small' type='danger'>删除</Button>
                            </span>
                        </li>
                    </ul>
                </div>
                <div className='h5-table'>
                    <ul className='table-cart'>
                        <li className='item'>
                            <span className='title'>栏目名称 : </span>
                            <span className='data'>公司简介</span>
                        </li>
                        <li className='item'>
                            <span className='title'>栏目编码 : </span>
                            <span className='data'>1</span>
                        </li>
                        <li className='item'>
                            <span className='title'>父编码 : </span>
                            <span className='data'>0</span>
                        </li>
                        <li className='item'>
                            <div className='colums' style={{flex:1}}>
                                <span className='title'>状态 : </span>
                                <span className='data'>
                                    <Switch checkedChildren={'开'} unCheckedChildren={'关'} />
                                </span>
                            </div>
                            <div className='colums' style={{flex:1}}>
                                <span className='title'>排序 : </span>
                                <span className='data'>255</span>
                            </div>
                        </li>
                        <li className='item'>
                            <span className='title'>操作</span>
                            <span className='data action'>
                                <Button size='small' type='primary'>编辑</Button>
                                <Button size='small' type='danger'>删除</Button>
                            </span>
                        </li>
                    </ul>
                    <ul className='table-cart'>
                        <li className='item'>
                            <span className='title'>栏目名称 : </span>
                            <span className='data'>公司简介</span>
                        </li>
                        <li className='item'>
                            <span className='title'>栏目编码 : </span>
                            <span className='data'>1</span>
                        </li>
                        <li className='item'>
                            <span className='title'>父编码 : </span>
                            <span className='data'>0</span>
                        </li>
                        <li className='item'>
                            <div className='colums' style={{flex:1}}>
                                <span className='title'>状态 : </span>
                                <span className='data'>
                                    <Switch checkedChildren={'开'} unCheckedChildren={'关'} />
                                </span>
                            </div>
                            <div className='colums' style={{flex:1}}>
                                <span className='title'>排序 : </span>
                                <span className='data'>255</span>
                            </div>
                        </li>
                        <li className='item'>
                            <span className='title'>操作</span>
                            <span className='data action'>
                                <Button size='small' type='primary'>编辑</Button>
                                <Button size='small' type='danger'>删除</Button>
                            </span>
                        </li>
                    </ul>
                    
                </div>

            </div>
        )
    }
};


export default TableList;