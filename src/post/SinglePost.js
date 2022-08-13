import React, { Component } from 'react';
import { singlePost, remove, like, unlike } from './apiPost';
import DefaultPost from '../images/mountains.jpg';
import { Link, Redirect } from 'react-router-dom';
import { isAuthenticated } from '../auth';
import Comment from './Comment';

class SinglePost extends Component {
    state = {
        post: '',
        redirectToHome: false,
        redirectToSignin: false,
        like: false,
        likes: 0,
        comments: []
    };

    checkLike = likes => {
        const userId = isAuthenticated() && isAuthenticated().user._id;
        let match = likes.indexOf(userId) !== -1;
        return match;
    };

    componentDidMount = () => {
        const postId = this.props.match.params.postId;
        singlePost(postId).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({
                    post: data,
                    likes: data.likes.length,
                    like: this.checkLike(data.likes),
                    comments: data.comments
                });
            }
        });
    };

    updateComments = comments => {
        this.setState({ comments });
    };

    likeToggle = () => {
        if (!isAuthenticated()) {
            this.setState({ redirectToSignin: true });
            return false;
        }
        let callApi = this.state.like ? unlike : like;
        const userId = isAuthenticated().user._id;
        const postId = this.state.post._id;
        const token = isAuthenticated().token;
        this.setState({like : !this.state.like})
        callApi(userId, token, postId).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({
                    likes: data.likes.length
                });
            }
        });
    };

    deletePost = () => {
        const postId = this.props.match.params.postId;
        const token = isAuthenticated().token;
        remove(postId, token).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ redirectToHome: true });
            }
        });
    };

    deleteConfirmed = () => {
        let answer = window.confirm('Are you sure you want to delete your post?');
        if (answer) {
            this.deletePost();
        }
    };

    renderPost = post => {
        const posterId = post.postedBy ? `/user/${post.postedBy._id}` : '';
        const posterName = post.postedBy ? post.postedBy.name : ' Unknown';

        const { like, likes } = this.state;

        return (
            <div className="card">
                <div className ="card-image box">
                    <div className="columns">
                        <div className="column is-6">
                            <figure className ="image">
                                <img
                                src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                                alt={post.title}
                                onError={i => (i.target.src = `${DefaultPost}`)}
                                className="image "
                                style={{
                                    height: '300px',
                                    width: 'auto',
                                }}
                                />
                            </figure>
                        </div>
                        <div className="column is-5">
                            {like ? (
                            <h3 className='has-text-info' onClick={this.likeToggle}>
                               
                                <i
                                    className="fa fa-thumbs-up text-success bg-dark"
                                    style={{ padding: '10px', borderRadius: '50%', cursor: 'pointer'  }}
                                />{' '}
                                {likes} Like
                            </h3>
                            ) : (
                                <h3  onClick={this.likeToggle}>
                                    <i
                                        className= {`fa fa-thumbs-up text-warning bg-dark `}
                                        style={{ padding: '10px', borderRadius: '50%', cursor: 'pointer' }}
                                    />{' '}
                                    {likes} Like
                                </h3>
                            )}

                            <p className="content">{post.body}</p>
                            <br />
                            <p className="is-family-code">
                                Posted by <Link to={`${posterId}`}>{posterName} </Link>
                                on {new Date(post.created).toDateString()}
                            </p>
                            <div className="buttons">
                                <Link to={`/`} className=" mt-2 button is-rounded is-focused is-dark">
                                    Back to posts
                                </Link>

                            {isAuthenticated().user && isAuthenticated().user._id === post.postedBy._id && (
                                <>
                                    <Link to={`/post/edit/${post._id}`} className=" button is-rounded is-focused is-warning">
                                        Update Post
                                    </Link>
                                    <button onClick={this.deleteConfirmed} className="button is-rounded is-focused is-danger">
                                        Delete Post
                                    </button>
                                </>
                            )}
                            <div>
                                {isAuthenticated().user && isAuthenticated().user.role === 'admin' && (
                                    <div class="card mt-5">
                                        <div className="card-content">
                                            <h5 className="title is-4">Admin</h5>
                                            <p className="mb-2 title is-6 ">Edit/Delete as an Admin</p>
                                            <Link
                                                to={`/post/edit/${post._id}`}
                                                className="button is-rounded is-focused is-warning"
                                            >
                                                Update Post
                                            </Link>
                                            <button onClick={this.deleteConfirmed} className="button is-rounded  is-focused is-danger">
                                                Delete Post
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                    </div>
                </div>
                    
               
               </div>
                    
            </div>
        );
    };

    render() {
        const { post, redirectToHome, redirectToSignin, comments } = this.state;

        if (redirectToHome) {
            return <Redirect to={`/`} />;
        } else if (redirectToSignin) {
            return <Redirect to={`/signin`} />;
        }

        return (
            <div className="container box box-shadow mt-6">
                <h2 className="title is-4 mt-5 mb-5">{post.title}</h2>

                {!post ? (
                            <progress class="progress is-small is-dark" max="100">15%</progress>
                        ) : (
                    this.renderPost(post)
                )}

                <Comment postId={post._id} comments={comments.reverse()} updateComments={this.updateComments} />
            </div>
        );
    }
}

export default SinglePost;
