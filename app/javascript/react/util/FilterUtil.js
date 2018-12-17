import React from "react"

import { SortDir, SortButton, FilterFromButton } from '../components/filters/SortSelect'
import { ImageSelector } from './VoteUtil';

export const ImageSelectorTemp = (filterList, notFilterList, type) => {

  if (filterList.includes(`${type}_percent`)) {
    return `/assets/${type}-selected`
  } else if (notFilterList.includes(`${type}_percent`)) {
    return  `/assets/${type}-unselected`
  } else {
    return `/assets/${type}`
  }
}

export const SortTypes = [
  ["top_percent", "top", "Top"],
  ["love_percent", "love", "Love"],
  ["like_score", "like", "Like"],
  ["smart_percent", "smart", "Smart"],
  ["funny_percent", "funny", "Funny"],
  ["created_at", "created_at", "Comment Date"],
  ["comment_length", "length2", "Comment Length"]
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
        className="tooltip-container"
        title={type[2]}
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
  ["warn", "Flag"]
]

export const FilterButtonsRowOne = (object) => {
  return RowOneFilterTypes.map((type) => {
    var visibility, blankClass;

    var image = ImageSelectorTemp(object.props.sortOpts.filterList, object.props.sortOpts.notFilterList, type[0])
    var tooltipClass = "tooltip-container"

    var handleFilterClickParent = (event) => {
      object.props.handleFilterClick(event)
      if (object.props.sortOpts.setFrom === "gallery") {
        object.props.handleShowFilterModal()
      }
    }

    return(
      <SortButton
        key={`filter_${type[1]}`}
        className={`${tooltipClass}`}
        value={`${type[0]}_percent`}
        onClick={handleFilterClickParent}
        image={image}
        visibility={visibility}
        />
    )
  })
}

export const RowTwoFilterTypes = [
  ["smart", "Smart"],
  ["funny", "Funny"],
  ["happy", "Happy"],
  ["shocked", "Shocked"],
  ["sad", "Sad"],
  ["boring", "Boring"],
  ["angry", "Angry"]
]

export const FilterButtonsRowTwo = (object) => {
  return RowTwoFilterTypes.map((type) => {
    var visibility, tooltipClass;

    var image = ImageSelectorTemp(object.props.sortOpts.filterList, object.props.sortOpts.notFilterList, type[0])
    var tooltipClass = "tooltip-container"

    var handleFilterClickParent = (event) => {
      object.props.handleFilterClick(event)
      if (object.props.sortOpts.setFrom === "gallery") {
        object.props.handleShowFilterModal()
      }
    }

    return(
      <SortButton
        key={`filter_${type[1]}`}
        className={`${tooltipClass}`}
        value={`${type[0]}_percent`}
        onClick={handleFilterClickParent}
        image={image}
        visibility={visibility}
        />
    )
  })

}
export const FilterFromTypes = [
  ["", "Everyone"],
  ["network", "Network"],
  ["friends", "Friends"]
]

export const FilterCommentsBy = (props) => {
  return(
    FilterFromTypes.map((type) => {
      var opacity = props.commentsFrom == type[0] ? "" : "translucent"
      return(
        <FilterFromButton
          key={`filter_from_${type[1]}`}
          title={type[1]}
          name="commentsFrom"
          onClick={props.onClick}
          value={type[0]}
          opacityClass={opacity}
        />
      )
    })
  )
}

export const FilterVotesBy = (props) => {
  return(
    FilterFromTypes.map((type) => {
      var opacity = props.votesFrom == type[0] ? "" : "translucent"
      return(
        <FilterFromButton
          key={`filter_from_${type[1]}`}
          title={type[1]}
          name="votesFrom"
          onClick={props.onClick}
          value={type[0]}
          opacityClass={opacity}
        />
      )
    })
  )
}
