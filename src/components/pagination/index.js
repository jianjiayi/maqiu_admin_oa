import React, { Component } from 'react';

import {Pagination } from 'antd';

import './index.less'

class MqPagination extends Component{
    render(){
        let total = this.props.total;
        return(
            <div className='pagination'
                style={{display:total==0?'none':''}}>
                <Pagination 
                    size='small' 
                    defaultCurrent={1} //默认的当前页数
                    pageSize={this.props.pageSize} //每页条数
                    total={this.props.total}//数据总数
                    onChange={this.props.changePaging}
                    >
                </Pagination>
            </div>
            
        )
    }
};


export default MqPagination;