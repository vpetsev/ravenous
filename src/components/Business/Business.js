import React from "react"
import "./Business.css"
import { Component } from "react"


class Business extends Component{
    render() {
        return (
            <div className="Business">
                <div class="image-container">
                    <img src={this.props.business.imageSrc} alt={this.props.business.name}/>
                </div>
                <h2>{this.props.business.name}</h2>
                <div className="Business-information">
                    <div className="Business-address">
                        <p>{this.props.business.address}</p>
                        <p>{this.props.business.city}</p>
                        <p>{this.props.business.state} {this.props.business.zipCode}</p>
                    </div>
                    <div class="Business-Reviews">
                        <h3>{this.props.business.category}</h3>
                        <h3 className="rating">{this.props.business.rating}</h3>
                        <p>{this.props.business.reviewCount}</p>
                    </div>
                </div>
            </div>
        )
    }
}

export default Business;