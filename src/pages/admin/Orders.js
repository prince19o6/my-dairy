import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TablePagination,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';

function Orders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('authToken') || localStorage.getItem('adminToken') || '');
  const [currentUser, setCurrentUser] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [formData, setFormData] = useState({
    status: '',
    payment: '',
    customer: '',
    total: '',
    items: '',
    notes: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [viewOrderDetails, setViewOrderDetails] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);

  useEffect(() => {
    if (!token) {
      // Redirect to login if no token
      window.location.href = '/login';
      return;
    }
    fetchOrders();
    fetchCurrentUser();
  }, [token]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      console.log('Fetching all orders list');
      
      const response = await fetch('http://localhost:5000/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      console.log(`Orders list response status: ${response.status}`);
      
      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('authToken');
        localStorage.removeItem('adminToken');
        setToken('');
        window.location.href = '/login';
        return;
      }

      // Even if we get a 403, we'll try to get user's orders or use sample data
      if (response.status === 403) {
        console.log('Permission denied to view all orders, trying alternate methods');
        
        // First try to get the user's own orders if we have currentUser
        if (currentUser && currentUser.id) {
          try {
            const userOrdersResponse = await fetch(`http://localhost:5000/api/users/${currentUser.id}/orders`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
              }
            });
            
            if (userOrdersResponse.ok) {
              const userOrders = await userOrdersResponse.json();
              console.log(`Fetched ${userOrders.length} user orders as fallback`);
              setOrders(userOrders);
              setLoading(false);
              return;
            }
          } catch (err) {
            console.error('Error fetching user orders as fallback:', err);
          }
        }
        
        // If all else fails, show sample orders
        const sampleOrders = [
          {
            id: 'sample-1',
            customer: 'Sample Customer',
            date: new Date().toISOString(),
      total: '₹240',
      items: 4,
            status: 'Pending',
            payment: 'Pending',
            notes: 'This is a sample order. The server denied access to real orders.'
          },
          {
            id: 'sample-2',
            customer: 'Demo User',
            date: new Date().toISOString(),
      total: '₹180',
      items: 3,
      status: 'Processing',
            payment: 'Paid',
            notes: 'This is a sample order. The server denied access to real orders.'
          }
        ];
        
        console.log('Using sample orders as fallback');
        setOrders(sampleOrders);
        showSnackbar('Using sample data - server denied access to real orders', 'warning');
        setLoading(false);
        return;
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch orders: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`Fetched ${data.length} orders successfully`);
      setOrders(data);
    } catch (error) {
      console.error('Error in fetchOrders:', error);
      showSnackbar(error.message || 'Error fetching orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('authToken');
        localStorage.removeItem('adminToken');
        setToken('');
        window.location.href = '/login';
        return;
      }
      
      const data = await response.json();
      setCurrentUser(data);
      
      // We no longer filter orders based on role
      // All users should see all orders
    } catch (error) {
      showSnackbar('Error fetching user data', 'error');
    }
  };

  const handleOpenModal = (order = null) => {
    if (order) {
      setEditingOrder(order);
      setFormData({
        status: order.status || '',
        payment: order.payment || '',
        customer: order.customer || '',
        total: order.total || '',
        items: order.items || '',
        notes: order.notes || ''
      });
    } else {
      setEditingOrder(null);
      setFormData({
        status: 'Pending',
        payment: 'Pending',
        customer: '',
        total: '',
        items: '',
        notes: ''
      });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingOrder(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingOrder 
        ? `http://localhost:5000/api/orders/${editingOrder.id}`
        : 'http://localhost:5000/api/orders';
      
      const method = editingOrder ? 'PUT' : 'POST';
      
      setLoading(true);
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('authToken');
        localStorage.removeItem('adminToken');
        setToken('');
        window.location.href = '/login';
        return;
      }

      if (response.status === 403) {
        throw new Error('You do not have permission to modify this order');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update order');
      }

      showSnackbar(`Order ${editingOrder ? 'updated' : 'created'} successfully`, 'success');
      handleCloseModal();
      fetchOrders();
    } catch (error) {
      showSnackbar(error.message || 'Error processing order', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    
    try {
      setLoading(true);
      // Make sure we have a valid ID
      const orderId = id.toString();
      console.log(`Attempting to delete order ID: ${orderId}`);
      
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      console.log(`Delete order response status: ${response.status}`);

      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('authToken');
        localStorage.removeItem('adminToken');
        setToken('');
        window.location.href = '/login';
        return;
      }

      // For any API failure, provide a helpful error message
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        
        if (response.status === 403) {
          throw new Error('The server denied the request to delete this order');
        } else if (response.status === 404) {
          throw new Error('Order not found or may have already been deleted');
        } else {
          throw new Error(`Failed to delete order: ${response.statusText || 'Unknown error'}`);
        }
      }

      showSnackbar('Order deleted successfully', 'success');
      // Remove the deleted order from the state to avoid refetching
      setOrders(prevOrders => prevOrders.filter(order => order.id !== id));
    } catch (error) {
      console.error('Error in handleDelete:', error);
      showSnackbar(error.message || 'Error deleting order', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = async (id) => {

    try {
      if (!id) {
        showSnackbar('Invalid order ID', 'error');
        return;
      }
      
      setLoading(true);
      console.log(`Attempting to fetch order details for ID: ${id}`);
      
      // console.log(id);
      // return false;
      // Check if it's a sample order first
      const sampleOrder = orders.find(order => order.id === id && String(order.id).startsWith('sample-'));
      if (sampleOrder) {
        console.log('Using sample order data:', sampleOrder);
        setViewOrderDetails(sampleOrder);
        setOpenViewDialog(true);
        setLoading(false);
        return;
      }
      
      // Always try to use the data we already have as a fallback
      const orderFromList = orders.find(o => String(o.id) === String(id));
      
      // Ensure id is in the correct format
      const orderId = id.toString();
      
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      console.log(`Order details response status: ${response.status}`);
      
      // if (response.status === 401) {
      //   // Token expired or invalid
      //   localStorage.removeItem('authToken');
      //   localStorage.removeItem('adminToken');
      //   setToken('');
      //   window.location.href = '/login';
      //   return;
      // }

      // Handle access denied or other errors
      if (!response.ok) {
        console.log('Response not OK. Status:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        
        // If we have the order in the list view, use that data instead
        if (orderFromList) {
          console.log('Using order data from list view as fallback:', orderFromList);
          const mockOrderDetails = {
            ...orderFromList,
            notes: orderFromList.notes || 'Detailed information unavailable - using basic order data',
            // Add any other required fields with defaults
            orderItems: []
          };
          
          setViewOrderDetails(mockOrderDetails);
          setOpenViewDialog(true);
          if (response.status === 403) {
            showSnackbar('Limited order details available - using basic order data', 'warning');
          } else {
            showSnackbar('Using basic order data - full details unavailable', 'warning');
          }
          return;
        }
        
        // If we can't even use the list data, show the error
        if (response.status === 403) {
          throw new Error('You do not have permission to view this order\'s details');
        } else if (response.status === 404) {
          throw new Error('Order not found. It may have been deleted or moved.');
        } else {
          throw new Error(`Failed to fetch order details: ${response.statusText || 'Unknown error'}`);
        }
      }

      // Process successful response
      try {
        const orderDetails = await response.json();
        console.log('Parsed order details:', orderDetails);
        
        if (!orderDetails || !orderDetails.id) {
          throw new Error('Invalid order data received from server');
        }
        
        setViewOrderDetails(orderDetails);
        setOpenViewDialog(true);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        
        // If parsing fails but we have list data, use that
        if (orderFromList) {
          const mockOrderDetails = {
            ...orderFromList,
            notes: 'Detailed information unavailable - using basic order data',
            orderItems: []
          };
          
          setViewOrderDetails(mockOrderDetails);
          setOpenViewDialog(true);
          showSnackbar('Server returned invalid data format. Using basic order info.', 'warning');
        } else {
          throw new Error('Server returned invalid data format');
        }
      }
    } catch (error) {
      console.error('Error in handleViewOrder:', error);
      showSnackbar(error.message || 'Error fetching order details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleMenuClick = (event, order) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrder(order);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedOrder(null);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRefresh = () => {
    fetchOrders();
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setViewOrderDetails(null);
  };

  const filteredOrders = orders.filter(order =>
    (order?.customer?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (order?.id?.toString()?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const paginatedOrders = filteredOrders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
        <div className="flex space-x-2">
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenModal()}
            disabled={loading}
          >
            Create Order
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <div className="p-4">
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search orders by ID or customer name..."
            value={searchTerm}
            onChange={handleSearch}
            size="small"
          />
        </div>

        {loading ? (
          <Box className="p-12 text-center">
            <CircularProgress />
            <Typography variant="body1" color="text.secondary" className="mt-3">
              Loading orders...
            </Typography>
          </Box>
        ) : filteredOrders.length === 0 ? (
          <Box className="p-8 text-center">
            <Typography variant="h6" color="text.secondary">
              No orders found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm 
                ? "Try adjusting your search term" 
                : "There are no orders to display"}
            </Typography>
          </Box>
        ) : (
          <>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
                {paginatedOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                    <TableCell>{new Date(order.date || order.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>{order.total}</TableCell>
                <TableCell>{order.items}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    order.payment === 'Paid' 
                      ? 'bg-green-100 text-green-800'
                          : order.payment === 'Failed'
                          ? 'bg-red-100 text-red-800'
                          : order.payment === 'Refunded'
                          ? 'bg-purple-100 text-purple-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.payment}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                        <IconButton 
                          size="small"
                          onClick={() => handleViewOrder(order.id)}
                        >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleOpenModal(order)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDelete(order.id)}
                        >
                          <DeleteIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuClick(e, order)}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredOrders.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Card>

      {/* Edit Order Dialog */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>{editingOrder ? 'Edit Order' : 'Create New Order'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <div className="space-y-4">
              {!editingOrder && (
                <TextField
                  fullWidth
                  label="Customer"
                  name="customer"
                  value={formData.customer}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                />
              )}
              
              {!editingOrder && (
                <TextField
                  fullWidth
                  label="Total Amount"
                  name="total"
                  value={formData.total}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                />
              )}
              
              {!editingOrder && (
                <TextField
                  fullWidth
                  label="Number of Items"
                  name="items"
                  type="number"
                  value={formData.items}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                />
              )}
              
              <TextField
                fullWidth
                select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
                margin="normal"
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Processing">Processing</MenuItem>
                <MenuItem value="Shipped">Shipped</MenuItem>
                <MenuItem value="Delivered">Delivered</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </TextField>
              
              <TextField
                fullWidth
                select
                label="Payment"
                name="payment"
                value={formData.payment}
                onChange={handleInputChange}
                required
                margin="normal"
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Paid">Paid</MenuItem>
                <MenuItem value="Failed">Failed</MenuItem>
                <MenuItem value="Refunded">Refunded</MenuItem>
              </TextField>
              
              <TextField
                fullWidth
                label="Notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                multiline
                rows={4}
                margin="normal"
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} disabled={loading}>Cancel</Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : (editingOrder ? 'Update' : 'Create')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* View Order Details Dialog */}
      <Dialog open={openViewDialog} onClose={handleCloseViewDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Order Details 
          {viewOrderDetails && String(viewOrderDetails.id).startsWith('sample-') && (
            <Typography variant="caption" color="text.secondary" component="span" sx={{ ml: 1 }}>
              (Sample Data)
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          {viewOrderDetails ? (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Typography variant="subtitle2" color="text.secondary">Order ID</Typography>
                  <Typography variant="body1">{viewOrderDetails.id}</Typography>
                </div>
                <div>
                  <Typography variant="subtitle2" color="text.secondary">Date</Typography>
                  <Typography variant="body1">
                    {new Date(viewOrderDetails.date || viewOrderDetails.createdAt || new Date()).toLocaleString()}
                  </Typography>
                </div>
                <div>
                  <Typography variant="subtitle2" color="text.secondary">Customer</Typography>
                  <Typography variant="body1">{viewOrderDetails.customer || 'N/A'}</Typography>
                </div>
                <div>
                  <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                  <div className="mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(viewOrderDetails.status)}`}>
                      {viewOrderDetails.status || 'Unknown'}
                    </span>
                  </div>
                </div>
                <div>
                  <Typography variant="subtitle2" color="text.secondary">Total Amount</Typography>
                  <Typography variant="body1">{viewOrderDetails.total || 'N/A'}</Typography>
                </div>
                <div>
                  <Typography variant="subtitle2" color="text.secondary">Payment Status</Typography>
                  <div className="mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      viewOrderDetails.payment === 'Paid' 
                        ? 'bg-green-100 text-green-800'
                        : viewOrderDetails.payment === 'Failed'
                        ? 'bg-red-100 text-red-800'
                        : viewOrderDetails.payment === 'Refunded'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {viewOrderDetails.payment || 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
              
              {viewOrderDetails.notes && (
                <div className="mt-4">
                  <Typography variant="subtitle2" color="text.secondary">Notes</Typography>
                  <Typography variant="body1">{viewOrderDetails.notes}</Typography>
                </div>
              )}
              
              {/* Order items would be displayed here */}
              {viewOrderDetails.orderItems && viewOrderDetails.orderItems.length > 0 && (
                <div className="mt-6">
                  <Typography variant="h6" gutterBottom>Order Items</Typography>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {viewOrderDetails.orderItems.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.product || item.productName || 'Unknown Product'}</TableCell>
                          <TableCell>{item.quantity || 0}</TableCell>
                          <TableCell>{item.price || 0}</TableCell>
                          <TableCell>{item.total || (item.quantity * item.price) || 0}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          ) : (
            <Box className="p-4 text-center">
              <CircularProgress />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog}>Close</Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => {
              handleCloseViewDialog();
              handleOpenModal(viewOrderDetails);
            }}
            disabled={!viewOrderDetails}
          >
            Edit Order
          </Button>
        </DialogActions>
      </Dialog>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          handleViewOrder(selectedOrder?.id);
          handleMenuClose();
        }}>View Details</MenuItem>
        <MenuItem onClick={() => {
          handleOpenModal(selectedOrder);
          handleMenuClose();
        }}>Update Order</MenuItem>
        <MenuItem onClick={() => {
          if (selectedOrder) handleDelete(selectedOrder.id);
          handleMenuClose();
        }}>Delete Order</MenuItem>
      </Menu>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Orders; 