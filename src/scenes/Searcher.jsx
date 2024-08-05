import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import { Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Snackbar, Alert } from '@mui/material';

const Searcher = () => {
  const theme = useTheme();
  const [batchData, setBatchData] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const openSnackbar = (msg, severity) => {
    setSnackbarMessage(msg);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  }
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const fetchBatchData = async () => {
    fetch('http://127.0.0.1:7000/searcher/get-batch-book')
      .then(response => response.json())
      .then(data => {
        const combinedOrders = data.AskBatches.concat(data.BidBatches).map(order => ({
          id: order.BatchID.slice(0, 8),  
          price: order.Price,
          amount: order.Amount,
          side: order.Side ? "Buy" : "Sell",
        }));
        console.log(combinedOrders)
        setBatchData(combinedOrders)
        openSnackbar("Success: Batch submitted successfully!", "success");
      })
      .catch(error => {
        console.error('Error fetching batches:', error);
        openSnackbar("Error: Failed to submit batch.", "error");
      });
  };

  const handleMatching = async () => {
    fetch('http://127.0.0.1:7000/searcher/match-batches')
      .then(response => response.json())
      .then(data => {
        console.log("Matching response:", data);
        setTimeout(fetchBatchData, 500);
        openSnackbar("Success: Batch submitted successfully!", "success");
      })
      .catch(error => {
        console.error('Error fetching batches:', error);
        openSnackbar("Error: Failed to submit batch.", "error");
      });
  };
  
  useEffect(() => {
    fetchBatchData();
  }, []);

  const lobRowStyles = (row) => ({
    backgroundColor: row.side === 'Buy' ? theme.palette.green.main : theme.palette.red.main,
    color: 'white',
    '& .MuiTableCell-root': {
      textAlign: 'center',
    },
  });

  const cellStyles = {
    padding: 'none',
    whiteSpace: 'nowrap',
    textAlign: 'center',
    fontSize: '1rem',
  };

  const headerCellStyles = {
    fontSize: '1rem',
    backgroundColor: theme.palette.headerBg.main,
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={1} />
      <Grid item xs={10}>
        <Box sx={{ minHeight: 352 }}>
          <Typography variant="h2" gutterBottom>
            Batch Book
          </Typography>
          <Button onClick={handleMatching} variant="contained" color="secondary" sx={{ marginBottom: 2 }}>
            Matching
          </Button>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={headerCellStyles}>Batch ID</TableCell>
                  <TableCell align="center" sx={headerCellStyles}>Price</TableCell>
                  <TableCell align="center" sx={headerCellStyles}>Amount</TableCell>
                  <TableCell align="center" sx={headerCellStyles}>Side</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {batchData.map((row) => (
                  <TableRow 
                    key={row.id}
                    sx={lobRowStyles(row)}
                  >
                    <TableCell align="center" sx={cellStyles}>{row.id}</TableCell>
                    <TableCell align="center" sx={cellStyles}>{row.price}</TableCell>
                    <TableCell align="center" sx={cellStyles}>{row.amount}</TableCell>
                    <TableCell align="center" sx={cellStyles}>{row.side}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Grid>
      <Grid item xs={1} />

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
    </Grid>
  );
};

export default Searcher;