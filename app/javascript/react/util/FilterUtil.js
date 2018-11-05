import React from "react"

import { SortDir, SortButton } from '../components/filters/SortSelect'
import { ImageSelector } from './VoteUtil';

export const OpacityHandlerIncludes = (list, type) => {
  if (list.includes(type)) {
    return ""
  } else {
    return "translucent"
  }
}

export const SortTypes = [
  ["top_count", "top"],
  ["love_count", "love"],
  ["like_score", "like"],
  ["smart_count", "smart"],
  ["funny_count", "funny"],
  ["created_at", "created_at"],
  ["comment_length", "length"]
]

export const SortButtons = (object) => {
  var { sortDir, sortType } = object.props.sortOpts
  var opacity;

  return SortTypes.map((type) => {
    var image = ImageSelector(type[1])

    sortType == type[0] ? opacity = "" : opacity = "translucent"

    return(
      <SortButton
        key={`sort_${type[1]}`}
        value={type[0]}
        opacity={opacity}
        onClick={object.props.handleFilterSubmit}
        image={image}
        visibility=''
        />
    )
  })
}

export const RowOneFilterTypes = [
  ["top", "Top"],
  ["love", "Love"],
  ["like_a_lot", "Like A Lot"],
  ["like", "Like"],
  ["indifferent", "Indifferent"],
  ["dislike", "Dislike"],
  ["dislike_a_lot", "Dislike A Lot"],
  ["trash", "Trash"],
  ["warn", "Warn"]
]

export const FilterButtonsRowOne = (object) => {
  return RowOneFilterTypes.map((type) => {
    var image = ImageSelector(type[0])
    var opacity = OpacityHandlerIncludes(object.props.sortOpts.filterList, `${type[0]}_percent`)

    return(
      <SortButton
        key={`filter_${type[1]}`}
        value={`${type[0]}_percent`}
        opacity={opacity}
        onClick={object.props.handleFilterClick}
        image={image}
        visibility=''
        />
    )
  })
}

export const RowTwoFilterTypes = [
  ["blank1", "blank1"],
  ["smart", "Smart"],
  ["funny", "Funny"],
  ["happy", "Happy"],
  ["shocked", "Shocked"],
  ["sad", "Sad"],
  ["boring", "Boring"],
  ["angry", "Angry"],
  ["blank2", "blank2"]
]

export const FilterButtonsRowTwo = (object) => {
  return RowTwoFilterTypes.map((type) => {
    var visibility;
    var image = ImageSelector(type[0])
    var opacity = OpacityHandlerIncludes(object.props.sortOpts.filterList, `${type[0]}_percent`)

    if (type[0] == "blank1" || type[0] == "blank2"){
      visibility = "visibility-hidden"
    } else {
      visibility = ""
    }

    return(
      <SortButton
        key={`filter_${type[1]}`}
        value={`${type[0]}_percent`}
        opacity={opacity}
        onClick={object.props.handleFilterClick}
        image={image}
        visibility={visibility}
        />
    )
  })
}
