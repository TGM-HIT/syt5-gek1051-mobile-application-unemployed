import { render, screen, fireEvent } from "@testing-library/react";
import ListsOverview from "@/components/ListsOverview"; // hypothetische Komponente
import { createList, deleteList, renameList } from "@/lib/lists";

jest.mock('@/lib/lists');

describe("MH-01: Einkaufslisten verwalten", () => {
  it("allows creating a new list", async () => {
    render(<ListsOverview />);
    fireEvent.click(screen.getByRole("button", { name: /new list/i }));
    fireEvent.change(screen.getByPlaceholderText(/list name/i), {
      target: { value: "Supermarkt" },
    });
    fireEvent.click(screen.getByRole("button", { name: /create/i }));
    expect(createList).toHaveBeenCalledWith("Supermarkt");
  });

  it("allows renaming a list", () => {
    render(<ListsOverview />);
    fireEvent.click(screen.getByTestId("edit-list-test-list")); // e.g., pencil icon
    fireEvent.change(screen.getByDisplayValue("Test List"), {
      target: { value: "New Name" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));
    expect(renameList).toHaveBeenCalledWith("test-list-id", "New Name");
  });

  it("allows deleting a list", () => {
    render(<ListsOverview />);
    fireEvent.click(screen.getByTestId("delete-list-test-list"));
    expect(deleteList).toHaveBeenCalledWith("test-list-id");
  });
});
