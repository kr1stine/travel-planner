## **Shortest flight path finder**

Finds shortest flight path between two airports regarding geographical distance. For airports with less than 100km apart, self-transfer options are also considered.

Install dependecies with `npm install`  
Run the app with `npm start` or `npm run debug`.
App will become available at `localhost:3000`.

The app takes a few minutes to start, as heavier data processing is done at startup.

Available endpoints:

## **Get route**

Returns shortest route info between two given airports.

- **URL**

  /route/shortest?origin={origin}&destination={destination}

- **Method:**

  `GET`

- **URL Params**

  **Required:**

  `origin=[string]`

  `destination=[string]`

  Both can be either IATA or ICAO codes.

- **Data Params**

  None

- **Success Response:**

  - **Code:** 200 <br />
    **Content:** `{ "path": [ { "origin": "TLL", "destination": "HEL", "type": "flight" } ], "pathString": "TLL->HEL" }`

- **Error Response:**

  - **Code:** 404 NOT FOUND <br />
    **Content:** `{ error : "Path not found" }`

  OR

  - **Code:** 400 BAD REQUEST <br />
    **Content:** `{ error : "Missing required parameters: origin and/or destination" }`

  OR

  - **Code:** 400 BAD REQUEST <br />
    **Content:** `{ error : "Cannot find route between same origin and destination" }`

- **Sample Call:**

  ```javascript
  $.ajax({
    url: "/route/shortest?origin=tll&destination=lax",
    dataType: "json",
    type: "GET",
    success: function (r) {
      console.log(r);
    },
  });
  ```
