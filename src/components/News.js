import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Loader from "./Loader";
import PropTypes from "prop-types";

export class News extends Component {
    pageSize = 5;
    apiKey = process.env.REACT_APP_NEWS_API;
    MAX_PAGES = 10;

    constructor() {
        super();
        this.state = {
            articles: [],
            loading: false,
            page: 1,
            totalArticles: 0,
        };
    }

    componentDidMount() {
        this.fetchNews(1);
    }

    fetchNews = async (page) => {
        this.setState({ loading: true });
        this.props.setProgress(10);
        const { category } = this.props;

        const url = `https://gnews-backend-gohd.onrender.com/api/news?category=${category}&lang=en&country=us&max=${this.pageSize}&page=${page}&apikey=${this.apiKey}`;

        const data = await fetch(url);
        const parsedData = await data.json();
        this.props.setProgress(70);
        const cappedTotalArticles = this.MAX_PAGES * this.pageSize;

        this.setState({
            articles: parsedData.articles || [],
            totalArticles: cappedTotalArticles,
            loading: false,
        });
        this.props.setProgress(100);
    };

    getTotalPages = () => {
        return this.MAX_PAGES;
    };

    handlePrev = () => {
        if (this.state.page > 1) {
            const page = this.state.page - 1;
            this.setState({ page });
            this.fetchNews(page);
        }
    };

    handleNext = () => {
        const totalPages = this.getTotalPages();

        if (this.state.page < totalPages) {
            const page = this.state.page + 1;
            this.setState({ page });
            this.fetchNews(page);
        }
    };

    handlePageClick = (page) => {
        const totalPages = this.getTotalPages();

        if (page >= 1 && page <= totalPages) {
            this.setState({ page });
            this.fetchNews(page);
        }
    };

    capitaliseFirstLetter = (string) => {
        let newString = string.toLowerCase();
        return newString.charAt(0).toUpperCase() + newString.slice(1);
    }

    renderPagination = () => {
        const totalPages = this.getTotalPages();
        const pages = [];

        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <li key={i} className={`page-item ${this.state.page === i ? "active" : ""}`}>
                    <button className="page-link" onClick={() => this.handlePageClick(i)}>{i}</button>
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
        const { heading, category } = this.props;
        const totalPages = this.getTotalPages();

        return (
            <div className="container my-3">
                <h1 className="text-center">{heading} - {this.capitaliseFirstLetter(category)}</h1>

                {this.state.loading && <Loader />}

                <div className="row">
                    {!this.state.loading &&
                        this.state.articles.map((article) => (
                            <div className="col-md-4 my-4" key={article.url}>
                                <NewsItem
                                    title={article.title ? article.title.slice(0, 45) + "..." : ""}
                                    description={article.description ? article.description.slice(0, 88) + "..." : ""}
                                    imgUrl={article.image ? article.image : "https://image.cnbcfm.com/api/v1/image/108247926-1767585652556-gettyimages-51418825-APW2002121786670.jpeg"}
                                    newsUrl={article.url} author={article.source.name ? article.source.name : "Unknown"}
                                    date={new Date(article.publishedAt).toGMTString()}
                                />
                            </div>
                        ))}
                </div>

                <div className="d-flex flex-column flex-sm-row justify-content-center align-items-center my-4 gap-2">
                    <button className="btn btn-dark btn-sm" disabled={this.state.page <= 1} onClick={this.handlePrev}
                    >
                        ← Previous
                    </button>

                    <div className="d-flex justify-content-center flex-wrap">
                        {this.renderPagination()}
                    </div>

                    <button className="btn btn-dark btn-sm" disabled={this.state.page >= totalPages} onClick={this.handleNext}
                    >
                        Next →
                    </button>
                </div>
            </div>
        );
    }
}

News.defaultProps = {
    category: "general",
    heading: "Top Headlines",
};

News.propTypes = {
    category: PropTypes.string,
    heading: PropTypes.string,
};

export default News;