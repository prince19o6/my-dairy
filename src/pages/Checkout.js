import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Avatar
} from '@mui/material';
import { useCart } from '../context/CartContext';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [userId, setUserId] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [fetchStatus, setFetchStatus] = useState({ success: false, message: '' });
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'cod',
    paymentDetails: {
      upiId: '',
      cardNumber: '',
      cardExpiry: '',
      cardCvv: '',
      bankName: '',
      accountNumber: '',
      ifscCode: ''
    }
  });

  // Get user ID from token
  const getUserInfoFromToken = (token) => {
    try {
      if (!token) return null;
      
      // Decode JWT token
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const decodedToken = JSON.parse(jsonPayload);
      console.log('Decoded token:', decodedToken);
      
      // The backend JWT contains id, email, and role
      return {
        userId: decodedToken.id || null,
        email: decodedToken.email || null,
        role: decodedToken.role || null,
        tokenInfo: decodedToken
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return { userId: null, email: null, role: null, tokenInfo: null };
    }
  };

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { 
        state: { 
          from: '/checkout',
          message: 'Please login to proceed with checkout' 
        }
      });
      return;
    }

    // Normalize cart items to ensure they have proper ID fields
    if (cartItems && cartItems.length > 0) {
      console.log('Normalizing cart items to ensure proper ID fields');
      cartItems.forEach(item => {
        // Ensure each item has at least one ID field
        if (!item._id && !item.id && !item.productId) {
          console.warn('Item missing ID:', item);
        } else {
          // Cross-populate ID fields if one exists
          if (item._id && !item.productId) item.productId = item._id;
          if (item.id && !item._id) item._id = item.id;
          if (item.productId && !item._id) item._id = item.productId;
        }
      });
    }

    // Try to get user info from multiple sources
    let storedUserInfo;
    try {
      storedUserInfo = JSON.parse(localStorage.getItem('user') || '{}');
      console.log('User info from localStorage:', storedUserInfo);
      setUserInfo(storedUserInfo);
    } catch (error) {
      console.error('Error parsing user info from localStorage:', error);
      storedUserInfo = {};
    }

    // Get user ID either from user object or token
    const { userId: tokenUserId, email: tokenEmail } = getUserInfoFromToken(token);
    console.log('User ID from token:', tokenUserId);
    console.log('Email from token:', tokenEmail);
    
    const userIdFromStorage = storedUserInfo.id || storedUserInfo._id;
    const effectiveUserId = userIdFromStorage || tokenUserId;
    
    if (effectiveUserId) {
      setUserId(effectiveUserId);
      console.log('Using user ID:', effectiveUserId);
    } else {
      console.error('No user ID found');
      setFetchStatus({
        success: false,
        message: 'No user ID found. Unable to load profile data.'
      });
      navigate('/login');
      return;
    }

    // Fetch user profile data from API
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        console.log(`Fetching user profile from: http://localhost:5000/api/user/profile`);
        const response = await fetch(`http://localhost:5000/api/user/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('API Error:', errorData);
          throw new Error(errorData.message || 'Failed to fetch profile');
        }

        const data = await response.json();
        console.log('User profile data from API:', data);
        
        // Set form data with user information from API
        setFormData(prev => ({
          ...prev,
          firstName: data.firstName || storedUserInfo.firstName || '',
          lastName: data.lastName || storedUserInfo.lastName || '',
          email: data.email || tokenEmail || storedUserInfo.email || '',
          phone: data.phone || storedUserInfo.phone || '',
          address: data.address || storedUserInfo.address || '',
          city: data.city || storedUserInfo.city || '',
          state: data.state || storedUserInfo.state || '',
          pincode: data.pincode || storedUserInfo.pincode || ''
        }));
        
        // Update user info with full data from API
        setUserInfo({
          ...storedUserInfo,
          ...data
        });
        
        setFetchStatus({
          success: true,
          message: 'Successfully loaded user data from backend'
        });
      } catch (err) {
        console.error('Error fetching profile:', err);
        
        // If API fails, use data from localStorage
        setFormData(prev => ({
          ...prev,
          firstName: storedUserInfo.firstName || '',
          lastName: storedUserInfo.lastName || '',
          email: storedUserInfo.email || tokenEmail || '',
          phone: storedUserInfo.phone || '',
          address: storedUserInfo.address || '',
          city: storedUserInfo.city || '',
          state: storedUserInfo.state || '',
          pincode: storedUserInfo.pincode || ''
        }));
        
        setFetchStatus({
          success: false,
          message: `Could not load data from backend: ${err.message}. Using locally stored data instead.`
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      // Handle nested payment details
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleNext = () => {
    // Validate required fields before proceeding
    if (activeStep === 0) {
      const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'pincode'];
      const emptyFields = requiredFields.filter(field => !formData[field].trim());
      
      if (emptyFields.length > 0) {
        setError(`Please fill all required fields: ${emptyFields.join(', ')}`);
        return;
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        return;
      }
    }
    
    // If cart is empty, don't proceed to payment
    if (activeStep === 0 && cartItems.length === 0) {
      setError('Your cart is empty. Please add items to your cart before checkout.');
      return;
    }
    
    setError(''); // Clear any previous errors
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Check if cart is empty
    if (cartItems.length === 0) {
      setError('Your cart is empty. Please add items to your cart before placing an order.');
      setLoading(false);
      return;
    }

    try {
      // Debug cart items and their IDs
      console.log('Cart items before submission:');
      cartItems.forEach((item, index) => {
        console.log(`Item ${index}:`, {
          _id: item._id,
          id: item.id,
          productId: item.productId,
          name: item.name,
          allKeys: Object.keys(item)
        });
      });

      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to place an order');
        navigate('/login', { 
          state: { 
            from: '/checkout',
            message: 'Please login to proceed with checkout' 
          }
        });
        return;
      }

      // Get user ID from multiple sources for reliability
      const { userId: tokenUserId } = getUserInfoFromToken(token);
      
      // Try to get user info from localStorage
      let storedUserInfo;
      try {
        storedUserInfo = JSON.parse(localStorage.getItem('user') || '{}');
      } catch (error) {
        console.error('Error parsing user info:', error);
        storedUserInfo = {};
      }

      // Determine the most reliable user ID to use
      const effectiveUserId = userId || 
                             storedUserInfo.id || 
                             tokenUserId;
      
      if (!effectiveUserId) {
        setError('Could not determine your user ID. Please try logging in again.');
        navigate('/login');
        return;
      }

      console.log(`Placing order for user ID: ${effectiveUserId}`);

      // Validate that all items have a valid ID
      const itemsWithoutId = cartItems.filter(item => 
        !item._id && !item.id && !item.productId
      );
      
      if (itemsWithoutId.length > 0) {
        console.error('Some items are missing product IDs:', itemsWithoutId);
        setError('Some products in your cart are missing identification. Please try removing and adding them again.');
        setLoading(false);
        return;
      }

      const orderData = {
        userId: effectiveUserId,
        items: cartItems.map(item => {
          // Find the best available ID
          const productId = item._id || item.id || item.productId || '';
          if (!productId) {
            console.warn('Missing product ID for item:', item);
          }
          
          return {
            productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            imageUrl: item.imageUrl
          };
        }),
        total: getCartTotal(),
        deliveryAddress: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        },
        paymentMethod: formData.paymentMethod,
        paymentDetails: formData.paymentMethod === 'cod' ? {} : formData.paymentDetails
      };

      console.log('Submitting order:', orderData);

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      let responseData;
      try {
        responseData = await response.json();
      } catch (error) {
        console.error('Error parsing response:', error);
        throw new Error('Invalid response from server');
      }
      
      if (!response.ok) {
        console.error('Order submission error:', responseData);
        throw new Error(responseData.message || 'Failed to place order');
      }

      console.log('Order placed successfully:', responseData);
      clearCart();
      navigate('/order-success', { state: { orderId: responseData._id || responseData.id } });
    } catch (err) {
      console.error('Order submission error:', err);
      setError(`Failed to place order: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const steps = ['Delivery Address', 'Order Summary', 'Payment'];

  // Render content based on active step
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={!formData.firstName && error.includes('firstName')}
                helperText={!formData.firstName && error.includes('firstName') ? 'Required field' : ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={!formData.lastName && error.includes('lastName')}
                helperText={!formData.lastName && error.includes('lastName') ? 'Required field' : ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={(!formData.email && error.includes('email')) || error.includes('valid email')}
                helperText={(!formData.email && error.includes('email')) ? 'Required field' : 
                  (error.includes('valid email') ? 'Enter valid email format' : '')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={!formData.phone && error.includes('phone')}
                helperText={!formData.phone && error.includes('phone') ? 'Required field' : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                error={!formData.address && error.includes('address')}
                helperText={!formData.address && error.includes('address') ? 'Required field' : ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                error={!formData.city && error.includes('city')}
                helperText={!formData.city && error.includes('city') ? 'Required field' : ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                error={!formData.state && error.includes('state')}
                helperText={!formData.state && error.includes('state') ? 'Required field' : ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Pin Code"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                error={!formData.pincode && error.includes('pincode')}
                helperText={!formData.pincode && error.includes('pincode') ? 'Required field' : ''}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <>
            {cartItems.length === 0 ? (
              <Alert severity="warning" sx={{ mb: 2 }}>
                Your cart is empty. Please add items to your cart before proceeding with checkout.
              </Alert>
            ) : (
              <>
                <Typography variant="h6" gutterBottom>
                  Order Summary
                </Typography>
                <Box sx={{ maxHeight: '300px', overflowY: 'auto', mb: 2 }}>
                  {cartItems.map((item) => (
                    <Paper key={item._id} sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: 60, height: 60, mr: 2, overflow: 'hidden' }}>
                        <img 
                          src={'http://localhost:5000' + item.imageUrl || '/default-product.png'} 
                          alt={item.name} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1">{item.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          ₹{item.price} x {item.quantity} = ₹{item.price * item.quantity}
                        </Typography>
                      </Box>
                    </Paper>
                  ))}
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle1">Subtotal</Typography>
                  <Typography variant="subtitle1">₹{getCartTotal()}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle1">Shipping</Typography>
                  <Typography variant="subtitle1">₹0</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle1">Tax</Typography>
                  <Typography variant="subtitle1">₹0</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6">₹{getCartTotal()}</Typography>
                </Box>
              </>
            )}
          </>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Payment Method
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Button
                    variant={formData.paymentMethod === 'cod' ? 'contained' : 'outlined'}
                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'cod' }))}
                    fullWidth
                  >
                    Cash on Delivery
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant={formData.paymentMethod === 'upi' ? 'contained' : 'outlined'}
                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'upi' }))}
                    fullWidth
                    disabled
                  >
                    UPI (Coming Soon)
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant={formData.paymentMethod === 'card' ? 'contained' : 'outlined'}
                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'card' }))}
                    fullWidth
                    disabled
                  >
                    Credit/Debit Card (Coming Soon)
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            {formData.paymentMethod === 'upi' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="UPI ID"
                  name="paymentDetails.upiId"
                  value={formData.paymentDetails.upiId}
                  onChange={handleChange}
                />
              </Grid>
            )}
            {formData.paymentMethod === 'card' && (
              <>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Card Number"
                    name="paymentDetails.cardNumber"
                    value={formData.paymentDetails.cardNumber}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Expiry Date (MM/YY)"
                    name="paymentDetails.cardExpiry"
                    value={formData.paymentDetails.cardExpiry}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="CVV"
                    name="paymentDetails.cardCvv"
                    value={formData.paymentDetails.cardCvv}
                    onChange={handleChange}
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <Box sx={{ mt: 2, bgcolor: 'success.50', p: 2, borderRadius: 1 }}>
                <Typography variant="subtitle2" color="success.main" sx={{ fontWeight: 'bold' }}>
                  Order Total: ₹{getCartTotal()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Payment Method: {formData.paymentMethod === 'cod' ? 'Cash on Delivery' : 
                                  formData.paymentMethod === 'upi' ? 'UPI' : 'Credit/Debit Card'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
        Checkout
      </Typography>
      
      {/* User Info Summary */}
      {userInfo && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'primary.50' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                {userInfo.firstName?.charAt(0) || userInfo.email?.charAt(0) || 'U'}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Welcome, {userInfo.firstName || userInfo.name?.split(' ')[0] || 'User'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Logged in as: {userInfo.email}
              </Typography>
            </Grid>
            <Grid item>
              <Chip 
                label={fetchStatus.success ? "Data from backend" : "Using local data"} 
                color={fetchStatus.success ? "success" : "warning"}
                size="small"
              />
            </Grid>
          </Grid>
          
          {/* User Data Source */}
          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Chip 
              icon={<PersonIcon />} 
              label={`${formData.firstName || userInfo.firstName || ''} ${formData.lastName || userInfo.lastName || ''}`} 
              size="small" 
              variant="outlined"
            />
            <Chip 
              icon={<EmailIcon />} 
              label={formData.email || userInfo.email || ''} 
              size="small" 
              variant="outlined"
            />
            {(formData.phone || userInfo.phone) && (
              <Chip 
                icon={<PhoneIcon />} 
                label={formData.phone || userInfo.phone} 
                size="small" 
                variant="outlined"
              />
            )}
            {(formData.address || userInfo.address) && (
              <Chip 
                icon={<LocationOnIcon />} 
                label={`${formData.city || userInfo.city || ''}, ${formData.state || userInfo.state || ''}`} 
                size="small" 
                variant="outlined"
              />
            )}
          </Box>
          
          {/* User ID and Token Status */}
          <Box sx={{ mt: 2, fontSize: '0.75rem', color: 'text.secondary' }}>
            <Typography variant="caption" display="block">
              User ID: {userId || userInfo.id || 'Unknown'}
            </Typography>
            <Typography variant="caption" display="block">
              Auth Status: {localStorage.getItem('token') ? 'Authenticated' : 'Not Authenticated'}
            </Typography>
          </Box>
        </Paper>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading && !error && activeStep === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper sx={{ p: 3 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <form onSubmit={handleSubmit}>
            {renderStepContent(activeStep)}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              {activeStep > 0 && (
                <Button onClick={handleBack} sx={{ mr: 1 }}>
                  Back
                </Button>
              )}
              {activeStep === 2 ? (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading || cartItems.length === 0}
                >
                  {loading ? <CircularProgress size={24} /> : 'Place Order'}
                </Button>
              ) : (
                <Button 
                  variant="contained" 
                  onClick={handleNext}
                  disabled={cartItems.length === 0 && activeStep === 1}
                >
                  Next
                </Button>
              )}
            </Box>
          </form>
        </Paper>
      )}
    </Container>
  );
}

export default Checkout; 