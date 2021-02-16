import app from "../../app/app";
import { agent as request } from "supertest";
import { expect } from "chai";

let firstOriginTest = "TLL";
let firstDestinationTest = "LAX";

let firstRouteBody = {
  route: [
    { origin: "TLL", destination: "HEL", type: "flight" },
    { origin: "HEL", destination: "LAX", type: "flight" },
  ],
};

it(`should GET /flights/shortest?origin=TLL&destination=LAX`, async function () {
  const res = await request(app)
    .get(
      `/flights/best?origin=${firstOriginTest}&destination=${firstDestinationTest}`
    )
    .send();
  expect(res.status).to.equal(200);
  expect(res.body).not.to.be.empty;
  expect(res.body).to.be.an("object");
  expect(res.body.route).to.be.equals(firstRouteBody.route);
});
