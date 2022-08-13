import React, { Component } from "react";

import {  Redirect } from "react-router-dom";
import { signin, authenticate } from "../auth";


class Signin extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            error: "",
            redirectToReferer: false,
            loading: false,
            recaptcha: false
        };
    }

    handleChange = name => event => {
        this.setState({ error: "" });
        this.setState({ [name]: event.target.value });
    };

    recaptchaHandler = e => {
        this.setState({ error: "" });
        let userDay = e.target.value.toLowerCase();
        let dayCount;

        if (userDay === "sunday") {
            dayCount = 0;
        } else if (userDay === "monday") {
            dayCount = 1;
        } else if (userDay === "tuesday") {
            dayCount = 2;
        } else if (userDay === "wednesday") {
            dayCount = 3;
        } else if (userDay === "thursday") {
            dayCount = 4;
        } else if (userDay === "friday") {
            dayCount = 5;
        } else if (userDay === "saturday") {
            dayCount = 6;
        }

        if (dayCount === new Date().getDay()) {
            this.setState({ recaptcha: true });
            return true;
        } else {
            this.setState({
                recaptcha: false
            });
            return false;
        }
    };

    clickSubmit = event => {
        event.preventDefault();
        this.setState({ loading: true });
        const { email, password } = this.state;
        const user = {
            email,
            password
        };
        // console.log(user);
        if (this.state.recaptcha) {
            signin(user).then(data => {
                if (data.error) {
                    this.setState({ error: data.error, loading: false });
                } else {
                    // authenticate
                    authenticate(data, () => {
                        this.setState({ redirectToReferer: true });
                    });
                }
            });
        } else {
            this.setState({
                loading: false,
                error: "What day is today? Please write a correct answer!"
            });
        }
    };

    signinForm = (email, password, recaptcha) => (
        <form className = "mt-3">
            <div className="field">
                <label className="label">Email</label>
                <div className = "control has-icons-left has-icons-right">
                <input
                    onChange={this.handleChange("email")}
                    type="email"
                    className="input is-rounded"
                    value={email}
                />
                 <span className="icon is-small is-left">
                            <i className="fas fa-envelope"></i>
                        </span>
                </div>
            </div>
            <div className="field">
                <label className="label">Password</label>
                <input
                    onChange={this.handleChange("password")}
                    type="password"
                    className="input is-rounded"
                    value={password}
                />
            </div>

            <div className="field">
                <label className="label">
                    {recaptcha ? "Thanks. You got it!" : "What day is today?"}
                </label>

                <input
                    onChange={this.recaptchaHandler}
                    type="text"
                    className="input is-rounded"
                />
            </div>

            <button
                onClick={this.clickSubmit}
                className="button is-rounded is-black is-focused"
            >
                Submit
            </button>
        </form>
    );

    render() {
        const {
            email,
            password,
            error,
            redirectToReferer,
            loading,
            recaptcha
        } = this.state;

        if (redirectToReferer) {
            return <Redirect to="/" />;
        }
        



        return (
            <div className="container box box-shadow mt-6">
                <h2 className="title">SignIn</h2>
                
                

               

                <div className="notification is-danger"
                        style={{ display: error ? "" : "none" }}
                    >
                        {error}
                </div>

                {loading ?(
                            <progress class="progress is-small is-dark" max="100">15%</progress>
                        ):("")}

                {this.signinForm(email, password, recaptcha)}

                
            </div>
        );
    }
}

export default Signin;
