# Launchbid - Two-Sided Penny Auction with Direct Offerings

Launchbid is a web platform that connects startups with early supporters through penny auctions, equity offerings, and microloans. This repository contains the HTML, CSS, and JavaScript files for the front-end of the application.

## Features

- **Penny Auctions**: Users can bid on exclusive early products from startups with micropayments
- **Microequity**: Users can purchase small equity stakes in promising startups
- **Microloans**: Users can lend small amounts to startups and earn interest

## Pages

1. **Home (index.html)**: Landing page with featured auctions and platform overview
2. **Auctions (auctions.html)**: Browse all available penny auctions
3. **Auction Detail (auction-detail.html)**: Detailed view of a specific auction with bidding functionality
4. **Microequity (equity.html)**: Browse equity offerings from startups
5. **Microloans (loans.html)**: Browse loan opportunities

## Project Structure

```
launchbid/
│
├── index.html              # Home page
├── auctions.html           # Auctions listing page
├── auction-detail.html     # Auction detail page
├── equity.html             # Microequity page
├── loans.html              # Microloans page
│
├── css/
│   └── main.css            # Main stylesheet
│
├── js/
│   ├── main.js             # Common JavaScript functionality
│   ├── auctions.js         # Auctions page specific JavaScript
│   ├── auction-detail.js   # Auction detail page JavaScript
│   ├── equity.js           # Equity page JavaScript
│   └── loans.js            # Loans page JavaScript
│
└── README.md               # Project documentation
```

## Getting Started

### Prerequisites

This is a static website that uses:
- HTML5
- CSS3 with Tailwind CSS via CDN
- JavaScript (ES6+)
- Material Icons

No build steps or package installations are required.

### Running Locally

1. Clone the repository:
   ```
   git clone https://github.com/your-username/launchbid.git
   cd launchbid
   ```

2. Open the project in your code editor

3. Start a local server:

   Using Python:
   ```
   python -m http.server
   ```

   Or using Node.js:
   ```
   npx serve
   ```

4. Visit `http://localhost:8000` (or the port specified by your local server)

## Production Deployment

For production deployment, consider the following steps:

1. Optimize images and assets
2. Minify CSS and JavaScript files
3. Implement proper error handling
4. Add analytics
5. Deploy to a hosting service like Netlify, Vercel, or traditional web hosting

## Backend Integration

This repository only contains the front-end code. For a complete application, you'll need to:

1. Set up a backend API (using Node.js, Django, Rails, etc.)
2. Implement user authentication and account management
3. Create database models for auctions, equity offerings, and loan opportunities
4. Implement payment processing
5. Set up real-time updates for bidding

## Future Enhancements

- User profile pages and dashboards
- Notification system
- Mobile app version
- Enhanced search and filtering
- Social sharing functionality
- KYC/AML verification for equity investments
- Advanced analytics for investors

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- All images from [Unsplash](https://unsplash.com/)
- Icons from [Material Icons](https://material.io/resources/icons/)
- CSS framework by [Tailwind CSS](https://tailwindcss.com/)