const request = require("supertest");
const mongoose = require("mongoose");
const User = require("./models/user.js"); 
const app = require("./index");  

process.env.JWT_SECRET = "test-secret";

beforeAll(async () => {
  const databaseUrl = process.env.DATABASE_CONNECTION || 'mongodb://localhost:27017/testdb'; 
  await mongoose.connect(databaseUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("POST /api/auth/register", () => {
  it("should register a new user", async () => {
    const newUser = {
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@example.com",
      password: "password123",
    };

    const response = await request(app)
      .post("/api/auth/register") 
      .send(newUser);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message", "User registered successfully!");
  });
});

describe("POST /api/auth/login", () => {
  beforeAll(async () => {
    const newUser = {
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@example.com",
      password: "password123",
    };
    await request(app).post("/api/auth/register").send(newUser);
  });

  it("should log in a user and return a token", async () => {
    const userCredentials = {
      email: "johndoe@example.com",
      password: "password123",
    };

    const response = await request(app)
      .post("/api/auth/login")
      .send(userCredentials);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("email", "johndoe@example.com");
  });

  it("should return invalid credentials for incorrect password", async () => {
    const userCredentials = {
      email: "johndoe@example.com",
      password: "wrongpassword",  
    };

    const response = await request(app)
      .post("/api/auth/login")
      .send(userCredentials);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid credentials");
  });
});

describe("GET /api/auth/user", () => {
  let token; 

  beforeEach(async () => {
    await request(app).post("/api/auth/register").send({
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@example.com",
      password: "password123",
    });

    const loginResponse = await request(app).post("/api/auth/login").send({
      email: "johndoe@example.com",
      password: "password123",
    });

    token = loginResponse.body.token;
  });

  it("should return user data for a valid token", async () => {
    const response = await request(app)
      .get("/api/auth/user")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("email", "johndoe@example.com");
    expect(response.body).not.toHaveProperty("password");
  });

  it("should return 401 for an invalid token", async () => {
    const response = await request(app)
      .get("/api/auth/user")
      .set("Authorization", "Bearer invalidtoken");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Unauthorized: Invalid token");
  });

  it("should return 401 if no token is provided", async () => {
    const response = await request(app).get("/api/auth/user");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Unauthorized: No token provided");
  });
});
