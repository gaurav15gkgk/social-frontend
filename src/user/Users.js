import React, { Component } from "react";
import { list } from "./apiUser";

import { Link } from "react-router-dom";
import DefaultProfile from "../images/avatar.png"

class Users extends Component {
    constructor() {
        super();
        this.state = {
            users: []
        };
    }

    componentDidMount() {
        list().then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ users: data });
            }
        });
    }

    renderUsers = users => (
        <div className="columns is-multiline is-variable is-2">
            {users.map((user, i) => (
                <div className="card  column  is-one-quarter mt-2 has-text-centered" key={i}>
                    <div className ="card-image  has-text-centered " >
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
                            className="button is-rounded is-black is-focused"
                            style={{marginTop: "1vh"}}
                        >
                            View Profile
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );

    render() {
        const { users } = this.state;
        return (
            <div className="container box box-shadow mt-6">
                <h2 className="title">Users</h2>
                
                {this.renderUsers(users)}
            </div>
        );
    }
}

export default Users;
