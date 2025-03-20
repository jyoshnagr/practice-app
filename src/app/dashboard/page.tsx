"use client"
import { get } from 'http';
import { Metadata } from 'next';
import { useEffect, useState } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField,   Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box, } from '@mui/material';
import { title } from 'process';
import HeaderSection from '../components/header-section';
import SideMenu from '../components/sidemenu';


const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Dashboard page',
};

type Product ={
  _id: string,
  id: string,
  title: string,
  desc: string,
  qty: number
  date: Date
}

const Dashboard = () => {
  // Sample data for the dashboard
  // const items = [
  //   { id: 1, name: 'Product 1', description: 'Description of Product 1' },
  //   { id: 2, name: 'Product 2', description: 'Description of Product 2' },
  //   { id: 3, name: 'Product 3', description: 'Description of Product 3' },
  // ];
  const [products, setProducts] = useState<Product[]>([]);
  const [action, setAction] = useState<'Add' | 'Edit'>('Add');
  const [editItem, setEditItem] = useState<Product | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newItem, setNewItem] = useState<{ id: string, title: string; desc: string, qty: number, date?: Date }>({
    id: '',
    title: '',
    desc: '',
    qty: 0,
  });

  useEffect(() => {
      if (!newItem.date) {
          setNewItem((prev) => ({ ...prev, date: new Date() }));
      }
  }, []);

  
  useEffect(()=>{
    const fetchProducts = async () =>{
      const res = await fetch('http://localhost:3003/api/products')
      const data = await res.json()
      setProducts(data?.products)
      console.log(data, 'data')
    }
    fetchProducts()
  },[])

  // console.log(products, 'products')

  // Handle button click for each item
  const handleClick = (id: number) => {
    alert(`You clicked on Item ${id}`);
  };

  const handleFormSubmit = (action: 'Add' | 'Edit') => {
    if (action === 'Add') {
      handleAddItem();
    } else if (action === 'Edit') {
      handleUpdateItem(editItem?.id || '');
    }
  };

  const handleAddItem = async () => {
    const res  = await fetch('http://localhost:3003/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newItem)
    })

    if(res.status == 201){
      let data = await res.json();
      console.log(data, 'data')
      if (data?.products) {
        setProducts(data.products); // Update products safely
      } else {
        console.error("API response is missing products array:", data);
      }
    }else{
      alert('Product not added')
    }
    setOpenDialog(false)
    setNewItem({ id: '', title: '', desc: '', qty: 0, date: new Date() })
    setEditItem(null)

  }

  async function handleUpdateItem(id: string){
    if (!editItem) return;
    console.log(editItem, 'editItem')
    const updatedItem = {
      _id: editItem?._id,
      id: editItem?.id,
      title: editItem?.title,
      desc: editItem?.desc,
      qty: editItem?.qty,
    }
    let response = await fetch(`http://localhost:3003/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedItem)
    })
    if(response.status ==200){
      let data = await response.json();
      console.log(data, 'data')
      setProducts(data?.products)
    }else{
      alert('Product not updated')
    }
    setOpenDialog(false)
    setNewItem({ id: '', title: '', desc: '', qty: 0, date: new Date() })
    setEditItem(null)

  }

  const handleDeleteItem = async (item: Product) => {
    let reqBody = {...item}
    const res = await fetch(`http://localhost:3003/api/products/${item?.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reqBody)
    });
    const data = await res.json();
    if (res.ok) {
      setProducts(data?.products);
    }else{
      alert('Product not Deleted')
    }
  }

  const handleEditClick = (item: Product) => {
    setAction('Edit')
    setEditItem(item); // Set the item to Edit
    setOpenDialog(true); // Open the dialog
  };

  const handleAddOrder = (item: Product) => {
    setAction('Add')
    setEditItem(item); // Set the item to Edit
    setOpenDialog(true); // Open the dialog
  };

   // Handle closing the dialog
   const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditItem(null);
    setNewItem({ id: '', title: '', desc: '', qty: 0, date: new Date() })
  };

  return (
    <div style={{ padding: '20px' }}>
      <HeaderSection handleAddClick={handleAddOrder} />
    {/* <div>
      <TextField
        label="Title"
        value={newItem.title}
        onChange={(e: { target: { value: any; }; }) => setNewItem({ ...newItem, title: e.target.value })}
        variant="outlined"
        style={{ marginRight: '10px' }}
      />
      <TextField
        label="Description"
        value={newItem.desc}
        onChange={(e:any) => setNewItem({ ...newItem, desc: e.target.value })}
        variant="outlined"
        style={{ marginRight: '10px' }}
      />
      <TextField
        label="Quantity"
        value={newItem.qty}
        onChange={(e:any) => setNewItem({ ...newItem, qty: e.target.value })}
        variant="outlined"
        style={{ marginRight: '10px' }}
      />
      <Button variant="contained" color="primary" onClick={() => handleAddOrder(newItem)} >Add Item</Button>
    </div> */}

    <TableContainer component={Paper} style={{ marginTop: '25px' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Available Quantity</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products?.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.title}</TableCell>
              <TableCell>{item.desc}</TableCell>
              <TableCell>{item.qty}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleEditClick(item)}
                  style={{ marginRight: '10px' }}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleDeleteItem(item)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle> {action === "Edit" ? "Edit Item" : "Add Item"} </DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            value={action === "Edit" ? editItem?.title ?? "" : newItem.title ?? ""}
            onChange={(e) =>
              action === "Edit"?
              setEditItem(editItem ? { ...editItem, title: e.target.value } : null):
              setNewItem({ ...newItem, title: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={action === "Edit" ? editItem?.desc ?? "" : newItem.desc ?? ""}
            onChange={(e) =>
              action === "Edit"?
              setEditItem(editItem ? { ...editItem, desc: e.target.value } : null):
              setNewItem({ ...newItem, desc: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Quantity"
            type="number"
            value={action === "Edit" ? editItem?.qty ?? 0 : newItem.qty ?? 0}
            onChange={(e) =>
              action === "Edit"?
              setEditItem(editItem ? { ...editItem, qty: parseInt(e.target.value) } : null):
              setNewItem({ ...newItem, qty: parseInt(e.target.value) })
            }
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={() => handleFormSubmit(action)} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
  </div>
  );
};

export default Dashboard;
