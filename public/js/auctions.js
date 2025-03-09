/**
 * Auctions page specific JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeAuctionFilters();
    initializeAuctionTimers();
    initializeBidButtons();
  });
  
  /**
   * Initialize auction filters
   */
  function initializeAuctionFilters() {
    const filterButtons = document.querySelectorAll('.px-3.py-1.rounded-full');
    const auctionItems = document.querySelectorAll('.grid.grid-cols-3 > div');
    
    // Click event for filter buttons
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => {
          btn.classList.remove('bg-primary', 'text-white');
          btn.classList.add('bg-gray-100', 'text-black');
        });
        
        // Add active class to clicked button
        button.classList.add('bg-primary', 'text-white');
        button.classList.remove('bg-gray-100', 'text-black');
        
        // Get the category to filter
        const category = button.textContent.trim().toUpperCase();
        
        // Filter the auction items
        if (category === 'ALL') {
          // Show all items
          auctionItems.forEach(item => {
            item.style.display = 'block';
            item.classList.add('animate-fadeIn');
          });
        } else {
          // Show only matching items
          auctionItems.forEach(item => {
            const itemCategory = item.querySelector('.text-xs.rounded-full').textContent.trim();
            
            if (itemCategory === category) {
              item.style.display = 'block';
              item.classList.add('animate-fadeIn');
            } else {
              item.style.display = 'none';
            }
          });
        }
      });
    });
    
    // Search functionality
    const searchInput = document.querySelector('input[placeholder="Search auctions..."]');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        auctionItems.forEach(item => {
          const title = item.querySelector('h3').textContent.toLowerCase();
          const description = item.querySelector('p').textContent.toLowerCase();
          const category = item.querySelector('.text-xs.rounded-full').textContent.toLowerCase();
          
          if (title.includes(searchTerm) || description.includes(searchTerm) || category.includes(searchTerm)) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    }
    
    // Sort functionality
    const sortSelect = document.querySelector('select');
    if (sortSelect) {
      sortSelect.addEventListener('change', () => {
        const sortOption = sortSelect.value;
        const auctionItemsArray = Array.from(auctionItems);
        
        // Sort auction items
        auctionItemsArray.sort((a, b) => {
          if (sortOption === 'Ending Soon') {
            const timeA = a.querySelector('.text-xl.font-bold.text-black.text-right').textContent;
            const timeB = b.querySelector('.text-xl.font-bold.text-black.text-right').textContent;
            
            const minutesA = parseTimeString(timeA);
            const minutesB = parseTimeString(timeB);
            
            return minutesA - minutesB;
          } else if (sortOption === 'Price: Low to High') {
            const priceA = parseFloat(a.querySelector('.text-xl.font-bold.text-black:not(.text-right)').textContent.replace('$', ''));
            const priceB = parseFloat(b.querySelector('.text-xl.font-bold.text-black:not(.text-right)').textContent.replace('$', ''));
            
            return priceA - priceB;
          } else if (sortOption === 'Price: High to Low') {
            const priceA = parseFloat(a.querySelector('.text-xl.font-bold.text-black:not(.text-right)').textContent.replace('$', ''));
            const priceB = parseFloat(b.querySelector('.text-xl.font-bold.text-black:not(.text-right)').textContent.replace('$', ''));
            
            return priceB - priceA;
          }
          
          return 0;
        });
        
        // Re-append sorted items
        const parentGrid = auctionItems[0].parentNode;
        auctionItemsArray.forEach(item => {
          parentGrid.appendChild(item);
        });
      });
    }
  }
  
  /**
   * Helper function to parse time string (HH:MM:SS) to total minutes
   * @param {string} timeString 
   * @returns {number} - Total minutes
   */
  function parseTimeString(timeString) {
    const parts = timeString.split(':');
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = parts.length > 2 ? parseInt(parts[2], 10) : 0;
    
    return hours * 60 + minutes + seconds / 60;
  }
  
  /**
   * Initialize auction countdown timers
   */
  function initializeAuctionTimers() {
    const timerElements = document.querySelectorAll('.text-xl.font-bold.text-black.text-right');
    
    timerElements.forEach(timer => {
      // Parse the current time
      const timeText = timer.textContent;
      const timeParts = timeText.split(':');
      
      let hours = parseInt(timeParts[0], 10);
      let minutes = parseInt(timeParts[1], 10);
      let seconds = timeParts.length > 2 ? parseInt(timeParts[2], 10) : 0;
      
      // Total seconds
      let totalSeconds = hours * 3600 + minutes * 60 + seconds;
      
      // Update timer every second
      const interval = setInterval(() => {
        totalSeconds -= 1;
        
        if (totalSeconds <= 0) {
          clearInterval(interval);
          timer.textContent = "Ended";
          
          // Change the bid button to "Auction Ended"
          const bidButton = timer.closest('.bg-white.rounded-xl').querySelector('.bg-primary.rounded-full');
          if (bidButton) {
            bidButton.textContent = "Auction Ended";
            bidButton.classList.add('bg-gray-400');
            bidButton.classList.remove('bg-primary');
            bidButton.style.pointerEvents = 'none';
          }
          
          return;
        }
        
        // Calculate hours, minutes, seconds
        hours = Math.floor(totalSeconds / 3600);
        minutes = Math.floor((totalSeconds % 3600) / 60);
        seconds = totalSeconds % 60;
        
        // Format the time
        timer.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }, 1000);
    });
  }
  
  /**
   * Initialize bid buttons
   */
  function initializeBidButtons() {
    const bidButtons = document.querySelectorAll('.w-full.py-2.bg-primary.rounded-full');
    
    bidButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        // For demo purposes, show a notification if not logged in
        const isLoggedIn = localStorage.getItem('user') !== null;
        
        if (!isLoggedIn) {
          e.preventDefault();
          showNotification('Please sign in to place a bid', 'error');
        }
      });
    });
  }