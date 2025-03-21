import help from "../utils/help.json"
const Help: React.FC = () => {
  const functions = () => {
    console.log("hola");
  };

  return (
    <>
    {help.map((help, index) => (
        <div key={index}>
          <h2>{help.dimension}</h2>
          <p>{help.description}</p>
          <p>{help.measurement_instructions}</p>
          <img src={help.image_url} alt={help.dimension} />
        </div>
      ))}
    </>
  );
};

export default Help;
