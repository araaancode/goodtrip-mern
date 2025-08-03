import React, { useState } from 'react';
import { ClipLoader } from 'react-spinners';

const PassengerForm = ({ onSubmit, remainingPassengers }) => {
  const [passenger, setPassenger] = useState({
    name: '',
    nationalCode: '',
    age: '',
    gender: 'male'
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPassenger(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passenger.name && passenger.nationalCode && passenger.age) {
      setSubmitting(true);
      setTimeout(() => {
        onSubmit(passenger);
        setPassenger({
          name: '',
          nationalCode: '',
          age: '',
          gender: 'male'
        });
        setSubmitting(false);
      }, 500);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={passenger.name}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">National Code</label>
          <input
            type="text"
            name="nationalCode"
            value={passenger.nationalCode}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Age</label>
          <input
            type="number"
            name="age"
            min="1"
            max="120"
            value={passenger.age}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Gender</label>
          <select
            name="gender"
            value={passenger.gender}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center"
        disabled={submitting}
      >
        {submitting ? (
          <ClipLoader size={18} color="#ffffff" />
        ) : (
          `Add Passenger (${remainingPassengers} remaining)`
        )}
      </button>
    </form>
  );
};

export default PassengerForm;