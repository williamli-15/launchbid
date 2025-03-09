import express, { Request, Response, RequestHandler } from 'express';
import cors from 'cors';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';
import 'dotenv/config';

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html at root
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// In-memory auction state (for demo purposes)
let currentBid = 5.00; // initial bid in USDT
let bidCount = 1;

const placeBidHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bidderWallet, txHash } = req.body;
    if (!bidderWallet || !txHash) {
      res.status(400).json({ success: false, error: 'Missing required bid data' });
      return;
    }
    
    // Increment the bid by 0.10 USDT.
    const increment = 0.10;
    currentBid += increment;
    bidCount++;

    // Broadcast new bid data to all connected clients.
    io.emit('newBid', { newBidPrice: currentBid, txHash, bidderWallet, bidCount });
    
    res.json({ success: true, newBidPrice: currentBid, txHash, bidCount });
  } catch (error: any) {
    console.error('Error processing bid:', error);
    res.status(500).json({ success: false, error: error.message || error });
  }
};

app.post('/api/placeBid', placeBidHandler);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
