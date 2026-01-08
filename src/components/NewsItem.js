import React, { Component } from 'react'

export class NewsItem extends Component {
  
  render() {
    let {title, description, imgUrl, newsUrl, author, date} = this.props;
    return (
      <div>
        <div className="card" style={{width: '18rem'}}>
            {/* <span className="position-absolute top-0 badge rounded-pill text-bg-danger">{source}</span> */}
            <img src={imgUrl} className="card-img-top" alt={title}/>
            <div className="card-body">
                <h5 className="card-title">{title}</h5>
                <p className="card-text">{description}</p>
                <p className="card-text"><small className="text-body-secondary">By {author} on {date}</small></p>
                <a rel="noreferrer" href={newsUrl} target="_blank" className="btn btn-sm btn-dark">Read More</a>
            </div>
        </div>
      </div>
    )
  }
}

export default NewsItem
