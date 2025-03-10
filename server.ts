import express, { Request, Response, RequestHandler } from 'express';
import cors from 'cors';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';
import 'dotenv/config';

const app = express();
const server = http.createServer(app);
const io = new Server(server, { 
  cors: { origin: '*' },
  // Add reconnection settings to improve reliability
  connectionStateRecovery: {
    maxDisconnectionDuration: 30000
  }
});
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html at root
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// In-memory auction state
interface AuctionState {
  currentBid: number;
  bidCount: number;
  timeRemaining: number;
  lastBidder: string | null;
  isActive: boolean;
}

// For now, just track a single auction - could be expanded to multiple auctions
const auction: AuctionState = {
  currentBid: 5.00, // initial bid in USDT
  bidCount: 1,
  timeRemaining: 300, // universal timer in seconds
  lastBidder: null,
  isActive: true
};

// Universal timer logic on the server
const timerInterval = setInterval(() => {
  if (!auction.isActive) {
    clearInterval(timerInterval);
    return;
  }

  if (auction.timeRemaining <= 0) {
    auction.isActive = false;
    clearInterval(timerInterval);
    io.emit('auctionEnded', { 
      winner: auction.lastBidder || "No bids"
    });
    console.log(`Auction ended. Winner: ${auction.lastBidder || "No bids"}`);
  } else {
    auction.timeRemaining--;
    io.emit('timerUpdate', { timeRemaining: auction.timeRemaining });
  }
}, 1000);

// When a new bid is placed, add extra time
function addExtraTime(seconds: number): void {
  if (auction.isActive) {
    auction.timeRemaining += seconds;
    console.log(`Added ${seconds}s to timer. New time remaining: ${auction.timeRemaining}s`);
  }
}

const placeBidHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if auction is still active
    if (!auction.isActive) {
      res.status(400).json({ 
        success: false, 
        error: 'Auction has ended' 
      });
      return;
    }

    const { bidderWallet, txHash } = req.body;
    
    // Validate required fields
    if (!bidderWallet || !txHash) {
      res.status(400).json({ 
        success: false, 
        error: 'Missing required bid data' 
      });
      return;
    }
    
    const increment = 0.10; // Fixed increment in USDT
    auction.currentBid += increment;
    auction.bidCount++;
    auction.lastBidder = bidderWallet;
    
    // Add extra time when a bid is placed
    addExtraTime(5);
    
    // Broadcast new bid data
    io.emit('newBid', { 
      newBidPrice: auction.currentBid, 
      txHash, 
      bidderWallet, 
      bidCount: auction.bidCount 
    });
    
    console.log(`New bid: $${auction.currentBid.toFixed(2)} by ${bidderWallet}`);
    
    res.json({ 
      success: true, 
      newBidPrice: auction.currentBid, 
      txHash, 
      bidCount: auction.bidCount 
    });
  } catch (error: any) {
    console.error('Error processing bid:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || String(error) 
    });
  }
};

// Handle bid placement via API
app.post('/api/placeBid', placeBidHandler);

// When a new client connects, send them the current auction state
io.on('connection', (socket) => {
  console.log('Client connected');
  
  // Send current auction state to newly connected client
  socket.emit('timerUpdate', { timeRemaining: auction.timeRemaining });
  
  // If auction has already ended, send that info too
  if (!auction.isActive) {
    socket.emit('auctionEnded', { 
      winner: auction.lastBidder || "No bids" 
    });
  }
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Error handling for the Express server
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error' 
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Server shutting down');
  io.close();
  server.close();
  process.exit(0);
});