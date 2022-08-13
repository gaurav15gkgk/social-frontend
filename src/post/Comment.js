import React, { Component } from "react";
import { comment, uncomment } from "./apiPost";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import DefaultProfile from "../images/avatar.png";

class Comment extends Component {
    state = {
        text: "",
        error: ""
    };

    handleChange = event => {
        this.setState({ error: "" });
        this.setState({ text: event.target.value });
    };

    isValid = () => {
        const { text } = this.state;
        if (!text.length > 0 || text.length > 150) {
            this.setState({
                error:
                    "Comment should not be empty and less than 150 characters long"
            });
            return false;
        }
        return true;
    };

    addComment = e => {
        e.preventDefault();

        if (!isAuthenticated()) {
            this.setState({ error: "Please signin to leave a comment" });
            return false;
        }

        if (this.isValid()) {
            const userId = isAuthenticated().user._id;
            const token = isAuthenticated().token;
            const postId = this.props.postId;

            comment(userId, token, postId, { text: this.state.text }).then(
                data => {
                    if (data.error) {
                        console.log(data.error);
                    } else {
                        this.setState({ text: "" });
                        // dispatch fresh list of coments to parent (SinglePost)
                        this.props.updateComments(data.comments);
                    }
                }
            );
        }
    };

    deleteComment = comment => {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        const postId = this.props.postId;

        uncomment(userId, token, postId, comment).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.props.updateComments(data.comments);
            }
        });
    };

    deleteConfirmed = comment => {
        let answer = window.confirm(
            "Are you sure you want to delete your comment?"
        );
        if (answer) {
            this.deleteComment(comment);
        }
    };

    render() {
        const { comments } = this.props;
        const { error } = this.state;

        return (
            <div className ="box box-shadow container mt-6">
                <h2 className="is-size-4 has-text-weight-semibold ">Leave a comment</h2>

                <form onSubmit={this.addComment}>
                    <div className="field mt-3">
                        <input
                            type="text"
                            onChange={this.handleChange}
                            value={this.state.text}
                            className="input is-rounded"
                            placeholder="Leave a comment..."
                        />
                        <button className="button is-rounded is-focused is-info mt-3">
                            Post
                        </button>
                    </div>
                </form>

                <div className="notification is-danger"
                    style={{ display: error ? "" : "none" }}
                >
                    {error}
                </div>

                <div className="box box-shadow mt-6">
                    <h3 className="is-size-4 has-text-weight-semibold">{comments.length} Comments</h3>
                    <hr />
                    {comments.map((comment, i) => (
                        <div key={i}>
                        <div className ="columns ">

                                <Link to={`/user/${comment.postedBy._id}`} className="column is-1">
                                        
                                        <img
                                            
                                            className=" image "
                                            height="auto"
                                            width="60px"
                                            onError={i =>
                                                (i.target.src = `${DefaultProfile}`)
                                            }
                                            src={`${
                                                process.env.REACT_APP_API_URL
                                            }/user/photo/${comment.postedBy._id}`}
                                            alt={comment.postedBy.name}
                                        />
                                </Link>

                            <div className ="column">
                                <div className="columns ">
                                <div className="column is-8 ">
                                        <p className="is-size-6 is-size-7-mobile">{comment.text}</p>
                                            <p className="is-family-code is-size-7-mobile">
                                                Posted by{" "}
                                                <Link
                                                    to={`/user/${comment.postedBy._id}`}
                                                >
                                                    {comment.postedBy.name}{" "}
                                                </Link>
                                                on{" "}
                                                    {new Date(
                                                        comment.created
                                                    ).toDateString()}
                                            </p>
                                </div>
                               
                                            <div className="column">
                                                {isAuthenticated().user &&
                                                    isAuthenticated().user._id ===
                                                        comment.postedBy._id && (
                                                        <>
                                                            <span
                                                                onClick={() =>
                                                                    this.deleteConfirmed(
                                                                        comment
                                                                    )
                                                                }
                                                                className="button is-rounded is-danger is-focused"
                                                            >
                                                                Remove
                                                            </span>
                                                        </>
                                                    )}
                                            </div>
                                       
                                    
                                </div>
                                </div>
                                
                                    
                            
                                
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default Comment;
