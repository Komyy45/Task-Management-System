const { register, login, getUser } = require("./AuthServiceUnitTesting");
const User = require("./models/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

jest.mock("./models/user.js");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("Auth Service Unit Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should throw error if user exists", async () => {
      User.findOne.mockResolvedValue(true);

      await expect(
        register({
          body: {
            firstName: "Test",
            lastName: "User",
            password: "pass123",
            email: "test@example.com",
            phone: "123456789",
            maleOrFemale: "male",
          },
        })
      ).rejects.toThrow("User already exists");
    });

    it("should throw error if required fields are missing", async () => {
      await expect(register({ body: {} })).rejects.toThrow("Missing required fields");
    });

    it("should throw error if bcrypt.hash fails", async () => {
      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockRejectedValue(new Error("Hash error"));

      await expect(
        register({
          body: {
            firstName: "Test",
            lastName: "User",
            password: "pass123",
            email: "test@example.com",
            phone: "123456789",
            maleOrFemale: "male",
          },
        })
      ).rejects.toThrow("Hash error");
    });

    it("should register a new user successfully", async () => {
      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("hashedpassword");
      User.prototype.save = jest.fn().mockResolvedValue();

      const res = await register({
        body: {
          firstName: "Test",
          lastName: "User",
          password: "pass123",
          email: "test@example.com",
          phone: "123456789",
          maleOrFemale: "male",
        },
      });

      expect(res.message).toBe("User registered successfully!");
      expect(User.prototype.save).toHaveBeenCalled();
    });
  });

  describe("login", () => {
    it("should throw error if email or password missing", async () => {
      await expect(login({ body: { email: "test@example.com" } })).rejects.toThrow("Missing required fields");
      await expect(login({ body: { password: "pass123" } })).rejects.toThrow("Missing required fields");
    });

    it("should throw error if user not found", async () => {
      User.findOne.mockResolvedValue(null);

      await expect(
        login({
          body: { email: "notfound@example.com", password: "pass123" },
        })
      ).rejects.toThrow("Invalid credentials");
    });

    it("should throw error if password does not match", async () => {
      User.findOne.mockResolvedValue({ password: "hashedpassword" });
      bcrypt.compare.mockResolvedValue(false);

      await expect(
        login({
          body: { email: "test@example.com", password: "wrongpass" },
        })
      ).rejects.toThrow("Invalid credentials");
    });

    it("should login successfully and return token", async () => {
      const user = { _id: "123", email: "test@example.com", password: "hashed" };
      User.findOne.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("token123");

      const res = await login({
        body: { email: "test@example.com", password: "pass123" },
      });

      expect(res).toEqual({ email: "test@example.com", token: "token123" });
    });
  });

  describe("getUser", () => {
    it("should throw error if user not found", async () => {
      jwt.verify.mockReturnValue({ email: "test@example.com" });

      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      await expect(getUser("token123")).rejects.toThrow("User not found");
    });

    it("should return user data without password", async () => {
      jwt.verify.mockReturnValue({ email: "test@example.com" });

      const mockUser = { email: "test@example.com", firstName: "Test" };

      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      const user = await getUser("token123");
      expect(user).toEqual(mockUser);
    });
  });
});
