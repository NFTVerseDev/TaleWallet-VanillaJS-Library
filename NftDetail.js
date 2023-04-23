

const NftDetail = ({ item }) => {
  const { fetchdetails, images } = useAll();
  const [data, setData] = useState("");
  const [activeIndexes, setActiveIndexes] = useState([]);

  const handleClick = (index) => {
    setActiveIndexes((prevIndexes) => {
      if (prevIndexes.includes(index)) {
        return prevIndexes.filter((i) => i !== index);
      } else {
        return [...prevIndexes, index];
      }
    });
  };


  return (
    <>
      <button onClick={() => handleBackClick()}> Go Back</button>
      <div className="nft-details-container">
        
        <div className="accordion-main-container">
          <div className="accordion-left-container">
            <div className="accordion">
              <div
                className={`accordion-item ${
                  activeIndexes.includes(0) ? "active" : ""
                }`}
              >
                <div
                  className="accordion-header"
                  onClick={() => handleClick(0)}
                >
                  <div style={{ display: "flex", gap: "15px" }}>
                    <img src={descicon} alt="" style={{ width: "15px" }} />
                    <h3> Description</h3>
                  </div>
                  <div>
                    <p className="accordion-icon">
                      {activeIndexes.includes(0) ? (
                        <span>-</span>
                      ) : (
                        <span>+</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="accordion-content">
                  <p>{data.description}</p>
                </div>
              </div>
            </div>

            <div className="accordion">
              <div
                className={`accordion-item ${
                  activeIndexes.includes(1) ? "active" : ""
                }`}
              >
                <div
                  className="accordion-header"
                  onClick={() => handleClick(1)}
                >
                  <div style={{ display: "flex", gap: "15px" }}>
                    <img src={descicon} alt="" style={{ width: "15px" }} />
                    <h3> Properties</h3>
                  </div>
                  <div>
                    <p className="accordion-icon">
                      {activeIndexes.includes(1) ? (
                        <span>-</span>
                      ) : (
                        <span>+</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="accordion-content">
                  <div className="properties-container">
                    {data &&
                      Object.entries(data.properties).map(([key, value]) => (
                        <div className="properties-card">
                          <p key={key}>
                            {key}: {value}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        
        </div>
     
      </div>
    </>
  );
};

export default NftDetail;
