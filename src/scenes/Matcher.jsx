import React, { useState, useEffect } from "react";
import { useTheme } from '@mui/material/styles';
import { Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, TextField, Snackbar, Alert  } from "@mui/material";

const Matcher = () => {
  const theme = useTheme();

  const [treeData, setTreeData] = useState([
    { id: 1, price: 100, amount: 10, side: 'Buy' },
    { id: 2, price: 200, amount: 20, side: 'Sell' },
    { id: 3, price: 300, amount: 30, side: 'Buy' },
    { id: 4, price: 400, amount: 40, side: 'Sell' },
    { id: 5, price: 500, amount: 50, side: 'Buy' },
  ]);

  const [matcherId, setMatcherId] = useState('');
  const [orderBook, setOrderBook] = useState([]);
  const [batchList, setBatchList] = useState([]);
  const [batchID, setBatchID] = useState("");
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

  const fetchLimitOrderBook = () => {
    fetch('http://127.0.0.1:7000/matcher/get-local-order-book')
      .then(response => response.json())
      .then(data => {
        setMatcherId(data[0].MatcherID)
        const matcher0 = data[0];
        const combinedOrders = matcher0.AskOrders.concat(matcher0.BidOrders).map(order => ({
          id: order.ID.slice(0, 8),
          price: order.Price,
          amount: order.Amount,
          side: order.Side ? "Buy" : "Sell",
        }));
        console.log(combinedOrders)
        setOrderBook(combinedOrders)
        openSnackbar("Successfully!", "success");
      })
      .catch(error => {
        console.error('Error fetching order book:', error);
        openSnackbar("Error", "error");
      });
  };

  const fetchBatchList = () => {
    fetch('http://127.0.0.1:7000/matcher/get-batches')
      .then(response => response.json())
      .then(data => {
        const matcher0 = data[0];
        const combinedOrders = []
        console.log('batch');
        
        console.log(matcher0.Batches);
        
        for (let i = 0; i < matcher0.Batches.length; i++) {
          const batch = matcher0.Batches[i];
          combinedOrders.push({
            id: batch.BatchID,
            price: batch.Price,
            amount: batch.Amount,
            side: batch.Side ? "Buy" : "Sell",
            noorders: batch.Orders.length,
            status: batch.Status,
          });
        }
        console.log(combinedOrders)
        setBatchList(combinedOrders)
        openSnackbar("Successfully!", "success");
      })
      .catch(error => {
        console.error('Error fetching order book:', error);
        openSnackbar("Error", "error");
      });
  };

  useEffect(() => {
    fetchLimitOrderBook()
    fetchBatchList()
  }, []);

  const handleMatching = () => {
    fetch("http://127.0.0.1:7000/matcher/matching", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ batchID }),
    })
      .then(response => response.json())
      .then(data => {
        console.log("Matching response:", data);
        setTimeout(fetchLimitOrderBook, 500);
        openSnackbar("Successfully!", "success");
      })
      .catch(error => {
        console.error('Error during matching:', error)
        openSnackbar("Error", "error");
      });
  };

  const handleBatching = () => {
    fetch("http://127.0.0.1:7000/matcher/batching", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ batchID }),
    })
      .then(response => response.json())
      .then(data => {
        console.log("Matching response:", data);
        setTimeout(fetchBatchList, 500);
        setTimeout(fetchLimitOrderBook, 500);
        openSnackbar("Successfully!", "success");
      })
      .catch(error => {
        console.error('Error during matching:', error)
        openSnackbar("Error", "error");
      });
  };

  const handleSendBatches = () => {
    fetch("http://127.0.0.1:7000/matcher/send-batches", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ batchID }),
    })
      .then(response => response.json())
      .then(data => {
        console.log("Matching response:", data);
        setTimeout(fetchBatchList, 500);
        openSnackbar("Successfully!", "success");
      })
      .catch(error => {
        console.error('Error during matching:', error)
        openSnackbar("Error", "error");
      });
  };

  const handleBatchSubmit = (event, batchID) => {
    event.preventDefault();

    for (let i = 0; i < batchList.length; i++) {
      if (batchList[i].id.slice(0, 8) === batchID) {
        batchID = batchList[i].id;
    }
  }

    const payload = {
      "MatcherID": matcherId,
      "BatchID": batchID,
    }
    console.log("payload:", payload);
    
    fetch("http://127.0.0.1:7000/matcher/send-batch-details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then(data => {
        console.log("Matching response:", data);
        setTimeout(fetchBatchList, 500);
        openSnackbar("Successfully!", "success");
      })
      .catch(error => {
        console.error('Error during matching:', error)
        openSnackbar("Error", "error");
      });
  };

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
    padding: 'none',
    whiteSpace: 'nowrap',
    textAlign: 'center',
    fontSize: '1rem',
    backgroundColor: theme.palette.headerBg.main,
  };

  return (
    <Box sx={{ minHeight: 352 }}>
      <Grid container spacing={4}>
        <Grid item xs={1} />
        <Grid item xs={10}>
          <Grid container spacing={4}>
            <Grid item xs={5}>
              <Typography variant="h2" component="h2" gutterBottom>
                Limit Order Book
              </Typography>
              <Button onClick={handleMatching} variant="contained" color="secondary" sx={{ marginBottom: 2 }}>
                Matching
              </Button>
              <Button onClick={handleBatching} variant="contained" color="secondary" sx={{ marginLeft: 10, marginBottom: 2 }}>
                Batching
              </Button>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={headerCellStyles}>Order ID</TableCell>
                      <TableCell sx={headerCellStyles}>Price</TableCell>
                      <TableCell sx={headerCellStyles}>Amount</TableCell>
                      <TableCell sx={headerCellStyles}>Side</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orderBook.map((row) => (
                      <TableRow
                        key={row.id}
                        sx={lobRowStyles(row)}
                      >
                        <TableCell sx={cellStyles}>{row.id}</TableCell>
                        <TableCell sx={cellStyles}>{row.price}</TableCell>
                        <TableCell sx={cellStyles}>{row.amount}</TableCell>
                        <TableCell sx={cellStyles}>{row.side}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            {/* <Grid item xs={0} /> */}
            <Grid item xs={7}>
              <Typography variant="h2" component="h2" gutterBottom>
                List of Batches
              </Typography>
              <Button onClick={handleSendBatches} variant="contained" color="secondary" sx={{ marginBottom: 2 }}>
                Send Batches
              </Button>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={headerCellStyles}>Batch ID</TableCell>
                      <TableCell sx={headerCellStyles}>Price</TableCell>
                      <TableCell sx={headerCellStyles}>Amount</TableCell>
                      <TableCell sx={headerCellStyles}>No. Order</TableCell>
                      <TableCell sx={headerCellStyles}>Side</TableCell>
                      <TableCell sx={headerCellStyles}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {batchList.map((row, index) => (
                      <TableRow key={row.id}>
                        <TableCell sx={cellStyles}>{row.id.slice(0, 8)}</TableCell>
                        <TableCell sx={cellStyles}>{row.price}</TableCell>
                        <TableCell sx={cellStyles}>{row.amount}</TableCell>
                        <TableCell sx={cellStyles}>{row.noorders}</TableCell>
                        <TableCell sx={cellStyles}>{row.side}</TableCell>
                        <TableCell sx={cellStyles}>{row.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box component="form" onSubmit={(e) => handleBatchSubmit(e, batchID)} sx={{ marginTop: 4 }}>
                <TextField
                  label="BatchID"
                  value={batchID}
                  onChange={(e) => setBatchID(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                />
                <Button type="submit" variant="contained" color="secondary">
                  Submit batch details
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={1} />
      </Grid>

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

export default Matcher;