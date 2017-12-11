/**
 * @Author: Fabre Ed
 * @Date:   2017-11-17T17:52:35-05:00
 * @Email:  edwidgefabre@gmail.com
 * @Filename: image_profile.jsx
 * @Last modified by:   Fabre Ed
 * @Last modified time: 2017-12-10T15:27:33-05:00
 */

/* eslint-env browser */
import React from 'react';
import Dropzone from 'react-dropzone';
import cloudinary from 'cloudinary';
import { Image } from 'react-bootstrap';
import { ipcRenderer } from 'electron';

// Class logger, managed by loggingManager.js
const logger = require('rekuire')('loggingManager.js').logger;
const THISFILE = require('path').basename(__filename).toUpperCase();

// Require the cloudinary config file.
const config = require('rekuire')('cloudinary-config.json');

cloudinary.config({
  cloud_name: config.cloud_name,
  api_key: config.api_key,
  api_secret: config.api_secret,
});

export default class ImageProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: '',
      imagePreviewUrl: {},
    };
    this.onDrop = this.onDrop.bind(this);
  }
  componentDidMount() {
    this.initProfileImage();
  }
  componentWillUnmount() {}

  onDrop(e) {
    const file = e[0];
    logger.log('silly', 'User Uploading Profile Image', {
      file: THISFILE,
      data: {
        file,
      },
    });
    cloudinary.v2.uploader.upload(file.path, {
      upload_preset: config.upload_preset,
    }, (error, result) => {
      ipcRenderer.send('update-profile-info', {
        data: {
          image: result.secure_url,
        },
      });
      this.setState({
        file,
        imagePreviewUrl: result.secure_url,
      });
    });
  }

  initProfileImage() {
    ipcRenderer.send('get-profile-info');
    ipcRenderer.on('profile-info-result', (event, data) => {
      if (data.profileExists) {
        logger.log('silly', 'Updating User Profile Image', {
          file: THISFILE,
          data: {
            data,
          },
        });
        this.setState({
          imagePreviewUrl: data.results.image,
        });
      }
      return '';
    });
  }

  render() {
    const { imagePreviewUrl } = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<Image src={imagePreviewUrl} circle />);
    }
    return (
      <div className="profImageComponent">
        <div className="profileImage">
          <Dropzone
            accept="image/jpeg, image/png"
            style={{
              position: 'relative',
            }}
            onDrop={this.onDrop}
          >
            {$imagePreview}
          </Dropzone>
        </div>
      </div>
    );
  }
}
