import React, { Component } from "react";
import { follow, unfollow } from "./apiUser";

class FollowProfileButton extends Component {
    followClick = () => {
        this.props.onButtonClick(follow);
    };

    unfollowClick = () => {
        this.props.onButtonClick(unfollow);
    };

    render() {
        return (
            <div className="buttons">
                {!this.props.following ? (
                    <button
                        onClick={this.followClick}
                        className="button is-rounded is-info is-focused"
                    >
                        Follow
                    </button>
                ) : (
                    <button
                        onClick={this.unfollowClick}
                        className="button is-rounded is-warning is-focused"
                    >
                        UnFollow
                    </button>
                )}
            </div>
        );
    }
}

export default FollowProfileButton;
