import React, { Component } from 'react';

import { Upload, Icon, Modal } from 'antd';

import { uploadFile } from '@/config';

import './index.less'

class UploadImages extends Component{
    state = {
        previewVisible: false,
        previewImage: '',
        fileList: [],
    };
    componentDidMount() {
        console.log(this.props.fileList)
        this.setState({
            fileList: this.props.fileList,
        })
    }
    //传递的组件参数改变是调用
    componentWillReceiveProps(nextProps) {
        if (this.props.fileList !== nextProps.fileList) {
            let fileList = nextProps.fileList;
            this.setState({
                fileList: fileList,
            })
        }
    }

    handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }

    handleChange = ({ fileList }) => {
        this.setState({ 
            fileList: fileList
        },()=>{
            this.props.uploadImages(fileList)
        });
    }
    
    render(){
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
        <div>
            <Icon type="plus" />
            <div className="ant-upload-text">Upload</div>
        </div>
        );
        return (
        <div className="clearfix">
            <Upload
            action={uploadFile}
            listType="picture-card"
            fileList={fileList}
            onPreview={this.handlePreview}
            onChange={this.handleChange}
            >
            {fileList.length >= this.props.numbers ? null : uploadButton}
            </Upload>
            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </div>
        );
    }
};


export default UploadImages;