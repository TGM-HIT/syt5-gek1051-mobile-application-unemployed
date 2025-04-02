// shopping_entry.test.tsx
import React, { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

// Mock the uuid package to avoid ESM issues.
jest.mock('uuid', () => ({
  v4: () => 'mock-uuid',
}));

// Import the FilterAndSort component from your file.
import { FilterAndSort } from '@/components/layout/shopping_entry';
import { ShoppingListEntry } from '@/types/shoppinglist';

// A minimal wrapper that applies the sorting logic.
const SortedItemsWrapper = ({ items }: { items: ShoppingListEntry[] }) => {
  const [sortBy, setSortBy] = useState<{
    key: keyof ShoppingListEntry | null;
    order: 'asc' | 'desc' | null;
  }>({ key: null, order: null });

  const changeSort = (key: keyof ShoppingListEntry) => {
    setSortBy((prev) => {
      if (prev.key === key) {
        return { key, order: prev.order === 'asc' ? 'desc' : 'asc' };
      }
      return { key, order: 'asc' };
    });
  };

  // Apply alphabetical sorting by "name".
  const sortedItems = sortBy.key
    ? [...items].sort((a, b) => {
        const comp = (a[sortBy.key] as string).localeCompare(b[sortBy.key] as string);
        return sortBy.order === 'asc' ? comp : -comp;
      })
    : items;

  return (
    <div>
      <FilterAndSort
        filterChecked="all"
        setFilterChecked={() => {}}
        sortBy={sortBy}
        changeSort={changeSort}
      />
      <div data-testid="sorted-list">
        {sortedItems.map((item) => (
          <div key={item.id} data-testid="item">
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
};

test('alphabetical sorting of shopping list items by name', async () => {
  const items: ShoppingListEntry[] = [
    {
      id: '1',
      name: 'Bananas',
      description: '',
      category: '',
      editor: '',
      amount: 1,
      checked: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      pinned: false,
    },
    {
      id: '2',
      name: 'Apples',
      description: '',
      category: '',
      editor: '',
      amount: 1,
      checked: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      pinned: false,
    },
    {
      id: '3',
      name: 'Carrots',
      description: '',
      category: '',
      editor: '',
      amount: 1,
      checked: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      pinned: false,
    },
  ];

  render(
    <MemoryRouter>
      <SortedItemsWrapper items={items} />
    </MemoryRouter>
  );

  const user = userEvent.setup();

  // Check initial order (unsorted): as provided.
  let renderedItems = screen.getAllByTestId('item').map((el) => el.textContent);
  expect(renderedItems).toEqual(['Bananas', 'Apples', 'Carrots']);

  // Click the "Name" sort button to sort in ascending order.
  await user.click(screen.getByText(/Name/i));
  renderedItems = screen.getAllByTestId('item').map((el) => el.textContent);
  expect(renderedItems).toEqual(['Apples', 'Bananas', 'Carrots']);

  // Click the "Name" sort button again to toggle to descending order.
  await user.click(screen.getByText(/Name/i));
  renderedItems = screen.getAllByTestId('item').map((el) => el.textContent);
  expect(renderedItems).toEqual(['Carrots', 'Bananas', 'Apples']);
});
