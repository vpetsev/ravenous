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
      businesses: [],
      error: null
    }

    this.searchYelp = this.searchYelp.bind(this)
  }

  searchYelp(term, location, sortBy) {
    Yelp.search(term, location, sortBy)
      .then((businesses) => {
        this.setState({
          businesses: businesses,
          error: null
        })
    }).catch(() => {
      this.setState({ error: "Unable to search businesses. Please try again." })
    })
  }

  render() {
    return (
      <div>
        <h1>ravenous</h1>
        <SearchBar searchYelp={this.searchYelp}/>
        {this.state.error && <p role="alert">{this.state.error}</p>}
        <BusinessList businesses={this.state.businesses}/>
      </div>
    )
  }
}

export default App;
