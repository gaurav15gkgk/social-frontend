import React, { Component } from "react";
import { list } from "./apiPost";
import DefaultPost from "../images/mountains.jpg";
import { Link } from "react-router-dom";

class Posts extends Component {
    constructor() {
        super();
        this.state = {
            posts: [],
            page: 1
        };
    }

    loadPosts = page => {
        list(page).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ posts: data });
            }
        });
    };

    componentDidMount() {
        this.loadPosts(this.state.page);
    }

    loadMore = number => {
        this.setState({ page: this.state.page + number });
        this.loadPosts(this.state.page + number);
    };

    loadLess = number => {
        this.setState({ page: this.state.page - number });
        this.loadPosts(this.state.page - number);
    };

    renderPosts = posts => {
        return (
           <>
                {posts.map((post, i) => {
                    const posterId = post.postedBy
                        ? `/user/${post.postedBy._id}`
                        : "";
                    const posterName = post.postedBy
                        ? post.postedBy.name
                        : " Unknown";

                    return (
                        <div className="card column is-one-third mt-2" key={i}>
                            <div className = "card-image has-text-centered " >
                            <figure class="image  is-inline-block">
                            <img
                                    src={`${
                                        process.env.REACT_APP_API_URL
                                    }/post/photo/${post._id}`}
                                    alt={post.title}
                                    onError={i =>
                                        (i.target.src = `${DefaultPost}`)
                                    }
                                   
                                    style={{ height: "300px", width: "auto" }}
                                />
                            </figure>
                           
                            </div>
                            <div className = "card-content">
                            <h5 className="card-title"> <strong>{post.title}</strong></h5>
                                <p className="content">
                                    {post.body.substring(0, 100)}
                                </p>
                                <br />
                                <div className = "content">
                                <p className="is-family-monospace content has-text-weight-semibold">
                                    Posted by{" "}
                                    <Link to={`${posterId}`}>
                                        {posterName}{" "}
                                    </Link>
                                    on {new Date(post.created).toDateString()}
                                </p>
                                </div>
                                
                            
                                <Link
                                    to={`/post/${post._id}`}
                                    className="button is-rounded is-black "
                                >
                                    Read more
                                </Link>
                            </div>
                               
                          
                        </div>
                    );
                })}
            </>
        );
    };

    render() {
        const { posts, page } = this.state;
        return (
            <div className="container box">
                <h2 className="title">
                    {!posts.length ? "No more posts!" : "Recent Posts"}
                </h2>
                <div className ="columns is-multiline">
                    {this.renderPosts(posts)}
                </div>

               

                {page > 1 ? (
                    <button
                        className="button is-rounded is-warning"
                        onClick={() => this.loadLess(1)}
                    >
                        Previous ({this.state.page - 1})
                    </button>
                ) : (
                    ""
                )}

                {posts.length ? (
                    <button
                        className="button is-rounded is-black"
                        onClick={() => this.loadMore(1)}
                    >
                        Next ({page + 1})
                    </button>
                ) : (
                    ""
                )}
            </div>
        );
    }
}

export default Posts;
