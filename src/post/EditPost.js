import React, { Component } from "react";
import { singlePost, update } from "./apiPost";
import { isAuthenticated } from "../auth";
import { Redirect } from "react-router-dom";
import DefaultPost from "../images/mountains.jpg";

class EditPost extends Component {
    constructor() {
        super();
        this.state = {
            id: "",
            title: "",
            body: "",
            post:"",
            redirectToProfile: false,
            error: "",
            fileSize: 0,
            loading: false,
            updatedPostPicURL : ""
        };
    }

    init = postId => {
        singlePost(postId).then(data => {
            if (data.error) {
                this.setState({ redirectToProfile: true });
            } else {
                this.setState({
                    post: data,
                    id: data.postedBy._id,
                    title: data.title,
                    body: data.body,
                    error: ""
                });
            }
        });
    };

    componentDidMount() {
        this.postData = new FormData();
        const postId = this.props.match.params.postId;
        this.init(postId);
    }

    isValid = () => {
        const { title, body, fileSize } = this.state;
        if (fileSize > 1000000) {
            this.setState({
                error: "File size should be less than 1MB",
                loading: false
            });
            return false;
        }
        if (title.length === 0 || body.length === 0) {
            this.setState({ error: "All fields are required", loading: false });
            return false;
        }
        return true;
    };

    handleChange = name => event => {
        this.setState({ error: "" });
        const value =
            name === "photo" ? event.target.files[0] : event.target.value;
        
        if(name === "photo"){
            this.setState({updatedPostPicURL : URL.createObjectURL(value)})
            }
        const fileSize = name === "photo" ? event.target.files[0].size : 0;
        this.postData.set(name, value);
        this.setState({ [name]: value, fileSize });
    };

    clickSubmit = event => {
        event.preventDefault();
       
        this.setState({ loading: true });
        

        if (this.isValid()) {
            const postId = this.props.match.params.postId;
            const token = isAuthenticated().token;
            console.log(postId)

            update(postId, token, this.postData).then(data => {
                if (data.error) this.setState({ error: data.error });
                else {
                    this.setState({
                        loading: false,
                        title: "",
                        body: "",
                        redirectToProfile: true
                    });
                }
            });
        }
    };

    photoRemove = () => {
        this.setState({updatedPostPicURL : ""})
        this.setState({photo : ""})
        this.setState({fileSize : 0})
        this.postData.delete('photo')
    }

    editPostForm = (title, body) => (
        <>
            <div className="field mt-3">
                <label className="label"> Change Post Photo</label>
                {this.state.updatedPostPicURL == "" ?<div class="file">
                        <label class="file-label">
                            <input className="file-input" type="file" name="resume" 
                            onChange={this.handleChange("photo")}
                            accept="image/*"
                            />
                            <span className="file-cta">
                                <span className="file-icon">
                                    <i className="fas fa-upload"></i>
                                </span>
                                <span className="file-label">
                                     Choose a file…
                                </span>
                            </span>
                            
                        </label>
                </div>:<button onClick={() => this.photoRemove()}  className="button is-rounded is-danger">
         Remove
        </button> }
            </div>

            <div className="field">
                <label className="label">Title</label>
                <input
                    onChange={this.handleChange("title")}
                    type="text"
                    className="input is-rounded"
                    value={title}
                />
            </div>

            <div className="field">
                <label className="label">Body</label>
                <textarea
                    onChange={this.handleChange("body")}
                    type="text"
                    className="textarea is-info"
                    value={body}
                />
            </div>

            <button
                onClick={this.clickSubmit}
                className="button is-rounded is-warning"
            >
                Update Post
            </button>
        </>
    );

    render() {
        const {
            id,
            title,
            body,
            redirectToProfile,
            error,
            loading,
            post
        } = this.state;
        console.log(id)
        if (redirectToProfile) {
            return <Redirect to={`/user/${isAuthenticated().user._id}`} />;
        }

        const photoUrl = `${process.env.REACT_APP_API_URL}/post/photo/${post._id}`

        return (
            <div className="container box box-shadow mt-6">
                <h2 className="title">{title}</h2>

                <div className="notification is-danger"
                        style={{ display: error ? "" : "none" }}
                        >
                        {error}
                    </div>

                        {loading ?(
                            <progress class="progress is-small is-dark" max="100">15%</progress>
                            ):("")}
                
                            <figure className ="image">
                                <img
                                src={this.state.updatedPostPicURL == "" ? photoUrl : this.state.updatedPostPicURL}
                                alt={post.title}
                                onError={i => (i.target.src = `${DefaultPost}`)}
                                className="image "
                                style={{
                                    height: '300px',
                                    width: 'auto',
                                }}
                                />
                            </figure>


                {isAuthenticated().user.role === "admin" &&
                    this.editPostForm(title, body)}

                {isAuthenticated().user._id === id &&
                    this.editPostForm(title, body)}
            </div>
        );
    }
}

export default EditPost;
