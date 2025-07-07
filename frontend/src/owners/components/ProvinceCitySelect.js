import React, { useState, useEffect } from "react";
import Select from "react-tailwindcss-select";
import "react-tailwindcss-select/dist/index.css";
import provincesData from "./provinces_cities.json"; 

const ProvinceCitySelect = () => {
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    const formattedProvinces = provincesData.map((province) => ({
      label: province.name,
      value: province.id,
      cities: province.cities.map((city) => ({
        label: city.name,
        value: city.id,
      })),
    }));
    setProvinces(formattedProvinces);
  }, []);

  const handleProvinceChange = (value) => {
    setSelectedProvince(value);
    setSelectedCity(null);
    const selected = provinces.find((p) => p.value === value.value);
    setCities(selected ? selected.cities : []);
  };

  return (
    <>
      <div className="mb-6">
        <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">استان</label>
        <Select
          value={selectedProvince}
          onChange={handleProvinceChange}
          options={provinces}
          primaryColor={"blue"}
          placeholder="انتخاب استان"
          isSearchable
          searchInputPlaceholder="جستجو استان"
          classNames={{
            searchIcon: "hidden", // This hides the search icon
          }}
        />
      </div>

      <div>
        <label className="text-xs sm:text-sm tracking-wide text-gray-600">شهرستان</label>
        <Select
          value={selectedCity}
          onChange={setSelectedCity}
          options={cities}
          primaryColor={"blue"}
          placeholder="انتخاب شهرستان"
          isSearchable
          isDisabled={!selectedProvince}
          searchInputPlaceholder="جستجو شهرستان"
          classNames={{
            searchIcon: "hidden", // This hides the search icon
          }}

        />
      </div>
    </>
  );
};

export default ProvinceCitySelect;
