import { supportedCountries } from "@/utils/supportedCountries";
import { useState } from "react";
import { TfiWorld } from "react-icons/tfi";

const SelectCountry = () => {
  const [selectedCountry, setSelectedCountry] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(e.target.value);
  };

  return (
    <div>
      <div className="mb-[0.5em] flex flex-col gap-[0.5em]">
        <label htmlFor="country-select" className="font-sans font-extrabold">
          Country
        </label>
        <select
          id="country-select"
          required={true}
          value={selectedCountry}
          onChange={handleChange}
          className="rounded-[0.2em] border border-black bg-white p-[1em] text-black"
        >
          <option value="" disabled>
            Please select...
          </option>
          {supportedCountries.map((country, index) => (
            <option key={index} value={country}>
              <TfiWorld />
              {country}
            </option>
          ))}
        </select>
      </div>
      <p className="w-full text-grayNavbarTxt">
        Udemy is required by law to collect applicable transaction taxes for purchases made in
        certain tax jurisdictions.
      </p>
    </div>
  );
};

export default SelectCountry;
