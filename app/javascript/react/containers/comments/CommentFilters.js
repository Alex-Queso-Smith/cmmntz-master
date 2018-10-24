import React from 'react'

import SortSelect from '../../components/filters/SortSelect'

class CommentFilters extends React.Component {
  state = {
    sortOrder: 'desc',
    page: 1
  }

  handleChange = this.handleChange.bind(this);
  handleSubmit = this.handleSubmit.bind(this);

  handleChange(event){
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
      page: 1
    })
  };

  handleSubmit(event){
    //stuff here
  };

  render(){
    var sortOrder = this.state.sortOrder
    return(
      <div className="cf-filter-block">
        <h4>Filters</h4>
        <SortSelect
          name="sortOrder"
          content={this.state.sortOrder}
          onChange={this.handleChange}
        />
      </div>
    )
  }

};
export default CommentFilters
