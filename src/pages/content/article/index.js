import React, { Component } from 'react';

import MqTabPane from '@/components/tabPane';

import ArticleList from './list';
import ArticleEditor from './form';

import './index.less'

class Article extends Component{
    state={
        // 标签页信息
        tabsOptions:[
            {
              value:1,
              label:'文章列表',
            },
            {
              value:2,
              label:'新增文章',
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
                    this.state.tabsStatus === '1' ? <ArticleList></ArticleList> : <ArticleEditor></ArticleEditor>
                }
            </div>
        )
    }
};


export default Article;