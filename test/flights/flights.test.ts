import app from "../../app/app";
import { agent as request } from "supertest";
import { expect } from "chai";

it(`should GET /flights/shortest?origin=TLL&destination=HEL`, async function () {
  let origin = "TLL";
  let destination = "HEL";

  let routeBody = {
    route: [{ origin: "TLL", destination: "HEL", type: "flight" }],
  };
  const res = await request(app)
    .get(`/flights/best?origin=${origin}&destination=${destination}`)
    .send();
  expect(res.status).to.equal(200);
  expect(res.body).not.to.be.empty;
  expect(res.body).to.be.an("object");
  expect(res.body.route).to.be.equals(routeBody.route);
});

it(`should GET /flights/shortest?origin=TLL&destination=LAX`, async function () {
  let origin = "TLL";
  let destination = "LAX";

  let routeBody = {
    route: [
      { origin: "TLL", destination: "HEL", type: "flight" },
      { origin: "HEL", destination: "LAX", type: "flight" },
    ],
  };
  const res = await request(app)
    .get(`/flights/best?origin=${origin}&destination=${destination}`)
    .send();
  expect(res.status).to.equal(200);
  expect(res.body).not.to.be.empty;
  expect(res.body).to.be.an("object");
  expect(res.body.route).to.be.equals(routeBody.route);
});
