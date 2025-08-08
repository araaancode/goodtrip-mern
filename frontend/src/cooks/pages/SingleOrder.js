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
      <Box sx={{ p: 3 }}>
        {/* Order Summary */}
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3} mb={4}>
          <Paper sx={{ p: 3, flex: 1 }} elevation={2}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Receipt color="primary" />
              <Typography variant="h6">اطلاعات سفارش</Typography>
            </Box>
            
            <Box mb={2}>
              <Typography variant="body2" color="text.secondary">شماره سفارش:</Typography>
              <Typography variant="body1">{order._id}</Typography>
            </Box>
            
            <Box mb={2}>
              <Typography variant="body2" color="text.secondary">تاریخ:</Typography>
              <Typography variant="body1">
                {new Date(order.createdAt).toLocaleDateString('fa-IR')}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary">وضعیت:</Typography>
              <Chip
                icon={statusIcons[order.orderStatus]}
                label={statusToPersian[order.orderStatus]}
                color={statusColors[order.orderStatus]}
                sx={{ mt: 1 }}
              />
            </Box>
            
            <Box mt={3}>
              <LinearProgress 
                variant="determinate" 
                value={getStatusProgress(order.orderStatus)} 
                color="primary"
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
          </Paper>

          <Paper sx={{ p: 3, flex: 1 }} elevation={2}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <LocationOn color="primary" />
              <Typography variant="h6">اطلاعات تحویل</Typography>
            </Box>
            
            <Box mb={2}>
              <Typography variant="body2" color="text.secondary">آدرس:</Typography>
              <Typography variant="body1">
                {deliveryAddressText || "آدرس مشخص نشده"}
              </Typography>
            </Box>
            
            <Box mb={2}>
              <Typography variant="body2" color="text.secondary">شماره تماس:</Typography>
              <Typography variant="body1">{order.contactNumber}</Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary">توضیحات:</Typography>
              <Typography variant="body1">
                {order.description || "بدون توضیحات"}
              </Typography>
            </Box>
          </Paper>
        </Box>

        {/* Order Items */}
        <Paper sx={{ p: 3, mb: 4 }} elevation={2}>
          <Box display="flex" alignItems="center" gap={1} mb={3}>
            <LocalShipping color="primary" />
            <Typography variant="h6">اقلام سفارش</Typography>
          </Box>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'action.hover' }}>
                  <TableCell>تصویر</TableCell>
                  <TableCell>نام غذا</TableCell>
                  <TableCell align="center">تعداد</TableCell>
                  <TableCell align="center">قیمت واحد (ریال)</TableCell>
                  <TableCell align="center">جمع (ریال)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.items?.map((item, index) => (
                  <TableRow key={index} hover>
                    <TableCell>
                      <Avatar 
                        src={item.food?.image} 
                        alt={item.food?.name}
                        sx={{ width: 56, height: 56 }}
                      />
                    </TableCell>
                    <TableCell>{item.food?.name || item.name}</TableCell>
                    <TableCell align="center">{item.quantity}</TableCell>
                    <TableCell align="center">{item.price.toLocaleString()}</TableCell>
                    <TableCell align="center">{(item.price * item.quantity).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Order Total */}
        <Box display="flex" justifyContent="space-between" alignItems="center" p={2} bgcolor="grey.100" borderRadius={2}>
          <Typography variant="h6">جمع کل سفارش:</Typography>
          <Typography variant="h5" fontWeight="bold" color="primary">
            {order.totalAmount.toLocaleString()} ریال
          </Typography>
        </Box>

        {/* Action Buttons */}
        <Box display="flex" justifyContent="flex-end" mt={4}>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => setIsModalOpen(true)}
            sx={{ px: 4, py: 1.5 }}
          >
            تغییر وضعیت سفارش
          </Button>
        </Box>

        {/* Status Change Modal */}
        <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2
          }}>
            <Typography variant="h6" mb={3} textAlign="center">
              تغییر وضعیت سفارش
            </Typography>
            
            <Select
              fullWidth
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              sx={{ mb: 3 }}
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
              >
                انصراف
              </Button>
              <Button 
                variant="contained" 
                onClick={handleStatusChange}
                disabled={selectedStatus === order.orderStatus}
              >
                تأیید تغییر
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