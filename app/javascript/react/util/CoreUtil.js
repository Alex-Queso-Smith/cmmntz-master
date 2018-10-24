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

export const FetchWithUpdate = (object, path, method, errors, payload) => {
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
   .catch(error => console.error(`Error in fetch: ${error.message}`));
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

export const Timeout = (() => {
  const keyId = {}
  const complete = {}

  // set(key, func, ms) -- user-defined key
  // set(func, ms) -- func used as key
  //
  // returns a function allowing you to test if it has executed
  const set = (...args) => {
    let key, func, ms

    if (args.length == 3)
      [key, func, ms] = args
    else {
      [func, ms] = args
      key = func
    }

    clear(key)

    const invoke = () => (complete[key] = true, func())

    keyId[key] = setTimeout(invoke, ms)
    complete[key] = false

    return () => executed(key)
  }

  const clear = key => {
    clearTimeout(keyId[key])
    delete keyId[key]
    delete complete[key]
  }

  // timeout has been created
  const exists = key => key in keyId

  // timeout does exist, but has not yet run
  const pending = key => exists(key) && !executed(key)

  // test if a timeout has run
  const executed = key => key in complete && complete[key]

  return {
    set,
    clear,
    exists,
    pending,
    executed
  }
})()

export default {
  CreateErrorElements,
  FetchDidMount,
  FetchWithPush,
  SetStateWithValidation,
  ErrorClassValidation,
  FetchWithUpdate,
  FetchBasic,
  FetchDeleteBasic,
  Timeout
}
