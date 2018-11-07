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

  return SortTypes.map((type) => {
    var opacity, visibility, image;
    var image = ImageSelector(type[1])

    sortType == type[0] ? opacity = "" : opacity = "translucent"

    return(
      <SortButton
        key={`sort_${type[1]}`}
        value={type[0]}
        opacity={opacity}
        onClick={object.props.handleFilterSubmit}
        image={image}
        visibility={''}
        />
    )
  })
}

export const RowOneFilterTypes = [
  ["blank1", "blank1"],
  ["blank2", "blank2"],
  ["top", "Top"],
  ["love", "Love"],
  ["like_a_lot", "Like A Lot"],
  ["like", "Like"],
  ["indifferent", "Indifferent"],
  ["dislike", "Dislike"],
  ["dislike_a_lot", "Dislike A Lot"],
  ["trash", "Trash"],
  ["warn", "Warn"],
  ["blank3", "blank3"]
]

export const FilterButtonsRowOne = (object) => {
  return RowOneFilterTypes.map((type) => {
    var image, visibility;
    var opacity = OpacityHandlerIncludes(object.props.sortOpts.filterList, `${type[0]}_percent`)

    if (!type[0].includes('blank')) {
      image = ImageSelector(type[0])
    }

    if (type[0].includes('blank')) {
      visibility = "visibility-hidden"
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

export const RowTwoFilterTypes = [
  ["blank1", "blank1"],
  ["blank2", "blank2"],
  ["blank3", "blank3"],
  ["smart", "Smart"],
  ["funny", "Funny"],
  ["happy", "Happy"],
  ["shocked", "Shocked"],
  ["sad", "Sad"],
  ["boring", "Boring"],
  ["angry", "Angry"],
  ["blank4", "blank4"]
]

export const FilterButtonsRowTwo = (object) => {
  return RowTwoFilterTypes.map((type) => {
    var image, visibility;
    var opacity = OpacityHandlerIncludes(object.props.sortOpts.filterList, `${type[0]}_percent`)

    if (!type[0].includes('blank')) {
      image = ImageSelector(type[0])
    }

    if (type[0].includes('blank')){
      visibility = "visibility-hidden"
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
