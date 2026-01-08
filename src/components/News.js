import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Loader from "./Loader";
import PropTypes from 'prop-types'

export class News extends Component {
    pageSize = 5;
    apiKey = "bc6632f5aa424cb38e3896effe8b9d62";

    constructor() {
        super();
        this.state = {
            articles: [],
            loading: false,
            page: 1,
            totalResults: 0
        };
    }

    componentDidMount() {
        this.fetchNews(this.state.page);
    }

    fetchNews = async (page) => {
        this.setState({ loading: true });

        const { category } = this.props;
        const url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${this.apiKey}&page=${page}&pageSize=${this.pageSize}`;
        const data = await fetch(url);
        const parsedData = await data.json();

        this.setState({
            articles: parsedData.articles || [],
            totalResults: parsedData.totalResults || 0,
            loading: false
        });
    };

    handlePrev = () => {
        const page = this.state.page - 1;
        this.setState({ page });
        this.fetchNews(page);
    };

    handleNext = () => {
        const page = this.state.page + 1;
        this.setState({ page });
        this.fetchNews(page);
    };

    handlePageClick = (page) => {
        this.setState({ page });
        this.fetchNews(page);
    };

    renderPagination = () => {
        const totalPages = Math.ceil(this.state.totalResults / this.pageSize);
        const pages = [];

        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <li key={i} className={`page-item ${this.state.page === i ? "active" : ""}`}>
                    <button className="page-link" onClick={() => this.handlePageClick(i)}>
                        {i}
                    </button>
                </li>
            );
        }

        return (
            <nav>
                <ul className="pagination justify-content-center flex-wrap mb-0">
                    {pages}
                </ul>
            </nav>
        );
    };

    render() {
        const { heading } = this.props;
        const totalPages = Math.ceil(this.state.totalResults / this.pageSize);

        return (
            <div className="container my-3">
                <h1 className="text-center">{heading}</h1>
                {this.state.loading && <Loader/>}
                <div className="row">
                    {!this.state.loading && this.state.articles.map((article) => (
                        <div className="col-md-4 my-4" key={article.url}>
                            <NewsItem
                                title={article.title ? article.title.slice(0, 45) + "..." : ""}
                                description={article.description ? article.description.slice(0, 88) + "..." : ""}
                                imgUrl={
                                    article.urlToImage? article.urlToImage : "https://image.cnbcfm.com/api/v1/image/108247926-1767585652556-gettyimages-51418825-APW2002121786670.jpeg"
                                }
                                newsUrl={article.url} author={article.author ? article.author : "Unknown"} date={new Date(article.publishedAt).toGMTString()}
                                source={article.source.name}
                            />
                        </div>
                    ))}
                </div>

                <div className="d-flex flex-column flex-sm-row justify-content-center align-items-center my-4 gap-2">
                    <button className="btn btn-dark btn-sm" disabled={this.state.page <= 1} onClick={this.handlePrev}>
                        ← Previous
                    </button>

                    <div className="d-flex justify-content-center flex-wrap">
                        {this.renderPagination()}
                    </div>

                    <button className="btn btn-dark btn-sm" disabled={this.state.page >= totalPages} onClick={this.handleNext}>
                        Next →
                    </button>
                </div>
            </div>
        );
    }
}

News.defaultProps = {
  category: "general",
  heading: "Top Headlines"
};

News.propTypes = {
  category: PropTypes.string,
  heading: PropTypes.string
};

export default News;