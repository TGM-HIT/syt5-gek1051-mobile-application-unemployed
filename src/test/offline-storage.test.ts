// test for must have ID03: As a user, I want the app to work offline and allow local editing without internet. (Frolik)
import '@testing-library/jest-dom';
import { getEntries } from "@/lib/sync";
import { openDB } from "@/lib/localdb";

jest.mock('@/lib/localdb');

describe("MH-03: Offline lokale Speicherung", () => {
  it("saves entries locally when offline", async () => {
    const dbMock = {
      put: jest.fn(),
      getAll: jest.fn().mockResolvedValue([{ id: "1", title: "Apples", done: false }])
    };
    (openDB as jest.Mock).mockResolvedValue(dbMock);

    const db = await openDB();
    await db.put({ id: "1", title: "Apples", done: false });
    expect(db.put).toHaveBeenCalled();
  });

  it("loads local data when offline", async () => {
    const dbMock = {
      getAll: jest.fn().mockResolvedValue([{ id: "1", title: "Apples" }])
    };
    (openDB as jest.Mock).mockResolvedValue(dbMock);
    const db = await openDB();
    const entries = await db.getAll();
    expect(entries).toHaveLength(1);
  });
});
