import React from 'react';

export const Timeout = (() => {
  const keyId = {}
  const complete = {}

  // set(key, func, ms) -- user-defined key
  // set(func, ms) -- func used as key
  //
  // returns a function allowing you to test if it has executed
  const set = (...args) => {
    let key, func, ms;

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

export const CommentLengthSorter = (comment) => {
  var result;

  if (comment.length <= 250) {
    result = 1
  } else if (comment.length >= 251 && comment.length <= 500) {
    result = 2
  } else if (comment.length >= 501 && comment.length <= 750) {
    result = 3
  } else if (comment.length >= 751 && comment.length <= 1000) {
    result = 4
  } else {
    result = 5
  }

  return result
}



export default {
  Timeout,
  CommentLengthSorter
}
