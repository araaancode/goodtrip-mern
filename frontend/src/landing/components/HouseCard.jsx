import React from 'react';
import { Link, useParams } from "react-router-dom";

const HouseCard = ({ house }) => {
  return (
    <div className="rounded-lg">
      <Link to={`/house/${house._id}`}>
        <img src={house.cover} alt={house.name} className="w-full h-50 object-cover mb-4 rounded-md" />
      </Link>
      <h2 className="text-lg font-semibold">{house.name}</h2>
      <p className="text-gray-500">{house.description}</p>
      <p className="text-blue-500 font-bold mt-2">{house.price}</p>
    </div>
  );
};

export default HouseCard;
