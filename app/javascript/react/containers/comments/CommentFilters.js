import React from 'react'

import SortSelect from '../../components/filters/SortSelect'

class CommentFilters extends React.Component {
  state = {
    sortOrder: 'desc',
    page: 1
  }

  handleChange = this.handleChange.bind(this);
  handleFilterSubmit = this.handleFilterSubmit.bind(this)

  handleChange(event){
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
      page: 1
    })
    debugger
  };

  handleFilterSubmit(event){
    this.handleChange(event)
    debugger
    this.props.handleSubmit(event, this.state.sortOrder, this.state.page);
  }



  render(){
    var sortOrder = this.state.sortOrder
    return(
      <div className="cf-filter-block">
        <h4>Filters</h4>
        <SortSelect
          name="sortOrder"
          content={this.state.sortOrder}
          onChange={this.handleFilterSubmit}
        />
      </div>
    )
  }

};
export default CommentFilters
