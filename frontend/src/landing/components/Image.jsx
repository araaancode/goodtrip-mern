export default function Image({src,...rest}) {
  src = src && src.includes('https://')
    ? src
    : 'http://localhost:5000/uploads/'+src;
  return (
    <img style={{height:'300px'}} className="w-full" {...rest} src={src} alt={''} />
  );
}
