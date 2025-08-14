import Select from "react-tailwindcss-select";

const SelectWithError = ({ 
  label, 
  value, 
  onChange, 
  options, 
  error, 
  isMultiple = false,
  isDisabled = false,
  placeholder = "انتخاب کنید",
  className = '',
  isSearchable = true
}) => (
  <div className={`mb-6 ${className}`}>
    <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600 block">
      {label}
    </label>
    <Select
      value={value}
      onChange={onChange}
      options={options}
      isMultiple={isMultiple}
      isDisabled={isDisabled}
      isSearchable={isSearchable}
      primaryColor={"blue"}
      placeholder={placeholder}
      classNames={{
        menuButton: () => `flex text-sm sm:text-base text-gray-500 border ${error?.hasError ? 'border-red-500' : 'border-gray-300'} rounded-lg transition-all duration-300 focus:outline-none focus:border-blue-800`,
        searchBox: "text-right"
      }}
    />
    {error?.hasError && (
      <span className="text-red-500 text-sm mt-1">{error.message}</span>
    )}
  </div>
);

export default SelectWithError;