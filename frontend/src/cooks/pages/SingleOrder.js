import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import TitleCard from "../components/Cards/TitleCard";
import { useCookAuthStore } from "../stores/authStore";
import {
  Box,
  Typography,
  Paper,
  Chip,
  CircularProgress,
  Button,
  Select,
  MenuItem,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  LinearProgress
} from "@mui/material";
import {
  CheckCircleOutline,
  CancelOutlined,
  HourglassEmpty,
  LocationOn,
  Receipt,
  LocalShipping
} from "@mui/icons-material";

const SingleOrder = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const { orderId } = useParams();
  const { isCookAuthenticated } = useCookAuthStore();

  const statusIcons = {
    Completed: <CheckCircleOutline color="success" />,
    Cancelled: <CancelOutlined color="error" />,
    Pending: <HourglassEmpty color="warning" />,
    Confirmed: <CheckCircleOutline color="info" />
  };

  const statusColors = {
    Completed: "success",
    Cancelled: "error",
    Pending: "warning",
    Confirmed: "info"
  };

  const statusToPersian = {
    Completed: "تحویل داده شده",
    Cancelled: "لغو شده",
    Pending: "در حال آماده سازی",
    Confirmed: "تایید شده"
  };

  const getStatusProgress = (status) => {
    switch (status) {
      case "Cancelled": return 0;
      case "Pending": return 30;
      case "Confirmed": return 60;
      case "Completed": return 100;
      default: return 0;
    }
  };

  useEffect(() => {
    if (!isCookAuthenticated || !orderId) {
      setError("دسترسی غیرمجاز یا شناسه سفارش نامعتبر");
      setLoading(false);
      toast.error("خطا در بارگذاری سفارش: لطفا ابتدا وارد شوید");
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `/api/cooks/foods/order-foods/${orderId}`,
          { withCredentials: true }
        );
        
        setOrder(response.data.order);
        setSelectedStatus(response.data.order.orderStatus);
      } catch (error) {
        console.error("API Error:", error);
        setError(error.response?.data?.msg || "خطا در بارگذاری سفارش");
        toast.error(error.response?.data?.msg || "خطا در بارگذاری سفارش");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, isCookAuthenticated]);

  const handleStatusChange = async () => {
    try {
      await axios.put(
        `/api/cooks/foods/order-foods/${orderId}/change-status`,
        { orderStatus: selectedStatus },
        { withCredentials: true }
      );
      
      setOrder(prev => ({ ...prev, orderStatus: selectedStatus }));
      setIsModalOpen(false);
      toast.success("وضعیت سفارش با موفقیت تغییر کرد");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(error.response?.data?.msg || "خطا در تغییر وضعیت سفارش");
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !order) {
    return (
      <Box textAlign="center" py={4} color="error.main">
        <Typography variant="h6">{error || "سفارش یافت نشد"}</Typography>
      </Box>
    );
  }

  // Safely extract address text whether it's an object or string
  const deliveryAddressText = typeof order.deliveryAddress === 'object' 
    ? order.deliveryAddress.text 
    : order.deliveryAddress;

  return (
    <TitleCard title="جزئیات سفارش" topMargin="mt-2" dir="rtl">
      <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
        {/* Order Summary Cards */}
        <Box 
          display="flex" 
          flexDirection={{ xs: 'column', md: 'row' }} 
          gap={3} 
          mb={4}
        >
          {/* Order Information Card */}
          <Paper 
            sx={{ 
              p: { xs: 2, sm: 3 }, 
              flex: 1,
              minWidth: { xs: 'auto', md: 300 }
            }} 
            elevation={2}
          >
            <Box display="flex" alignItems="center" gap={1} mb={3}>
              <Receipt color="primary" />
              <Typography variant="h6" fontWeight="600">
                اطلاعات سفارش
              </Typography>
            </Box>
            
            <Box display="flex" flexDirection="column" gap={2}>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  شماره سفارش:
                </Typography>
                <Typography variant="body2" fontFamily="monospace">
                  {order._id}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  تاریخ:
                </Typography>
                <Typography variant="body2">
                  {new Date(order.createdAt).toLocaleDateString('fa-IR')}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  وضعیت:
                </Typography>
                <Chip
                  icon={statusIcons[order.orderStatus]}
                  label={statusToPersian[order.orderStatus]}
                  color={statusColors[order.orderStatus]}
                  sx={{ mt: 0.5 }}
                  size="small"
                />
              </Box>
            </Box>
            
            <Box mt={3}>
              <LinearProgress 
                variant="determinate" 
                value={getStatusProgress(order.orderStatus)} 
                color="primary"
                sx={{ 
                  height: 6, 
                  borderRadius: 3,
                  backgroundColor: 'grey.200'
                }}
              />
            </Box>
          </Paper>

          {/* Delivery Information Card */}
          <Paper 
            sx={{ 
              p: { xs: 2, sm: 3 }, 
              flex: 1,
              minWidth: { xs: 'auto', md: 300 }
            }} 
            elevation={2}
          >
            <Box display="flex" alignItems="center" gap={1} mb={3}>
              <LocationOn color="primary" />
              <Typography variant="h6" fontWeight="600">
                اطلاعات تحویل
              </Typography>
            </Box>
            
            <Box display="flex" flexDirection="column" gap={2}>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  آدرس:
                </Typography>
                <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                  {deliveryAddressText || "آدرس مشخص نشده"}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  شماره تماس:
                </Typography>
                <Typography variant="body2" dir="ltr" textAlign="right">
                  {order.contactNumber}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  توضیحات:
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontStyle: order.description ? 'normal' : 'italic',
                    color: order.description ? 'text.primary' : 'text.secondary'
                  }}
                >
                  {order.description || "بدون توضیحات"}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Order Items Table */}
        <Paper 
          sx={{ 
            p: { xs: 2, sm: 3 }, 
            mb: 4,
            overflow: 'hidden'
          }} 
          elevation={2}
        >
          <Box display="flex" alignItems="center" gap={1} mb={3}>
            <LocalShipping color="primary" />
            <Typography variant="h6" fontWeight="600">
              اقلام سفارش
            </Typography>
          </Box>
          
          <TableContainer sx={{ maxHeight: { xs: 400, md: 'none' } }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: '600', py: 2 }}>تصویر</TableCell>
                  <TableCell sx={{ fontWeight: '600', py: 2 }}>نام غذا</TableCell>
                  <TableCell align="center" sx={{ fontWeight: '600', py: 2 }}>تعداد</TableCell>
                  <TableCell align="center" sx={{ fontWeight: '600', py: 2 }}>قیمت واحد</TableCell>
                  <TableCell align="center" sx={{ fontWeight: '600', py: 2 }}>جمع</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.items?.map((item, index) => (
                  <TableRow 
                    key={index} 
                    hover
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>
                      <Avatar 
                        src={item.food?.image} 
                        alt={item.food?.name}
                        sx={{ 
                          width: { xs: 40, sm: 56 }, 
                          height: { xs: 40, sm: 56 } 
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {item.food?.name || item.name}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={item.quantity} 
                        size="small" 
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {item.price.toLocaleString()} ریال
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" fontWeight="600">
                        {(item.price * item.quantity).toLocaleString()} ریال
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Order Total */}
        <Box 
          display="flex" 
          justifyContent="space-between" 
          alignItems="center" 
          p={3} 
          borderRadius={2}
          sx={{ backgroundColor: 'primary.50' }}
        >
          <Typography variant="h6" fontWeight="600">
            جمع کل سفارش:
          </Typography>
          <Typography variant="h5" fontWeight="700" color="primary.main">
            {order.totalAmount.toLocaleString()} ریال
          </Typography>
        </Box>

        {/* Action Buttons */}
        <Box 
          display="flex" 
          justifyContent={{ xs: 'center', md: 'flex-end' }} 
          mt={4}
        >
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => setIsModalOpen(true)}
            sx={{ 
              px: 4, 
              py: 1.5,
              minWidth: { xs: '100%', sm: 'auto' }
            }}
            size="large"
          >
            تغییر وضعیت سفارش
          </Button>
        </Box>

        {/* Status Change Modal */}
        <Modal 
          open={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          aria-labelledby="status-modal-title"
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 400 },
            maxWidth: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            outline: 'none'
          }}>
            <Typography 
              id="status-modal-title"
              variant="h6" 
              mb={3} 
              textAlign="center"
              fontWeight="600"
            >
              تغییر وضعیت سفارش
            </Typography>
            
            <Select
              fullWidth
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              sx={{ mb: 3 }}
              size="small"
            >
              <MenuItem value="Pending">در حال آماده سازی</MenuItem>
              <MenuItem value="Confirmed">تایید شده</MenuItem>
              <MenuItem value="Completed">تحویل داده شده</MenuItem>
              <MenuItem value="Cancelled">لغو شده</MenuItem>
            </Select>
            
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button 
                variant="outlined" 
                onClick={() => setIsModalOpen(false)}
                size="small"
              >
                انصراف
              </Button>
              <Button 
                variant="contained" 
                onClick={handleStatusChange}
                disabled={selectedStatus === order.orderStatus}
                size="small"
              >
                تایید تغییر
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
      
      <ToastContainer rtl position="top-center" />
    </TitleCard>
  );
};

export default SingleOrder;