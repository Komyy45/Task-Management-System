const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");
const Task = require("./models/task.model.js");

jest.mock("./models/task.model.js");
jest.mock("jsonwebtoken");

const taskRouter = require("./task/task.controller.js");

const app = express();
app.use(express.json());
app.use("/api/task", taskRouter);

describe("Task Controller Comprehensive Tests", () => {
  const dummyToken = "Bearer fake.token.here";
  const userEmail = "test@example.com";

  beforeEach(() => {
    jwt.verify.mockReturnValue({ email: userEmail });
    jest.clearAllMocks();
  });

  const fakeTask = {
    _id: "taskid123",
    title: "Test Task",
    description: "Just testing",
    category: "Work",
    priority: "High",
    status: "Pending",
    completed: false,
    progress: 0,
    userEmail,
    save: jest.fn().mockResolvedValue(),
  };

  it("POST /api/task - should create a task", async () => {
    Task.mockImplementation(() => fakeTask);

    const res = await request(app)
      .post("/api/task")
      .send({
        title: fakeTask.title,
        description: fakeTask.description,
        category: fakeTask.category,
        priority: fakeTask.priority,
        status: fakeTask.status,
      })
      .set("Authorization", dummyToken);

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe(fakeTask.title);
    expect(fakeTask.save).toHaveBeenCalled();
  });

  it("GET /api/task/categories - should return categories count", async () => {
    Task.find.mockResolvedValue([
      { category: "Work" },
      { category: "Work" },
      { category: "Home" },
    ]);

    const res = await request(app)
      .get("/api/task/categories")
      .set("Authorization", dummyToken);

    expect(res.statusCode).toBe(200);
    expect(res.body.Work).toBe(2);
    expect(res.body.Home).toBe(1);
  });

  it("GET /api/task/:id - should get a task by id", async () => {
    Task.findOne.mockResolvedValue(fakeTask);

    const res = await request(app)
      .get("/api/task/taskid123")
      .set("Authorization", dummyToken);

    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe("taskid123");
  });

  it("GET /api/task/:id - should return 404 if task not found", async () => {
    Task.findOne.mockResolvedValue(null);

    const res = await request(app)
      .get("/api/task/notfoundid")
      .set("Authorization", dummyToken);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Task Not Found!");
  });

  it("PUT /api/task/:id/toggle-complete - should toggle complete task", async () => {
    Task.findByIdAndUpdate.mockResolvedValue({
      ...fakeTask,
      completed: true,
      progress: 100,
      status: "Done",
    });

    const res = await request(app)
      .put("/api/task/taskid123/toggle-complete")
      .send({ completed: true, progress: 100, status: "Done" })
      .set("Authorization", dummyToken);

    expect(res.statusCode).toBe(200);
    expect(res.body.completed).toBe(true);
  });

  it("PUT /api/task/:id - should update a task", async () => {
    Task.findOne.mockResolvedValue(fakeTask);
    Task.findByIdAndUpdate.mockResolvedValue({
      ...fakeTask,
      title: "Updated title",
    });

    const res = await request(app)
      .put("/api/task/taskid123")
      .send({ title: "Updated title" })
      .set("Authorization", dummyToken);

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Updated title");
  });

  it("PUT /api/task/:id - should return 404 if task to update not found", async () => {
    Task.findOne.mockResolvedValue(null);

    const res = await request(app)
      .put("/api/task/notfoundid")
      .send({ title: "Updated title" })
      .set("Authorization", dummyToken);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Task not found");
  });

  it("DELETE /api/task/:id - should delete a task", async () => {
    Task.deleteOne.mockResolvedValue({ deletedCount: 1 });

    const res = await request(app)
      .delete("/api/task/taskid123")
      .set("Authorization", dummyToken);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Task has been Deleted Successfully!");
  });

  it("DELETE /api/task/:id - should handle delete errors", async () => {
    Task.deleteOne.mockRejectedValue(new Error("Delete error"));

    const res = await request(app)
      .delete("/api/task/taskid123")
      .set("Authorization", dummyToken);

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe("An Error has been Ocurred!");
  });
});
