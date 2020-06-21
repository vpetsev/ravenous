import React, { Component } from 'react';
import './App.css';
import Business from "../Business/Business"
import BusinessList from "../BusinessList/BusinessList"
import SearchBar from "../SearchBar/SearchBar"
import Yelp from "../../util/Yelp"

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      businesses: []
    }

    this.searchYelp = this.searchYelp.bind(this)
  }

  searchYelp(term, location, sortBy) {
    Yelp.search(term, location, sortBy)
      .then((businesses) => {
        this.setState({
          businesses: businesses
        })
    })
  }

  render() {
    return (
      <div>
        <h1>ravenous</h1>
        <SearchBar searchYelp={this.searchYelp}/>
        <BusinessList businesses={this.state.businesses}/>
      </div>
    )
  }
}

export default App;
