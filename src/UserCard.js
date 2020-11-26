import React from "react";

function UserCard({ user }) {
  return (
    <div className="user__card--back">
      <div className="user__card">
        <div>Name: {user.name}</div>
        <div>Address: {user.address}</div>
        <div>Lattitude: {user.coordinates.lat}</div>
        <div>Longitude: {user.coordinates.lng}</div>
        <div>Travel Mode: {user.transport}</div>
        {user.distance && <div>Distance: {user.distance}</div>}
        {user.duration && <div>ETA: {user.duration}</div>}
      </div>
    </div>
  );
}

export default UserCard;
