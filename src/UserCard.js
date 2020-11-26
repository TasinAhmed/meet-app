import React from "react";

function UserCard({ user }) {
  return (
    <div className="user__card">
      <div>Name: {user.name}</div>
      <div>Address: {user.address}</div>
      <div>Lattitude: {user.coordinates.lat}</div>
      <div>Longitude: {user.coordinates.lng}</div>
    </div>
  );
}

export default UserCard;
