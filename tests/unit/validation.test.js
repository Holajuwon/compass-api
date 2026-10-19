const {
  validateComment,
  validateCommentUpdate,
  validatePost,
  validatePostUpdate,
} = require("../../middlewares/validation");

describe("request validation", () => {
  it("validates post creation payloads", () => {
    expect(
      validatePost({
        author: "Alice",
        content: "A useful post",
        title: "A post title",
        url: "https://example.com",
      })
    ).not.toHaveProperty("error");
    expect(validatePost({ content: "tiny" })).toHaveProperty("error");
  });

  it("validates post update payloads", () => {
    expect(validatePostUpdate({ content: "Updated content" })).not.toHaveProperty(
      "error"
    );
    expect(validatePostUpdate({ content: "tiny" })).toHaveProperty("error");
  });

  it("validates comment creation payloads", () => {
    expect(
      validateComment({ author: "Alice", comment: "A useful comment" })
    ).not.toHaveProperty("error");
    expect(validateComment({ comment: "tiny" })).toHaveProperty("error");
  });

  it("validates comment update payloads", () => {
    expect(validateCommentUpdate({ comment: "Updated comment" })).not.toHaveProperty(
      "error"
    );
    expect(validateCommentUpdate({ comment: "tiny" })).toHaveProperty("error");
  });
});