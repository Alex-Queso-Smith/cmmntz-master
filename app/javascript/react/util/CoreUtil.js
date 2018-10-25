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
       if (push != '') {
         object.props.history.push(push)
       }
     }
   })
   .catch(error => console.error(`Error in fetch: ${error.message}`));
}

export const FetchDidMount = (object, path) => {
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

export const FetchWithUpdate = (object, path, method, payload) => {
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
}

export const FetchBasic = (object, path, payload, method) => {
  return fetch(path, {
    method: method,
    credentials: 'same-origin',
    body: payload
  })
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

export const FetchDeleteBasic = (object, path) => {
  return fetch(path, {
    method: 'DELETE',
    credentials: 'same-origin'
  })
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

export const SetStateWithValidation = (object, valid, name, value) => {
  object.setState({
    formInvalid: valid,
    [name]: value
  })
}

export const ErrorClassValidation = (error) => {
  if (error) {
    return "is-invalid"
  } else {
    "valid"
  }
}

export default {
  CreateErrorElements,
  FetchDidMount,
  FetchWithPush,
  SetStateWithValidation,
  ErrorClassValidation,
  FetchWithUpdate,
  FetchBasic,
  FetchDeleteBasic
}
