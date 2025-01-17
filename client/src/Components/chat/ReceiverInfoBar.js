import React from "react";
const defaultProfileImage = "https://www.w3schools.com/w3images/avatar2.png"; // Default profile image URL

const ReceiverInfoBar = ({ user }) => {
  if (!user) return <div>Loading profile...</div>;

  return (
    <div className="profile-data-bar">
      <img
        src={user.profilePicture || defaultProfileImage}
        alt="User Profile"
      />
      <div>
        <h3>{user.username}</h3>
        <p>Status: {user.isOnline ? "Online" : "Offline"}</p>
        <p>Last Login: {new Date(user.lastLogin).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default ReceiverInfoBar;
