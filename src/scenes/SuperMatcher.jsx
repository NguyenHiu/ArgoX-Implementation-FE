import React, { useState, useEffect } from "react";
import { useTheme } from '@mui/material/styles';
import { Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Snackbar, Alert } from "@mui/material";

const SuperMatcher = () => {
  const theme = useTheme();
  const [batches, setBatches] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const fetchBatches = async () => {
    fetch('http://127.0.0.1:7000/super-matcher/get-batches')
      .then(response => response.json())
      .then(data => {
        let _data = []
        console.log(data.Batches);
        
        for (let i = 0; i < data.Batches.length; i++) {
          _data.push({
            id: data.Batches[i].BatchID.slice(0,8),
            validMatcher: data.Batches[i].IsValidmatcher,
            validSignature: data.Batches[i].IsValidSignature,
            noOrders: data.Batches[i].Orders.length,
            validOrders: data.Batches[i].IsValidOrdersSignature.toString(),
            duplicateOrders: data.Batches[i].DuplicateOrders.length,
            isSent: data.Batches[i].IsSent,
          })
        }
        setBatches(_data);
        setSnackbar({ open: true, message: 'Batches fetched successfully', severity: 'success' });
      })
      .catch(error => {
        console.error('Error fetching batches:', error);
        setSnackbar({ open: true, message: 'Error fetching batches', severity: 'error' });
      });
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const handleSendBatches = async () => {
    fetch('http://127.0.0.1:7000/super-matcher/send-batches', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })
      .then(response => response.json())
      .then(data => {
        console.log("Send Batches response:", data);
        setSnackbar({ open: true, message: 'Batches sent successfully', severity: 'success' });
        setTimeout(fetchBatches, 500);
      })
      .catch(error => {
        console.error('Error sending batches:', error);
        setSnackbar({ open: true, message: 'Error sending batches', severity: 'error' });
      });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={1} />
      <Grid item xs={10}>
        <Box sx={{ minHeight: 352 }}>
          <Typography variant="h2" gutterBottom>
            List of batches
          </Typography>
          <Button onClick={handleSendBatches} variant="contained" color="secondary" sx={{ marginBottom: 2 }}>
            Send batches
            </Button>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center"  sx={{ fontSize: '1rem', backgroundColor: theme.palette.headerBg.main }}>ID</TableCell>
                  <TableCell align="center"  sx={{ fontSize: '1rem', backgroundColor: theme.palette.headerBg.main }}>Valid matcher</TableCell>
                  <TableCell align="center"  sx={{ fontSize: '1rem', backgroundColor: theme.palette.headerBg.main }}>Valid signature</TableCell>
                  <TableCell align="center"  sx={{ fontSize: '1rem', backgroundColor: theme.palette.headerBg.main }}>No Orders</TableCell>
                  <TableCell align="center"  sx={{ fontSize: '1rem', backgroundColor: theme.palette.headerBg.main }}>Valid orders</TableCell>
                  <TableCell align="center"  sx={{ fontSize: '1rem', backgroundColor: theme.palette.headerBg.main }}>Duplicate orders</TableCell>
                  <TableCell align="center"  sx={{ fontSize: '1rem', backgroundColor: theme.palette.headerBg.main }}>Is sent</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {batches.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell align="center"  sx={{ fontSize: '1rem'}}>{row.id}</TableCell>
                    <TableCell align="center"  sx={{ fontSize: '1rem'}}>{row.validMatcher ? "Yes" : "No"}</TableCell>
                    <TableCell align="center"  sx={{ fontSize: '1rem'}}>{row.validSignature ? "Yes" : "No"}</TableCell>
                    <TableCell align="center"  sx={{ fontSize: '1rem'}}>{row.noOrders}</TableCell>
                    <TableCell align="center"  sx={{ fontSize: '1rem'}}>{row.validOrders ? "Yes" : "No"}</TableCell>
                    <TableCell align="center"  sx={{ fontSize: '1rem'}}>{row.duplicateOrders}</TableCell>
                    <TableCell align="center"  sx={{ fontSize: '1rem'}}>{row.isSent ? "Yes" : "No"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Grid>
      <Grid item xs={1} />
    </Grid>
  );
};

export default SuperMatcher;