import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ShoppingListButton, NewShoppingListButton } from '@/components/layout/shopping_list';
import { addList, updateList, deleteList } from '@/lib/sync';

// Mock external functions
jest.mock('@/lib/sync', () => ({
  addList: jest.fn(),
  updateList: jest.fn(),
  deleteList: jest.fn(),
}));

jest.mock('@/lib/pdf', () => ({
  generatePdf: jest.fn(),
}));

// Sample list for testing
const sampleList = {
  _id: '1',
  type: 'list',
  name: 'Groceries',
  description: 'Weekly food',
  address: { country: 'AT', city: 'Vienna', street: 'Main St', postcode: '1010' },
  entries: {},
};

describe('Shopping List Components', () => {
  const user = userEvent.setup();

  test('Creates a new shopping list', async () => {
    render(
      <MemoryRouter>
        <NewShoppingListButton />
      </MemoryRouter>
    );

    // Click the trigger button to open the "Add New List" dialog.
    await user.click(screen.getByTestId('new-list-button'));

    // Fill out the form fields.
    const nameInput = screen.getByLabelText('Name');
    const descriptionInput = screen.getByLabelText('Description');
    await user.type(nameInput, 'New List');
    await user.type(descriptionInput, 'Fresh groceries');

    // Click the "Add" button.
    await user.click(screen.getByText('Add'));

    // Verify addList was called with expected arguments.
    await waitFor(() => {
      expect(addList).toHaveBeenCalledWith(
        'New List',
        'Fresh groceries',
        expect.any(Object) // The address object
      );
    });
  });

  test('Renames a list and modifies details', async () => {
    render(
      <MemoryRouter>
        <ShoppingListButton list={sampleList} />
      </MemoryRouter>
    );

    // Open the options dropdown.
    await user.click(screen.getByTestId('list-options'));

    // Click the "Edit name" option.
    await user.click(screen.getByText('Edit name'));

    // Update the name.
    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'Updated Groceries');

    // Save changes.
    await user.click(screen.getByText('Save'));

    // Verify updateList is called with the new name.
    await waitFor(() => {
      expect(updateList).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Updated Groceries' })
      );
    });
  });

  test('Deletes a list', async () => {
    render(
      <MemoryRouter>
        <ShoppingListButton list={sampleList} />
      </MemoryRouter>
    );

    // Open the options dropdown.
    await user.click(screen.getByTestId('list-options'));

    // Click "Delete" option.
    await user.click(screen.getByText('Delete'));

    // Confirm deletion in the confirmation dialog.
    await user.click(screen.getByText('Delete'));

    // Verify deleteList is called with the list id.
    await waitFor(() => {
      expect(deleteList).toHaveBeenCalledWith(sampleList._id);
    });
  });

  test('Renders multiple lists for management and navigation', () => {
    // Create a second sample list.
    const secondList = {
      ...sampleList,
      _id: '2',
      name: 'Hardware Store',
      address: { country: 'AT', city: 'Vienna', street: 'Tool Rd', postcode: '1020' },
    };

    render(
      <MemoryRouter>
        <ShoppingListButton list={sampleList} />
        <ShoppingListButton list={secondList} />
      </MemoryRouter>
    );

    // Check that both lists' names are rendered.
    expect(screen.getByText('Groceries')).toBeInTheDocument();
    expect(screen.getByText('Hardware Store')).toBeInTheDocument();

    // Verify each list has a link (used for navigation).
    const links = screen.getAllByRole('link');
    expect(links.length).toBe(2);
  });
});
