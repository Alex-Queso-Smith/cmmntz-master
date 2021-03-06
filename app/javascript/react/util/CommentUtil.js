import React from 'react';

export const CommentLengthSorter = (text, baseImageUrl) => {
  var length = text.length
  var image;
  switch (true) {
    case (length <= 120):
      image = `${baseImageUrl}/images/icons-v2/length1.png`
      break;
    case (length <= 240):
      image = `${baseImageUrl}/images/icons-v2/length2.png`
      break;
    case (length <= 420):
      image = `${baseImageUrl}/images/icons-v2/length3.png`
      break;
    case (length <= 600):
      image = `${baseImageUrl}/images/icons-v2/length4.png`
      break;
    case (length > 600):
      image = `${baseImageUrl}/images/icons-v2/length5.png`
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
