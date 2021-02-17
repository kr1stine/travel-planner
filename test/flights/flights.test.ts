import app from "../../app/app";
import { agent as request } from "supertest";
import { expect } from "chai";

it(`should GET /route/shortest?origin=TLL&destination=HEL`, async function () {
  let origin = "TLL";
  let destination = "HEL";

  let routeBody = {
    path: [{ origin: "TLL", destination: "HEL", type: "flight" }],
  };
  const res = await request(app)
    .get(`/route/shortest?origin=${origin}&destination=${destination}`)
    .send();
  expect(res.status).to.equal(200);
  expect(res.body).not.to.be.empty;
  expect(res.body).to.be.an("object");
  expect(res.body.path).to.be.equals(routeBody.path);
});

it(`should GET /route/shortest?origin=tll&destination=hel`, async function () {
  let origin = "TLL";
  let destination = "HEL";

  let routeBody = {
    path: [{ origin: "TLL", destination: "HEL", type: "flight" }],
  };
  const res = await request(app)
    .get(`/route/shortest?origin=${origin}&destination=${destination}`)
    .send();
  expect(res.status).to.equal(200);
  expect(res.body).not.to.be.empty;
  expect(res.body).to.be.an("object");
  expect(res.body.path).to.be.equals(routeBody.path);
});

it(`should GET /route/shortest?origin=TLL&destination=LAX`, async function () {
  let origin = "TLL";
  let destination = "LAX";

  let routeBody = {
    path: [
      { origin: "TLL", destination: "ARN", type: "flight" },
      { origin: "ARN", destination: "LAX", type: "flight" },
    ],
  };
  const res = await request(app)
    .get(`/route/shortest?origin=${origin}&destination=${destination}`)
    .send();
  expect(res.status).to.equal(200);
  expect(res.body).not.to.be.empty;
  expect(res.body).to.be.an("object");
  expect(res.body.path).to.be.equals(routeBody.path);
});

it(`should GET /route/shortest?origin=TLL&destination=JFK`, async function () {
  let origin = "TLL";
  let destination = "JFK";

  let routeBody = {
    path: [
      { origin: "TLL", destination: "TRD", type: "flight" },
      { origin: "TRD", destination: "KEF", type: "flight" },
      { origin: "KEF", destination: "JFK", type: "flight" },
    ],
  };
  const res = await request(app)
    .get(`/route/shortest?origin=${origin}&destination=${destination}`)
    .send();
  expect(res.status).to.equal(200);
  expect(res.body).not.to.be.empty;
  expect(res.body).to.be.an("object");
  expect(res.body.path).to.be.equals(routeBody.path);
});

it(`should GET /route/shortest?origin=RIX&destination=ESS`, async function () {
  let origin = "RIX";
  let destination = "ESS";

  let routeBody = {
    path: [
      {
        origin: "RIX",
        destination: "BRE",
        type: "flight",
      },
      {
        origin: "BRE",
        destination: "FMO",
        type: "flight",
      },
      {
        origin: "FMO",
        destination: "ESS",
        type: "self-transfer",
      },
    ],
    pathString: "RIX->BRE->FMO=>ESS",
  };
  const res = await request(app)
    .get(`/route/shortest?origin=${origin}&destination=${destination}`)
    .send();
  expect(res.status).to.equal(200);
  expect(res.body).not.to.be.empty;
  expect(res.body).to.be.an("object");
  expect(res.body.path).to.be.equals(routeBody.path);
  expect(res.body.pathString).to.be.equals(routeBody.pathString);
});
