import { rest } from "msw";
import { setupServer } from "msw/node";
import { checkIfVideo } from "./twitter";

const server = setupServer(
  rest.get("https://api.twitter.com/2/tweets/:id", async (req, res, ctx) => {
    // Respond with a mocked user token that gets persisted
    // in the `sessionStorage` by the `Login` component.
    if (req.params.id == "1369567904685989889") {
      return res(ctx.json(await import("./fixtures/video.json")));
    }
    if (req.params.id == "1424364239792136196") {
      return res(ctx.json(await import("./fixtures/photo.json")));
    }
    if (req.params.id == "1424753751038988289") {
      return res(ctx.json(await import("./fixtures/text.json")));
    }
    if (req.params.id == "1424470938603638784") {
      return res(ctx.json(await import("./fixtures/gif.json")));
    }
  })
);

// Enable API mocking before tests.
beforeAll(() => server.listen());

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers());

// Disable API mocking after the tests are done.
afterAll(() => server.close());

describe("valid twitter media response", () => {
  it("should detect video in media", async () => {
    expect(
      await checkIfVideo(
        "https://twitter.com/StrangestMp4/status/1369567904685989889?s=20"
      )
    ).toBeTruthy();
  });

  it("should detect photo in media", async () => {
    expect(
      await checkIfVideo(
        "https://twitter.com/titsay/status/1424364239792136196?s=20"
      )
    ).toBeFalsy();
  });
  it("should detect photo in media", async () => {
    expect(
      await checkIfVideo(
        "https://twitter.com/titsay/status/1424470938603638784?s=20"
      )
    ).toBeTruthy();
  });
  it("should not detect media in text", async () => {
    expect(
      await checkIfVideo(
        "https://twitter.com/hasanthehun/status/1424753751038988289?s=20"
      )
    ).toBeFalsy();
  });
});
