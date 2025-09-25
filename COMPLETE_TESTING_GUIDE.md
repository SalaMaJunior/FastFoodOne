# 🧪 **FastBite Platform - Complete Testing Guide**

## 📋 **Overview**

This guide provides comprehensive testing instructions for the FastBite food delivery platform, including virtual test data, API testing, and Replit deployment.

---

## 🗄️ **Test Data Overview**

### **Virtual Data Included:**
- **Users:** 2 test users with complete profiles
- **Restaurants:** 3 restaurants with different cuisines
- **Menu Items:** 5+ items across different categories
- **Orders:** 2 sample orders with different statuses
- **Drivers:** 2 delivery drivers with locations
- **Categories:** 8 food categories with icons
- **Promotions:** 2 active promotions
- **Analytics:** Complete business metrics

---

## 🚀 **Quick Start Testing**

### **1. Setup Test Data**
```bash
cd test-data
npm install
npm run seed
```

### **2. Start All Services**
```bash
npm run restart
```

### **3. Run API Tests**
```bash
npm run test-api
```

### **4. Run Load Tests**
```bash
npm run load-test
```

---

## 🧪 **Detailed Testing Scenarios**

### **Scenario 1: User Registration & Authentication**

**Test Steps:**
1. Register new user
2. Verify email (mock)
3. Login with credentials
4. Get user profile
5. Update profile information
6. Logout

**Expected Results:**
- User successfully registered
- JWT token generated
- Profile data accessible
- Logout successful

**Test Data:**
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "firstName": "New",
  "lastName": "User",
  "phone": "+1234567890"
}
```

### **Scenario 2: Restaurant Browsing**

**Test Steps:**
1. Get list of restaurants
2. Filter by cuisine type
3. Search for specific restaurant
4. View restaurant details
5. Browse menu items
6. Filter menu by category

**Expected Results:**
- All restaurants displayed
- Filtering works correctly
- Search returns relevant results
- Menu items load properly

**Test Data:**
- Italian: Mario's Italian Bistro
- Japanese: Sushi Zen
- American: Burger Palace

### **Scenario 3: Order Placement**

**Test Steps:**
1. Add items to cart
2. Apply promotion code
3. Select delivery address
4. Choose payment method
5. Place order
6. Receive confirmation

**Expected Results:**
- Cart updates correctly
- Promotion applied
- Order created successfully
- Confirmation received

**Test Data:**
```json
{
  "restaurantId": "rest-1",
  "items": [
    {
      "menuItemId": "item-1",
      "quantity": 1,
      "specialInstructions": "Extra cheese"
    }
  ],
  "promotionCode": "WELCOME20"
}
```

### **Scenario 4: Order Tracking**

**Test Steps:**
1. View order status
2. Track delivery progress
3. Get driver location
4. Receive real-time updates
5. Rate order after delivery

**Expected Results:**
- Order status updates in real-time
- Driver location visible
- Notifications received
- Rating system works

### **Scenario 5: AI Features Testing**

**Test Steps:**
1. Use smart search
2. Try voice search
3. Generate meal plan
4. Use AR menu viewer
5. Get recommendations

**Expected Results:**
- Smart search returns relevant results
- Voice search processes audio
- Meal plan generated
- AR recognizes food items
- Recommendations are personalized

---

## 🔧 **API Testing Commands**

### **Health Check**
```bash
curl http://localhost:3001/health
```

### **User Registration**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstName":"Test","lastName":"User"}'
```

### **User Login**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### **Get Restaurants**
```bash
curl http://localhost:3001/api/restaurants
```

### **Get Menu Items**
```bash
curl http://localhost:3001/api/restaurants/rest-1/menu
```

### **Create Order**
```bash
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"restaurantId":"rest-1","items":[{"menuItemId":"item-1","quantity":1}]}'
```

---

## 📱 **Mobile App Testing**

### **Expo Setup**
```bash
cd mobile-app/customer-app
npm install
npm start
```

### **Test Features:**
1. **Authentication**
   - Login/Register
   - Biometric auth
   - Social login

2. **Restaurant Browsing**
   - List view
   - Map view
   - Search & filters

3. **Order Management**
   - Add to cart
   - Checkout process
   - Order tracking

4. **AI Features**
   - Smart search
   - Voice search
   - Meal planning
   - AR menu viewer

5. **User Profile**
   - Edit profile
   - Manage addresses
   - Payment methods

---

## 🖥️ **Dashboard Testing**

### **Access Dashboard**
```bash
cd restaurant-dashboard
npm run dev
```

### **Test Features:**
1. **Analytics**
   - Real-time metrics
   - Revenue charts
   - Order statistics

2. **Order Management**
   - View orders
   - Update status
   - Manage drivers

3. **Restaurant Settings**
   - Edit menu
   - Update hours
   - Manage promotions

---

## 🚀 **Replit Deployment Testing**

### **1. Upload to Replit**
1. Create new Repl
2. Upload all files
3. Install dependencies
4. Set environment variables

### **2. Database Setup**
```bash
# Use MongoDB Atlas
export MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/fastbite"
```

### **3. Start Services**
```bash
# Run all services
npm run restart
```

### **4. Test URLs**
- Dashboard: `https://your-repl.replit.dev`
- API: `https://your-repl.replit.dev/api`
- Health: `https://your-repl.replit.dev/health`

---

## 📊 **Performance Testing**

### **Load Testing**
```bash
# Install artillery
npm install -g artillery

# Run load test
artillery run load-test.yml
```

### **Response Time Testing**
```bash
# Test individual endpoints
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3001/api/restaurants
```

### **Memory Usage**
```bash
# Monitor memory usage
ps aux | grep node
```

---

## 🐛 **Troubleshooting**

### **Common Issues**

**Database Connection:**
```bash
# Check MongoDB connection
mongosh "mongodb+srv://username:password@cluster.mongodb.net/fastbite"
```

**Port Conflicts:**
```bash
# Check running processes
lsof -i :3000
lsof -i :3001

# Kill processes
kill -9 PID
```

**Environment Variables:**
```bash
# Check environment
echo $MONGODB_URI
echo $JWT_SECRET
```

### **Debug Mode**
```bash
# Enable debug logging
export DEBUG=*
npm run dev
```

---

## ✅ **Testing Checklist**

### **Backend Services**
- [ ] Auth service running
- [ ] User service running
- [ ] Restaurant service running
- [ ] Order service running
- [ ] Payment service running
- [ ] Delivery service running
- [ ] Notification service running
- [ ] AI service running
- [ ] Analytics service running

### **API Endpoints**
- [ ] Health check working
- [ ] User registration working
- [ ] User login working
- [ ] Restaurant listing working
- [ ] Menu items loading
- [ ] Order creation working
- [ ] Order tracking working
- [ ] Payment processing working
- [ ] AI features working

### **Frontend Applications**
- [ ] Restaurant dashboard accessible
- [ ] Mobile app running
- [ ] Authentication working
- [ ] Order flow complete
- [ ] Real-time updates working
- [ ] AI features functional

### **Database**
- [ ] Test data seeded
- [ ] Users created
- [ ] Restaurants added
- [ ] Menu items loaded
- [ ] Orders created
- [ ] Analytics data available

---

## 🎯 **Success Criteria**

### **Functional Requirements**
- All API endpoints responding
- User authentication working
- Order flow complete
- Real-time tracking working
- AI features functional
- Mobile app working
- Dashboard accessible

### **Performance Requirements**
- API response time < 200ms
- Page load time < 3 seconds
- Mobile app smooth performance
- Real-time updates < 1 second delay

### **Quality Requirements**
- No critical errors
- All tests passing
- User experience smooth
- Data integrity maintained

---

## 🎉 **Testing Complete!**

Once all tests pass, your FastBite platform is ready for production use!

**Next Steps:**
1. Deploy to production
2. Set up monitoring
3. Configure backups
4. Scale as needed

**Happy Testing! 🚀🍔**

