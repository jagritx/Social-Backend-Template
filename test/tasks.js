import chai from "chai";
import chaiHttp from "chai-http";
import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "../index.js";
//Configs
dotenv.config();
chai.should();
chai.use(chaiHttp);

//Defining Server and Connections
const server = "http://localhost:6000";
var credentials = { email: "testerx@gmail.com", password: "password" };

//Test for Authentication
describe("Authentication", () => {
  before(async () => {
    console.log("Waiting to connect to Database...");
    await mongoose.connect(process.env.MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  it("It should return 200 and user info when authenticated along with Access_token cookie", async () => {
    const res = await chai
      .request(server)
      .post("/api/authenticate")
      .send(credentials);

    res.should.have.status(200);
    res.should.have.cookie("Access_token");
  });
});

//Creating token to save and send to requests
let token;
//Test to get all posts (requires getting a token first)
describe(" Get /api/all_posts", () => {
  before(function (done) {
    chai
      .request(server)
      .post("/api/authenticate")
      .send(credentials)
      .end(function (err, res) {
        token = res.header["set-cookie"][0].split(";")[0].split("=")[1];
        console.log(token);
        done();
      });
  });

  it("It should get all posts", (done) => {
    chai
      .request(server)
      .get("/api/all_posts")
      .set("Cookie", "Access_token=" + token)
      .set({ Accept: "application/json" })
      .send()
      .end((error, res) => {
        res.should.have.status(200);
        done();
      });
  });
});

//test to create a post
describe(" Post /api/posts", () => {
  it("It should create a post", (done) => {
    chai
      .request(server)
      .post("/api/posts")
      .set("Cookie", "Access_token=" + token)
      .set({ Accept: "application/json" })
      .send({
        title: "Hello There",
        description: "General Kenobu!?",
      })
      .end((error, res) => {
        res.should.have.status(200);
        res.body.should.have.property("_id");
        done();
      });
  });
});
