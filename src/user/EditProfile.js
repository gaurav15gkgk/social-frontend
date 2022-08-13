import React, { Component } from "react";
import { isAuthenticated } from "../auth";
import { read, update, updateUser } from "./apiUser";
import { Redirect } from "react-router-dom";
import DefaultProfile from "../images/avatar.png";

class EditProfile extends Component {
  constructor() {
    super();
    this.state = {
      id: "",
      name: "",
      email: "",
      password: "",
      redirectToProfile: false,
      error: "",
      fileSize: 0,
      loading: false,
      about: "",
      updatedProfilePicURL: ""
    };
  }

  init = userId => {
    const token = isAuthenticated().token;
    read(userId, token).then(data => {
      if (data.error) {
        this.setState({ redirectToProfile: true });
      } else {
        this.setState({
          id: data._id,
          name: data.name,
          email: data.email,
          error: "",
          about: data.about
        });
      }
    });
  };

  componentDidMount() {
    this.userData = new FormData();
    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  isValid = () => {
    const { name, email, password, fileSize } = this.state;
    if (fileSize > 30000000) {
      this.setState({
        error: "File size should be less than 100kb",
        loading: false
      });
      return false;
    }
    if (name.length === 0) {
      this.setState({ error: "Name is required", loading: false });
      return false;
    }
    // email@domain.com
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      this.setState({
        error: "A valid Email is required",
        loading: false
      });
      return false;
    }
    if (password.length >= 1 && password.length <= 5) {
      this.setState({
        error: "Password must be at least 6 characters long",
        loading: false
      });
      return false;
    }
    return true;
  };

  handleChange = name => event => {
    this.setState({ error: "" });
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    if(name === "photo"){
      this.setState({updatedProfilePicURL : URL.createObjectURL(value)})
    }

    const fileSize = name === "photo" ? event.target.files[0].size : 0;
    this.userData.set(name, value);
    this.setState({ [name]: value, fileSize });
  };

  clickSubmit = event => {
    event.preventDefault();
    this.setState({ loading: true });

    if (this.isValid()) {
      const userId = this.props.match.params.userId;
      const token = isAuthenticated().token;

      update(userId, token, this.userData).then(data => {
        if (data.error) {
          this.setState({ error: data.error });
        } else if (isAuthenticated().user.role === "admin") {
          this.setState({
            redirectToProfile: true
          });
        } else {
          updateUser(data, () => {
            this.setState({
              redirectToProfile: true
            });
          });
        }
      });
    }
  };

  photoRemove = () => {
    this.setState({updatedProfilePicURL : ""})
    this.setState({photo : ""})
    this.setState({fileSize : 0})
    this.userData.delete('photo')
  }

  signupForm = (name, email, password, about) => (
    <>
        <div className="field">
          <label className="label">Profile Photo</label>
          
            {this.state.updatedProfilePicURL == "" ? <div class="file">
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
            </div>: <button onClick={() => this.photoRemove()}  className="button is-rounded is-danger">
         Remove
        </button>}
          
        </div>

       
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
          <label className="label">About</label>
          <textarea 
                class="textarea is-info"
                placeholder="Info textarea"
                onChange={this.handleChange("about")}
                type="text"
                value={about}
          ></textarea>
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

        <button onClick={this.clickSubmit} className="button is-rounded is-warning">
          Update
        </button>
    </>
  );

  render() {
    const {
      id,
      name,
      email,
      password,
      redirectToProfile,
      error,
      loading,
      about
    } = this.state;

    if (redirectToProfile) {
      return <Redirect to={`/user/${id}`} />;
    }
    
    

    const photoUrl = id
      ? `${
          process.env.REACT_APP_API_URL
        }/user/photo/${id}?${new Date().getTime()}`
      : DefaultProfile;

    return (
      <div className="container box box-shadow mt-6">
        <h2 className="title">Edit Profile</h2>
        <div className="notification is-danger"
            style={{ display: error ? "" : "none" }}
          >
            {error}
        </div>

        {loading ?(
            <progress class="progress is-small is-dark" max="100">15%</progress>
        ):("")}

        <img
          style={{ height: "200px", width: "auto" }}
          className="image"
          src={this.state.updatedProfilePicURL == "" ? photoUrl: this.state.updatedProfilePicURL }
          onError={i => (i.target.src = `${DefaultProfile}`)}
          alt={name}
        />

        {isAuthenticated().user.role === "admin" &&
          this.signupForm(name, email, password, about)}

        {isAuthenticated().user._id === id &&
          this.signupForm(name, email, password, about)}
      </div>
    );
  }
}

export default EditProfile;