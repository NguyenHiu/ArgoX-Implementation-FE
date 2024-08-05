import React, { useState, useEffect } from 'react';
import { Box, Typography, Snackbar, Alert, TextField, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

const User = () => {
  const [treeData, setTreeData] = useState([]);
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [side, setSide] = useState('Buy');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      "price": parseInt(price),
      "amount": parseInt(amount),
      "side": side == "Buy" ? true : false,
    };

    fetch("http://127.0.0.1:7000/user/send-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        setSnackbarMessage("Success: Order sent successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      })
      .catch((error) => {
        console.error("Error:", error);
        setSnackbarMessage("Error: Failed to send order.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box
      sx={{
        marginLeft: 20,
        marginRight: 2,
        maxWidth: 400,
        minHeight: 352,
        "& .MuiTreeItem-root .MuiTreeItem-label": { fontSize: "1rem" },
      }}
    >
      <Typography variant="h2" component="h2" gutterBottom>
        Create Order
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="side-label" shrink={Boolean(side)}>
            Side
          </InputLabel>
          <Select
            labelId="side-label"
            value={side}
            onChange={(e) => setSide(e.target.value)}
            label="Side"
            sx={{
              '& .MuiInputLabel-shrink': {
                backgroundColor: 'white',
                padding: '0 4px',
              },
            }}
          >
            <MenuItem value="Buy">Buy</MenuItem>
            <MenuItem value="Sell">Sell</MenuItem>
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" color="secondary">
          Submit
        </Button>
      </form>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ 
          width: '100%' ,
          maxWidth: '600px', // Adjust the max width
          fontSize: '1.2rem', // Adjust the font size
          padding: '16px' // Adjust the padding
        }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default User;