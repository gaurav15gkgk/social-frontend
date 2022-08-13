import React, { Component } from "react";
import { findPeople, follow } from "./apiUser";
import DefaultProfile from "../images/avatar.png";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth";

class FindPeople extends Component {
    constructor() {
        super();
        this.state = {
            users: [],
            error: "",
            open: false
        };
    }

    componentDidMount() {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;

        findPeople(userId, token).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ users: data });
            }
        });
    }

    clickFollow = (user, i) => {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;

        follow(userId, token, user._id).then(data => {
            if (data.error) {
                this.setState({ error: data.error });
            } else {
                let toFollow = this.state.users;
                toFollow.splice(i, 1);
                this.setState({
                    users: toFollow,
                    open: true,
                    followMessage: `Following ${user.name}`
                });
            }
        });
    };

    renderUsers = users => (
        <div className="columns is-multiline">
            {users.map((user, i) => (
                <div className="card column is-one-quarter  mt-2 has-text-centered" key={i}>
                     <div className ="card-image">
                        <figure className ="image" style={{paddingLeft: "35%", paddingTop:"10%", }}>
                        
                            <img
                                style={{ height: "auto", width: "50%" }}
                          
                                src={`${process.env.REACT_APP_API_URL}/user/photo/${
                                    user._id
                                }`}
                                onError={i => (i.target.src = `${DefaultProfile}`)}
                                alt={user.name}
                            />
                        </figure>
                    </div>
                    <div className="card-content">
                        <div><strong>{user.name}</strong></div>
                        <div >{user.email}</div>
                        <Link
                            to={`/user/${user._id}`}
                            className="button is-dark is-rounded is-focused mx-2"
                            style={{marginTop: "1vh"}}
                        >
                            View Profile
                        </Link>

                        <button
                            onClick={() => this.clickFollow(user, i)}
                            className="button is-info is-rounded is-focused"
                            style={{marginTop: "1vh"}}
                        >
                            Follow
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );

    render() {
        const { users, open, followMessage } = this.state;
        return (
            <div className="container box box-shadow mt-6">
                <h2 className="title">Find People</h2>

                {open && (
                    <div className="notification is-info">{followMessage}</div>
                )}

                {this.renderUsers(users)}
            </div>
        );
    }
}

export default FindPeople;
