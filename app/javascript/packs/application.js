/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb

import React from 'react';
import { render } from 'react-dom';

import App from '../react/containers/App';
import RedBox from 'redbox-react';

document.addEventListener('DOMContentLoaded', () => {
  let userElement = document.getElementById('app');

  if (userElement) {
    if(window.railsEnv && window.railsEnv === 'development'){
      try {
        render(<App />, userElement)
      } catch (e) {
        render(<RedBox error={e} />, userElement)
      }
    }
    else {
      render(<App />, userElement)
    }
  }

  let commentElement = document.getElementById('cf-comments-app')

  if (commentElement) {
    if(window.railsEnv && window.railsEnv === 'development'){
      try {
        render(<CfCommentsApp />, commentElement)
      } catch (e) {
        render(<RedBox error={e} />, commentElement)
      }
    }
    else {
      render(<CfCommentsApp />, commentElement)
    }
  }
})
