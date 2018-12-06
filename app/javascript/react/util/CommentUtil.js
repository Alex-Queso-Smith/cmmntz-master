import React from 'react';

export const CommentLengthSorter = (text) => {
  var length = text.length
  var image;
  switch (true) {
    case (length <= 250):
      image = '/assets/length1'
      break;
    case (length <= 500):
      image = '/assets/length2'
      break;
    case (length <= 750):
      image = '/assets/length3'
      break;
    case (length <= 1000):
      image = '/assets/length4'
      break;
    case (length > 1000):
      image = '/assets/length5'
      break;
  }

  return image
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
