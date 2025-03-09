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
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html at root
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// In-memory auction state
let currentBid = 5.00; // initial bid in USDT
let bidCount = 1;
let timeRemaining = 30; // universal timer in seconds

// Universal timer logic on the server
const timerInterval = setInterval(() => {
  if (timeRemaining <= 0) {
    clearInterval(timerInterval);
    io.emit('auctionEnded', { winner: "Last Bidder" }); // Optionally, include winner info
  } else {
    timeRemaining--;
    io.emit('timerUpdate', { timeRemaining });
  }
}, 1000);

// When a new bid is placed, add extra time (e.g., 5 seconds)
function addExtraTime(seconds: number) {
  timeRemaining += seconds;
}

const placeBidHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bidderWallet, txHash } = req.body;
    if (!bidderWallet || !txHash) {
      res.status(400).json({ success: false, error: 'Missing required bid data' });
      return;
    }
    
    const increment = 0.10; // Fixed increment in USDT
    currentBid += increment;
    bidCount++;

    // Add extra time when a bid is placed
    addExtraTime(5);

    // Broadcast new bid data and updated timer
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
