import React from 'react';

export const FetchWithPush = (object, path, push, method, errors, payload) => {
  return fetch(path, {
    method: method,
    credentials: 'same-origin',
    body: payload
  })
  .then(response => {
     if(response.ok || response.status == 422){
       return response
     } else {
       let errorMessage = `${response.status} (${response.statusText})`,
           error = new Error(errorMessage)
       throw(error)
     }
   })
   .then(response => response.json())
   .then(body => {
     if (body.errors) {
       object.setState({ [errors]: body.errors})
     } else {
       object.props.history.push('/')
     }
   })
   .catch(error => console.error(`Error in fetch: ${error.message}`));
}

export const FetchWithPull = (object, path) => {
  return fetch(path, { credentials: 'same-origin' })
  .then(response => {
     if(response.ok){
       return response
     } else {
       let errorMessage = `${response.status} (${response.statusText})`,
           error = new Error(errorMessage)
       throw(error)
     }
   })
   .then(response => response.json())
}

export const CreateErrorElements = (errors, name) => {
  if (errors) {
    return errors.map((error) => {
      return(
        <p className="error-text" key={`${error}`}>{`${name} ${error}`}</p>
      )
    })
  }
}

export default {
  CreateErrorElements,
  FetchWithPull,
  FetchWithPush
}
