import { useState } from "react";
import { createList, renameList, deleteList } from "@/lib/lists";

export default function ListsOverview() {
  const [input, setInput] = useState("");

  return (
    <div>
      <button>New List</button>
      <input
        placeholder="list name"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={() => createList(input)}>Create</button>

      <div>
        <span data-testid="edit-list-test-list">Edit Test List</span>
        <input defaultValue="Test List" />
        <button onClick={() => renameList("test-list-id", "New Name")}>Save</button>
      </div>

      <button data-testid="delete-list-test-list" onClick={() => deleteList("test-list-id")}>
        Delete
      </button>
    </div>
  );
}
