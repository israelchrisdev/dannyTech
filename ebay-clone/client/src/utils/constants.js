export const categories = [
  { id: '1', name: 'Antiques' },
  { id: '2', name: 'Art' },
  { id: '3', name: 'Baby' },
  { id: '4', name: 'Books' },
  { id: '5', name: 'Business & Industrial' },
  { id: '6', name: 'Cameras & Photo' },
  { id: '7', name: 'Cell Phones & Accessories' },
  { id: '8', name: 'Clothing, Shoes & Accessories' },
  { id: '9', name: 'Coins & Paper Money' },
  { id: '10', name: 'Collectibles' },
  { id: '11', name: 'Computers/Tablets & Networking' },
  { id: '12', name: 'Consumer Electronics' },
  { id: '13', name: 'Crafts' },
  { id: '14', name: 'Dolls & Bears' },
  { id: '15', name: 'DVDs & Movies' },
  { id: '16', name: 'Entertainment Memorabilia' },
  { id: '17', name: 'Gift Cards & Coupons' },
  { id: '18', name: 'Health & Beauty' },
  { id: '19', name: 'Home & Garden' },
  { id: '20', name: 'Jewelry & Watches' },
  { id: '21', name: 'Music' },
  { id: '22', name: 'Musical Instruments & Gear' },
  { id: '23', name: 'Pet Supplies' },
  { id: '24', name: 'Pottery & Glass' },
  { id: '25', name: 'Real Estate' },
  { id: '26', name: 'Specialty Services' },
  { id: '27', name: 'Sporting Goods' },
  { id: '28', name: 'Sports Mem, Cards & Fan Shop' },
  { id: '29', name: 'Stamps' },
  { id: '30', name: 'Tickets & Experiences' },
  { id: '31', name: 'Toys & Hobbies' },
  { id: '32', name: 'Travel' },
  { id: '33', name: 'Video Games & Consoles' },
  { id: '34', name: 'Everything Else' }
];

export const conditions = [
  { value: 'NEW', label: 'New' },
  { value: 'LIKE_NEW', label: 'Like New' },
  { value: 'GOOD', label: 'Good' },
  { value: 'FAIR', label: 'Fair' },
  { value: 'POOR', label: 'Poor' }
];

export const listingTypes = [
  { value: 'FIXED_PRICE', label: 'Fixed Price' },
  { value: 'AUCTION', label: 'Auction' },
  { value: 'BEST_OFFER', label: 'Best Offer' }
];

export const sortOptions = [
  { value: 'createdAt_desc', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'views_desc', label: 'Most Viewed' },
  { value: 'bids_desc', label: 'Most Bids' },
  { value: 'ending_soon', label: 'Ending Soon' }
];

export const orderStatuses = [
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' }
];

export const paymentMethods = [
  { id: 'visa', name: 'Visa', icon: '💳' },
  { id: 'mastercard', name: 'Mastercard', icon: '💳' },
  { id: 'amex', name: 'American Express', icon: '💳' },
  { id: 'paypal', name: 'PayPal', icon: '📧' },
  { id: 'applepay', name: 'Apple Pay', icon: '🍎' },
  { id: 'googlepay', name: 'Google Pay', icon: 'G' }
];

export const shippingMethods = [
  { id: 'standard', name: 'Standard Shipping', price: 0, days: '5-7' },
  { id: 'express', name: 'Express Shipping', price: 9.99, days: '2-3' },
  { id: 'overnight', name: 'Overnight Shipping', price: 24.99, days: '1' }
];

export const userRoles = {
  USER: 'USER',
  SELLER: 'SELLER',
  ADMIN: 'ADMIN'
};

export const productConditions = {
  NEW: 'NEW',
  LIKE_NEW: 'LIKE_NEW',
  GOOD: 'GOOD',
  FAIR: 'FAIR',
  POOR: 'POOR'
};

export const productStatus = {
  ACTIVE: 'ACTIVE',
  SOLD: 'SOLD',
  ENDED: 'ENDED',
  DRAFT: 'DRAFT'
};

export const notificationTypes = {
  BID: 'BID',
  OUTBID: 'OUTBID',
  WINNING: 'WINNING',
  SOLD: 'SOLD',
  MESSAGE: 'MESSAGE',
  ORDER: 'ORDER',
  SHIPPING: 'SHIPPING',
  REVIEW: 'REVIEW',
  PROMOTION: 'PROMOTION'
};

export const countries = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'JP', name: 'Japan' },
  { code: 'CN', name: 'China' },
  { code: 'IN', name: 'India' },
  { code: 'BR', name: 'Brazil' }
];

export const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' }
];

export const timezones = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Anchorage',
  'Pacific/Honolulu',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Australia/Sydney'
];