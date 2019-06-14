import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import { Alert} from 'antd';

import './index.less'

class Notice extends Component{
    render(){
        return(
            <div className='notice'>
                <Alert message="公告消息栏" banner closable></Alert>
            </div>
        )
    }
};


export default Notice;