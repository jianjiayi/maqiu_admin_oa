import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import { Tag } from 'antd';

import { connect } from 'react-redux';
import * as actionCreators from '@/store/all/actionCreators';

import './index.less';

class MqBreadcrumb extends Component {
    handleClose = (removedTag) => {
        console.log(removedTag);
        this.props.delNavArray(removedTag);
    }
    
    render() {
        let navArrays = this.props.navArrays;
        let pathname = this.props.pathname;
        return (
            <div className='breadcrumb'>
                {
                    navArrays.map((n, i) => {
                        return  <Tag
                                    key={i}
                                    color={pathname === n.path ? '#48BC77' : ''}
                                    closable={pathname === n.path ? false : true}
                                    onClose={(e) => {
                                        e.preventDefault();
                                        this.handleClose(n);
                                    }}>
                                        <Link to={n.path} replace key={i}> {n.name} </Link>
                                </Tag>
                    })
                }
            </div>
        )
    }
};


const mapDispatch = (dispatch) => {
    return {
        delNavArray(item) {
            dispatch(actionCreators.navArrayDel(item))
        }
    }
}

export default connect(null, mapDispatch)(MqBreadcrumb);