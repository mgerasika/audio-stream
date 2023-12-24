

  // Replace 'input_stream_url' with your actual live audio stream URL
  const inputUrl = 'http://media-ice.musicradio.com/LBCUKMP3Low';

  const express = require('express');
  const http = require('http');
  const ffmpeg = require('fluent-ffmpeg');
  const fs = require('fs');
  
  const app = express();
  const server = http.createServer(app);
  
  const port = 3000;
  
  app.get('/stream', (req, res) => {
    console.log('Streaming requested');
  

  
    // Set the proper headers for streaming
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', 'inline'); // This is important for playback
  
    // Ensure the response is not sent before streaming starts
    res.flushHeaders();
  
    // Start streaming
    const ffmpegProcess = ffmpeg()
      .input(inputUrl)
      .audioBitrate('64k')
      .audioCodec('libmp3lame')
      .format('mp3')
      .on('end', () => {
        console.log('Streaming completed successfully.');
        res.end();
      })
      .on('error', (err) => {
        console.error('Error:', err);
        res.status(500).send('Error during streaming.');
      });
  
    // Pipe the output directly to the response stream
    ffmpegProcess.pipe(res, { end: true });
  
    // Handle client disconnect
    req.on('close', () => {
      console.log('Client disconnected');
      ffmpegProcess.kill('SIGINT'); // Stop FFmpeg process when a client disconnects
    });
  });
  
  server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
  