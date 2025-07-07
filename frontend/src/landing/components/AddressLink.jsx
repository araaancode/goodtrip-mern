

export default function AddressLink({ position, children, className }) {
  if (!position || !position.lat || !position.lng) {
    console.error("Invalid position provided to AddressLink", position);
    return <div className={className}>{children}</div>;
  }

  const googleMapsUrl = `https://www.google.com/maps?q=${position.lat},${position.lng}`;

  return (
    <a
      dir="rtl"
      className={`inline-flex items-center gap-1 ${className}`}
      target="_blank"
      rel="noopener noreferrer"
      href={googleMapsUrl}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-right">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
      {children || "View on Google Maps"}

      
    </a>
  );
}