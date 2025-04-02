import { useState } from "react";

export default function ListView({ listId }: { listId: string }) {
  const [items, setItems] = useState([{ id: "1", title: "Milk", done: false }]);

  return (
    <div>
      <input placeholder="new item" />
      <button>Add</button>
      {items.map(item => (
        <div key={item.id}>
          <label>
            <input type="checkbox" />
            {item.title}
          </label>
          <button data-testid={`delete-item-${item.id}`}>Delete</button>
        </div>
      ))}
    </div>
  );
}
