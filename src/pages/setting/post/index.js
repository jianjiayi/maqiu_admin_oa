import React, { Component } from 'react';

import MqTabPane from '@/components/tabPane';

import PostList from './list';
import PostForm from './form';

import './index.less'

class post extends Component{
    state={
        // 标签页信息
        tabsOptions:[
            {
              value:1,
              label:'角色列表',
            },
            {
              value:2,
              label:'新增角色',
            },
        ],
        tabActiveIndex:'1',
        tabsStatus:'1',
    }
    //点击tab切换回调函数
    tabPaneCallback=(key)=>{
        this.setState({
            tabsStatus:key
        })
    }
    render(){
        return(
            <div className='colum'>
                <MqTabPane 
                    tabsOptions={this.state.tabsOptions}
                    tabActiveIndex = {this.state.tabActiveIndex}
                    tabPaneCallback = {this.tabPaneCallback}
                >  
                </MqTabPane>
                {
                    this.state.tabsStatus === '1' ? <PostList></PostList> : <PostForm></PostForm>
                }
            </div>
        )
    }
};


export default post;