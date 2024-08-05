import React, { useState, useEffect } from "react";
import { useTheme } from '@mui/material/styles';
import { Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, TextField, Snackbar, Alert  } from "@mui/material";

const Reporter = () => {
  const theme = useTheme();
  const [batchList, setBatchList] = useState([]);
  const [batchId, setBatchId] = useState('');
  const [waitingTime, setWaitingTime] = useState(60);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [remainingTimes, setRemainingTimes] = useState({});

  const openSnackbar = (msg, severity) => {
    setSnackbarMessage(msg);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  }
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // console.log(remainingTimes);
      console.log(batchList);
      
      let _rTimes = {}
      for (const batch of batchList) {
        const now = new Date();
        _rTimes[batch.id] = parseInt((waitingTime*1000 - (now - batch.matchedTime))/1000);
      }
      setRemainingTimes(_rTimes);
    }, 1000);

    // Cleanup function to clear the interval
    return () => clearInterval(interval);
  }, [batchList]);

  useEffect(() => {
    fetchBatch();
  }, []);

  const fetchBatch = (event) => {
    fetch('http://127.0.0.1:7000/reporter/get-matched-batches')
      .then(response => response.json())
      .then(data => {
        const combinedOrders = []
        for (let i = 0; i < data.Batches.length; i++) {
          const batch = data.Batches[i];
          console.log(batch.MatchedTime);
          combinedOrders.push({
            id: batch.BatchID,
            matchedTime: new Date(batch.MatchedTime*1000),
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

  const handleReportBatch = (event, batchID) => {
    event.preventDefault();

    console.log(batchID);
    console.log(batchList);
    

    for (let i = 0; i < batchList.length; i++) {
      if (batchList[i].id.slice(0, 8) === batchID) {
        batchID = batchList[i].id;
    }
  }

    const payload = {
      "BatchID": batchID,
    }
    console.log("payload:", payload);
    
    fetch("http://127.0.0.1:7000/reporter/report-batch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then(data => {
        console.log("Matching response:", data);
        setTimeout(fetchBatch, 500);
        openSnackbar("Successfully!", "success");
      })
      .catch(error => {
        console.error('Error during matching:', error)
        openSnackbar("Error", "error");
      });
  }

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
            Waiting Batches
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={headerCellStyles}>Batch ID</TableCell>
                  <TableCell align="center" sx={headerCellStyles}>Matched Time</TableCell>
                  <TableCell align="center" sx={headerCellStyles}>Remaining Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {batchList.map((batch) => (
                  <TableRow key={batch.id}>
                    <TableCell align="center" sx={cellStyles}>{batch.id.slice(0, 8)}</TableCell>
                    <TableCell align="center" sx={cellStyles}>{batch.matchedTime.toLocaleTimeString()}</TableCell>
                    <TableCell align="center" sx={cellStyles}>{remainingTimes[batch.id]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box component="form" onSubmit={(e) => handleReportBatch(e, batchId)} sx={{ marginTop: 4 }}>
            <Typography variant="h4" gutterBottom>
              Report Batch
            </Typography>
            <TextField
              label="Batch ID"
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Button type="submit" variant="contained" color="secondary">
              Report Batch
            </Button>
          </Box>
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
      </Grid>
      <Grid item xs={1} />
    </Grid>
  );
};

export default Reporter;