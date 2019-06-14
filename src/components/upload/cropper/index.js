import React, { Component } from 'react';

import { Icon, Modal, message } from 'antd';

import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

import Axios from 'axios';
import { uploadFile } from '@/config';

import './index.less';

class UploadCropper extends Component {
  state = {
    modalVisible: false,//模态框
    confirmLoading: false,

    src: null,//文件路径
  }

  componentWillMount() {
    const fileReader = new FileReader()
    fileReader.onload = (e) => {
      const dataURL = e.target.result
      this.setState({ src: dataURL })
    }
    let file = this.props.uploadedImageFile;
    if (file) {
      fileReader.readAsDataURL(this.props.uploadedImageFile)
    }
  }

  //base64转换成blob
  dataURLtoBlob = (urlData) => {
    var bytes = window.atob(urlData.split(',')[1]);        //去掉url的头，并转换为byte  

    //处理异常,将ascii码小于0的转换为大于0  
    var ab = new ArrayBuffer(bytes.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < bytes.length; i++) {
      ia[i] = bytes.charCodeAt(i);
    }

    return new Blob([ab], { type: 'image/png' });
  }

  //选择图片
  handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      //文件最多不能超过5M
      if (file.size / 1024 <= 5 * 1024) {

        const reader = new FileReader();
        reader.onload = () => {
          this.setState({
            src: reader.result
          }, () => {
            this.setState({
              modalVisible: true,
            })
          })
        }
        reader.readAsDataURL(file);

      } else {
        message.error("文件过大")
      }
    } else {
      message.error("请选择文件")
    }

    e.target.value = ''
  }

  //保存裁切
  saveCropperImg = () => {
    if (this.cropper.getCroppedCanvas() === 'null') {
      return false
    }

    this.setState({
      confirmLoading: true,
    })
    //获取Canvas图片，base64
    let base64Url = this.cropper.getCroppedCanvas().toDataURL();
    //将base64转换成blob
    let FileOrBlob = this.dataURLtoBlob(base64Url);
    //添加到formdata
    let formData = new FormData();
    formData.append('file', FileOrBlob, "file_" + Date.parse(new Date()) + ".png");
    //上传的服务器
    Axios({
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      method: 'post',
      data: formData,
      url: uploadFile
    }).then(res => {
      if (res.data.code === 200) {
        console.log(res.data)
        let imgurl = res.data.data.imgUrl
        this.setState({
          modalVisible: false,
          confirmLoading: false,
        }, () => {
          //将返回的图片路径传递给父组件
          this.props.getCropperImagesUrl(imgurl,this.props.filename);
        });
      }
    }, err => {
      message.error("文件上传失败")
    })


  }

  //取消裁切
  cancelCropper = () => {
    this.setState({
      modalVisible: false,
      confirmLoading:false,
    });
  }


  render() {
    //判断上传按钮是否可见
    let UploadVisible = this.props.UploadVisible || false;

    return (
      <div className='upload-cropper'>

        {/* 选择图片按钮 */}
        {
          UploadVisible ?
            <div className="upload-box">
              <span className="upload-span" role="button">
                <input
                  type="file"
                  accept="image/*"
                  className="base-upload-input"
                  onChange={this.handleFileChange}
                />
                <div className="button">
                  <Icon type="plus" />
                  <div>Upload</div>
                </div>
              </span>
            </div> : ''
        }



        {/* 裁切图片modal框 */}
        <Modal
          title="图片裁切"
          centered
          closable={false}
          destroyOnClose={true}
          visible={this.state.modalVisible}
          onOk={this.saveCropperImg}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.cancelCropper}
          okText="确认"
          cancelText="取消"
        >
          <div className="cropperModal">

            <Cropper
              ref={cropper => this.cropper = cropper}
              src={this.state.src}//图片路径，即是base64的值，在Upload上传的时候获取到的
              style={{ height: 400, width: '100%' }}
              preview='.cropper-preview'
              className="company-cropper"
              viewMode={1} //定义cropper的视图模式
              zoomable={true} //是否允许放大图像
              aspectRatio={this.props.aspectRatio} //image的纵横比1:1
              guides={false} //显示在裁剪框上方的虚线
              background={false} //是否显示背景的马赛克
              rotatable={true} //是否旋转
            />
            <div className='preview-button'>
              <div className="cropper-preview" style={{
                height: 100,
                width: '100%'
              }}></div>
            </div>

          </div>

        </Modal>

      </div>
    )
  }
};


export default UploadCropper;