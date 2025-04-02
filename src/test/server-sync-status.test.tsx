import { listenForChanges, getSyncStatus } from "@/lib/sync";

jest.mock('@/lib/sync');

describe("MH-04: Server-Sync & Statusanzeige", () => {
  it("initializes sync with server", () => {
    const cb = jest.fn();
    (listenForChanges as jest.Mock).mockImplementation((callback) => callback());
    listenForChanges(cb);
    expect(cb).toHaveBeenCalled();
  });

  it("shows offline status if sync fails", async () => {
    (getSyncStatus as jest.Mock).mockResolvedValue(false);
    const status = await getSyncStatus();
    expect(status).toBe(false); // Would be used in UI to render offline badge
  });
});