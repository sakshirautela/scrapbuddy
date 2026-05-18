import React from "react";

const CitiesTable = ({
  cities,
}) => {

  return (

    <div className="table-container">

      <h2>
        Cities
      </h2>

      <div className="grid-box">

        {cities.map((city) => (

          <div
            key={city.id}
            className="grid-card"
          >

            <h3>
              {city.name}
            </h3>

          </div>

        ))}

      </div>

    </div>
  );
};

export default CitiesTable;