import { hasValidTwitterLink } from "./link";

describe("valid twitter links", () => {
  it("should be matching video statuses", () => {
    expect(
      hasValidTwitterLink(
        "https://twitter.com/StrangestMp4/status/1369567904685989889?s=20"
      )
    ).toBeTruthy();
  });
  it("should be matching photo statuses", () => {
    expect(
      hasValidTwitterLink(
        "https://twitter.com/titsay/status/1424364239792136196?s=20"
      )
    ).toBeTruthy();
  });
});

describe("invalid twitter links", () => {
  it("should not match the homepage", () => {
    expect(hasValidTwitterLink("https://twitter.com/")).toBeFalsy();
  });
  it("shouldn't match timeline", () => {
    expect(hasValidTwitterLink("https://twitter.com/home")).toBeFalsy();
  });

  it("should not match TikTok links", () => {
    expect(
      hasValidTwitterLink(
        "https://www.tiktok.com/@madientour/video/6990845394620058886?lang=de-DE&is_copy_url=1&is_from_webapp=v1"
      )
    ).toBeFalsy();
  });
});
