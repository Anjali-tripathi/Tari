// Mock data for development without MongoDB
const mockProducts = [
  {
    _id: '1',
    name: 'Margherita Pizza',
    category: 'Pizza',
    description: 'Classic pizza with tomato, mozzarella, and basil',
    price: 299,
    image: 'http://localhost:3000/assets/images/item.jpg',
    availability: true,
    rating: 4.5,
    reviews: 120,
    preparationTime: 25
  },
  {
    _id: '2',
    name: 'Butter Chicken',
    category: 'Indian',
    description: 'Tender chicken in creamy tomato sauce',
    price: 349,
    image: 'http://localhost:3000/assets/images/item2.jpg',
    availability: true,
    rating: 4.7,
    reviews: 200,
    preparationTime: 30
  },
  {
    _id: '3',
    name: 'Special Biryani',
    category: 'Indian',
    description: 'Aromatic rice with spices and tender meat',
    price: 329,
    image: 'http://localhost:3000/assets/images/hero1.jpg',
    availability: true,
    rating: 4.4,
    reviews: 150,
    preparationTime: 35
  },
  {
    _id: '4',
    name: 'Caesar Salad',
    category: 'Salads',
    description: 'Fresh romaine lettuce with parmesan and croutons',
    price: 199,
    image: 'http://localhost:3000/assets/images/hero2.jpg',
    availability: true,
    rating: 4.2,
    reviews: 80,
    preparationTime: 15
  },
  {
    _id: '5',
    name: 'Deluxe Platter',
    category: 'Special',
    description: 'Assorted delicacies for food lovers',
    price: 549,
    image: 'http://localhost:3000/assets/images/herosecimg.jpg',
    availability: true,
    rating: 4.8,
    reviews: 180,
    preparationTime: 40
  }
];

const mockUsers = [
  {
    _id: '1',
    name: 'anjali',
    email: 'anjali@gmail.com',
    phone: '9876543210',
    role: 'user',
    password: 'anjali123',
    address: '123 Main St'
  },
  {
    _id: 'admin1',
    name: 'Admin User',
    email: 'admin@tari.com',
    phone: '1234567890',
    password: 'admin123',
    role: 'admin',
    isActive: true
  },
  {
    _id: 'deliveryguy1',
    name: 'delivery ',
    email: 'delivery@tari.com',
    phone: '1234566543',
    password: 'delivery123',
    role: 'delivery' , 
    isActive: true
  }
];

const mockOrders = [
  {
    _id: '1',
    userId: '1',
    items: [{ productId: '1', quantity: 2, price: 299 }],
    total: 598,
    status: 'delivered',
    createdAt: new Date()
  }
];

module.exports = {
  mockProducts,
  mockUsers,
  mockOrders
};
