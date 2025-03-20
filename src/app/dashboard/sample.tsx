// app/page.tsx

import React, { useEffect, useState } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField } from '@mui/material';

// Define the Item type
type Item = {
  id: number;
  name: string;
  description: string;
};

const HomePage = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState<{ name: string; description: string }>({ name: '', description: '' });

  // Fetch all items when the component is mounted
  useEffect(() => {
    const fetchItems = async () => {
      const res = await fetch('/api/items');
      const data = await res.json();
      setItems(data);
    };
    fetchItems();
  }, []);

  // Add a new item
  const handleAddItem = async () => {
    const res = await fetch('/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newItem),
    });
    const data = await res.json();
    setItems([...items, data]);
    setNewItem({ name: '', description: '' });
  };

  // Delete an item
  const handleDeleteItem = async (id: number) => {
    const res = await fetch('/api/items', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  // Update an item
  const handleUpdateItem = async (id: number) => {
    const updatedItem = {
      id,
      name: prompt('Enter new name:', ''),
      description: prompt('Enter new description:', ''),
    };
    const res = await fetch('/api/items', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedItem),
    });
    const data = await res.json();
    setItems(items.map(item => (item.id === id ? data : item)));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>CRUD Operations with Next.js</h1>
      <div>
        <TextField
          label="Name"
          value={newItem.name}
          onChange={(e: { target: { value: any; }; }) => setNewItem({ ...newItem, name: e.target.value })}
          variant="outlined"
          style={{ marginRight: '10px' }}
        />
        <TextField
          label="Description"
          value={newItem.description}
          onChange={(e:any) => setNewItem({ ...newItem, description: e.target.value })}
          variant="outlined"
          style={{ marginRight: '10px' }}
        />
        <Button variant="contained" color="primary" onClick={handleAddItem}>Add Item</Button>
      </div>

      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleUpdateItem(item.id)}
                    style={{ marginRight: '10px' }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default HomePage;
