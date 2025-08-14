const InputWithError = ({ 
  label, 
  icon, 
  type, 
  value, 
  onChange, 
  onBlur,
  placeholder, 
  error,
  textarea = false,
  rows = 3,
  className = '',
  disabled = false
}) => (
  <div className={`flex flex-col mb-4 ${className}`}>
    <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600 block">
      {label}
    </label>
    <div className="relative">
      {icon && (
        <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
          {icon}
        </div>
      )}
      {textarea ? (
        <textarea
          style={{ borderRadius: "5px", resize: "none" }}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          rows={rows}
          disabled={disabled}
          className={`text-sm sm:text-base placeholder-gray-400 ${icon ? 'pl-10' : 'pl-3'} pr-4 rounded-lg border ${error?.hasError ? 'border-red-500' : 'border-gray-300'} w-full py-2 focus:outline-none focus:border-blue-800`}
          placeholder={placeholder}
        />
      ) : (
        <input
          style={{ borderRadius: "5px" }}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          className={`text-sm sm:text-base placeholder-gray-400 ${icon ? 'pl-10' : 'pl-3'} pr-4 rounded-lg border ${error?.hasError ? 'border-red-500' : 'border-gray-300'} w-full py-2 focus:outline-none focus:border-blue-800`}
          placeholder={placeholder}
        />
      )}
    </div>
    {error?.hasError && (
      <span className="text-red-500 text-sm mt-1">{error.message}</span>
    )}
  </div>
);

export default InputWithError;