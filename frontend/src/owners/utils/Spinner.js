const Spinner = ({ size = 5, color = 'white' }) => (
  <div 
    className={`w-${size} h-${size} border-2 border-t-transparent border-${color} rounded-full animate-spin`}
    style={{ 
      borderColor: color === 'white' ? 'white' : color,
      borderTopColor: 'transparent'
    }}
  />
);

export default Spinner;