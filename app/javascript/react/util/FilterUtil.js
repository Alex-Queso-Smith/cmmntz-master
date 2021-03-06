import React from "react"

import { SortDir, SortButton, FilterFromButton } from '../components/filters/SortSelect'
import { ImageSelector } from './VoteUtil';

export const ImageSelectorTemp = (filterList, notFilterList, type, baseImageUrl) => {

  if (filterList.includes(`${type}_percent`)) {
    return `${baseImageUrl}/images/icons-v2/${type}-selected.png`
  } else if (notFilterList.includes(`${type}_percent`)) {
    return  `${baseImageUrl}/images/icons-v2/${type}-unselected.png`
  } else {
    return `${baseImageUrl}/images/icons-v2/${type}.png`
  }
}

export const SortTypes = [
  ["top_percent", "top", "Top"],
  ["love_percent", "love", "Love"],
  ["like_score", "like", "Like"],
  ["smart_percent", "smart", "Smart"],
  ["funny_percent", "funny", "Funny"],
  ["created_at", "created_at", "Date"],
  ["comment_length", "length2", "Length"]
]

export const SortButtons = (object) => {
  var { sortDir, sortType } = object.props.sortOpts;

  return SortTypes.map((type) => {
    var opacity, visibility, image;
    var image = ImageSelector(type[1], object.props.globalSettings.baseImageUrl)

    sortType == type[0] ? opacity = "" : opacity = "cf-translucent"

    return(
      <SortButton
        key={`sort_${type[1]}`}
        value={type[0]}
        opacity={opacity}
        onClick={object.props.handleFilterSubmit}
        image={image}
        visibility={''}
        tooltipClass={'cf-tooltip-container'}
        className=""
        title={type[2]}
        row="top"
        />
    )
  })
}
export const UserSortButtons = (object) => {
  var { sortDir, sortType } = object.props.sortOpts;

  return SortTypes.map((type) => {
    var opacity, visibility, image;
    var image = ImageSelector(type[1], object.props.globalSettings.baseImageUrl)

    sortType == type[0] ? opacity = "" : opacity = "cf-translucent"

    return(
      <SortButton
        key={`sort_${type[1]}`}
        value={type[0]}
        opacity={opacity}
        onClick={object.props.handleChange}
        image={image}
        visibility={''}
        className="cf-tooltip-container"
        title={type[2]}
        row="top"
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

    var image = ImageSelectorTemp(object.props.sortOpts.filterList, object.props.sortOpts.notFilterList, type[0], object.props.globalSettings.baseImageUrl)

    var handleFilterClickParent = (event) => {
      object.props.handleFilterClick(event)
      if (object.props.sortOpts.setFrom === "gallery") {
        object.props.handleShowFilterModal()
      }
    }

    return(
      <SortButton
        key={`filter_${type[1]}`}
        tooltipClass={"cf-tooltip-container"}
        className=""
        value={`${type[0]}_percent`}
        onClick={handleFilterClickParent}
        image={image}
        visibility={visibility}
        title={`${type[1]}`}
        row="top"
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

    var image = ImageSelectorTemp(object.props.sortOpts.filterList, object.props.sortOpts.notFilterList, type[0], object.props.globalSettings.baseImageUrl)

    var handleFilterClickParent = (event) => {
      object.props.handleFilterClick(event)
      if (object.props.sortOpts.setFrom === "gallery") {
        object.props.handleShowFilterModal()
      }
    }

    return(
      <SortButton
        key={`filter_${type[1]}`}
        className={`cf-margin-bottom-15px`}
        tooltipClass="cf-tooltip-container"
        value={`${type[0]}_percent`}
        onClick={handleFilterClickParent}
        image={image}
        visibility={visibility}
        title={`${type[1]}`}
        row="bottom"
        />
    )
  })

}
export const FilterFromTypes = [
  ["", "Everyone"],
  ["friends", "Starred"]
]

export const FilterCommentsBy = (props) => {
  return(
    FilterFromTypes.map((type) => {
      var opacity = props.commentsFrom == type[0] ? "" : "cf-translucent"
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

export const TopicFilterButtons = (props) => {
  var topicButtons =
  props.topics.map((topic) => {
    var opacity = props.selectedTopic == topic ? "" : "cf-translucent"
    return(
      <FilterFromButton
        key={`topic_button_${topic}`}
        title={topic}
        name="selectedTopic"
        onClick={props.onClick}
        value={topic}
        opacityClass={opacity}
        extraClass="cf-topic-button"
      />
    )
  })
  var articleOpacity = props.selectedTopic == '' ? "" : "cf-translucent"
  return(
    <div className="row cf-margin-bottom-10px">
      <div className="col-12">
        <FilterFromButton
          title="This Article"
          name="selectedTopic"
          onClick={props.onClick}
          value=""
          opacityClass={articleOpacity}
          extraClass="cf-topic-button"
        />
        {topicButtons}
      </div>
    </div>
  )
}

export const FilterVotesBy = (props) => {
  return(
    FilterFromTypes.map((type) => {
      var opacity = props.votesFrom == type[0] ? "" : "cf-translucent"
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
