import React, { Component } from "react";
import { Link } from "react-router-dom";
import DefaultProfile from "../images/avatar.png";

class ProfileTabs extends Component {
    render() {
        const { following, followers, posts } = this.props;
        return (
            <div className="mt-4">
                <div className="columns">
                    <div className="column is-one-third">
                        <h3 className="is-size-4 has-text-weight-semibold">
                            {followers.length} Followers
                        </h3>
                        <hr />
                        
                        {followers.map((person, i) => (
                            <div key={i}>
                                <div className ="mt-2">
                                    <Link className="columns is-mobile" to={`/user/${person._id}`}>
                                        <img
                                            
                                            className="image column is-2 "
                                            height="50px"
                                            width="auto"
                                            onError={i =>
                                                (i.target.src = `${DefaultProfile}`)
                                            }
                                            src={`${
                                                process.env.REACT_APP_API_URL
                                            }/user/photo/${person._id}`}
                                            alt={person.name}
                                        />
                                        <div>
                                            <div className="is-size-5 column">
                                                {person.name}
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="column is-one-third">
                        <h3 className="is-size-4 has-text-weight-semibold">
                            {following.length} Following
                        </h3>
                        <hr />
                        
                        {following.map((person, i) => (
                            <div key={i} >
                                <div >
                                    <Link className="columns is-mobile" to={`/user/${person._id}`}>
                                        <img
                                           
                                            className="image column is-2"
                                            height="50px"
                                            width="auto"
                                            onError={i =>
                                                (i.target.src = `${DefaultProfile}`)
                                            }
                                            src={`${
                                                process.env.REACT_APP_API_URL
                                            }/user/photo/${person._id}`}
                                            alt={person.name}
                                        />
                                        <div>
                                            <p className="is-size-5 mt-2">
                                                {person.name}
                                            </p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="column is-one-third">
                        <h3 className="is-size-4 has-text-weight-semibold">{posts.length} Posts</h3>
                        <hr />
                        {posts.map((post, i) => (
                            <div key={i}>
                                <div>
                                    <Link to={`/post/${post._id}`}>
                                        <div>
                                            <p className="is-size-5">{post.title}</p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default ProfileTabs;
