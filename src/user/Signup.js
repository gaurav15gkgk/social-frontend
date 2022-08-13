import React, { Component } from "react";
import { signup } from "../auth";
import { Link } from "react-router-dom";
import SocialLogin from "./SocialLogin";

class Signup extends Component {
    constructor() {
        super();
        this.state = {
            name: "",
            email: "",
            password: "",
            error: "",
            open: false,
            recaptcha: false,
            loading: false
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
       
        const { name, email, password } = this.state;
        const user = {
            name,
            email,
            password
        };
        // console.log(user);
        if (this.state.recaptcha) {
            signup(user).then(data => {
                if (data.error) this.setState({ error: data.error, loading:false });
                else
                    this.setState({
                        error: "",
                        name: "",
                        email: "",
                        password: "",
                        open: true,
                        loading:true
                    });
            });
        } else {
            this.setState({
                error: "What day is today? Please write a correct answer!"
            });
        }
    };

    signupForm = (name, email, password, recaptcha) => (
        <form>
            <div className="field">
                <label className="label">Name</label>
                <input
                    onChange={this.handleChange("name")}
                    type="text"
                    className="input is-rounded"
                    value={name}
                />
            </div>
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
                className="button is-dark is-rounded is-focused"
            >
                Submit
            </button>
        </form>
    );
    Message = (error, open) => (
        <>
        <div className="notification is-danger"
                    style={{ display: error ? "" : "none" }}
                >
                    {error}
                </div>

                <div
                    className="notification is-info"
                    style={{ display: open ? "" : "none" }}
                >
                    New account is successfully created. Please <Link to ="/signin" >Sign In</Link>
                </div>
                </>
    )

    render() {
        const { name, email, password, error, open, recaptcha ,loading} = this.state;
        return (
            <div className="box box-shadow container mt-6">
                <h2 className="title">Signup</h2>

                
                

                
                <div className='mt-3'>
                        {this.Message(error, open)}    
                        {loading ?(
                            <progress class="progress is-small is-dark" max="100">15%</progress>
                        ):("")}
                        {this.signupForm(name, email, password, recaptcha)}
                </div>

                

                
            </div>
        );
    }
}

export default Signup;
