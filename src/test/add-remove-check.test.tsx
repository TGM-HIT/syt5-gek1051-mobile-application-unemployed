import { render, screen, fireEvent } from "@testing-library/react";
import ListView from "@/components/ListView";
import * as sync from "@/lib/sync";

jest.mock('@/lib/sync');

describe("MH-02: Artikel in Listen verwalten", () => {
  beforeEach(() => {
    (sync.getEntries as jest.Mock).mockResolvedValue([
      { id: "1", title: "Milk", done: false }
    ]);
  });

  it("allows adding an item", async () => {
    render(<ListView listId="abc123" />);
    fireEvent.change(screen.getByPlaceholderText(/new item/i), {
      target: { value: "Bread" }
    });
    fireEvent.click(screen.getByRole("button", { name: /add/i }));
    expect(sync.addOrUpdateEntry).toHaveBeenCalled();
  });

  it("allows checking off an item", async () => {
    render(<ListView listId="abc123" />);
    const checkbox = await screen.findByRole("checkbox");
    fireEvent.click(checkbox);
    expect(sync.addOrUpdateEntry).toHaveBeenCalled();
  });

  it("allows deleting an item", () => {
    render(<ListView listId="abc123" />);
    fireEvent.click(screen.getByTestId("delete-item-1"));
    expect(sync.deleteEntry).toHaveBeenCalledWith("abc123", "1");
  });
});
