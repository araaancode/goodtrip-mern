import {Link, useParams} from "react-router-dom";
import AccountNav from "../components/AccountNav";
import {useEffect, useState} from "react";
import axios from "axios";
import PlaceImg from "../components/PlaceImg";

export default function HousesPage() {
  const [places,setPlaces] = useState([]);
  useEffect(() => {
    axios.get('/api/user-places').then(({data}) => {
      setPlaces(data);
    });
  }, []);
  return (
    <div>
      <AccountNav />
       
        <div className="mt-6">
          {places.length > 0 && places.map(place => (
            <Link key={place._id} to={'/account/places/'+place._id} className="flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl">
              <div className="flex w-32 h-32 bg-gray-300 grow shrink-0">
                <PlaceImg place={place} />
              </div>
              <div className="grow-0 shrink">
                <h2 className="text-xl">{place.title}</h2>
                <p className="text-sm mt-2">{place.description}</p>
              </div>
            </Link>
          ))}
        </div>
    </div>
  );
}