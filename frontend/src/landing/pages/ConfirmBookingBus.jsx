import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Button,
  Divider,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Box,
  Container,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Stack,
  Alert,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  FaBus,
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaDownload,
  FaPrint,
  FaCheckCircle,
  FaExclamationTriangle,
  FaArrowLeft,
  FaTimes
} from 'react-icons/fa';

// Styled components with improved responsive design
const MinimalButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  color: theme.palette.text.primary,
  border: `1px solid ${theme.palette.grey[300]}`,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1.5, 3),
  fontWeight: 500,
  '&:hover': {
    backgroundColor: theme.palette.grey[200],
    boxShadow: theme.shadows[1],
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginBottom: theme.spacing(1),
  },
}));

const PrimaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1.5, 3),
  fontWeight: 500,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    boxShadow: theme.shadows[2],
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginBottom: theme.spacing(1),
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(1),
  boxShadow: theme.shadows[2],
  border: `1px solid ${theme.palette.grey[200]}`,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const TicketCard = styled(Card)(({ theme }) => ({
  border: `1px solid ${theme.palette.grey[300]}`,
  borderRadius: theme.spacing(1),
  overflow: 'hidden',
  backgroundColor: theme.palette.common.white,
}));

// Helper function to extract ticket ID from URL
const getTicketIdFromUrl = (path) => {
  const parts = path.split('/confirm-bus-ticket/');
  return parts.length > 1 ? parts[1] : null;
};

// Custom hook for ticket data fetching
const useTicketData = (ticketId) => {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTicketData = async () => {
      if (!ticketId) {
        setError('Ticket ID not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Simulated API call
        setTimeout(() => {
          const fetchedTicket = {
            _id: '12345',
            bookingId: 'BK20230715',
            busType: 'اتوبوس VIP',
            busNumber: 'BV-2541',
            ticketNumber: 'TKT789456',
            from: 'تهران',
            to: 'مشهد',
            movingDate: '1402/04/25',
            startHour: '08:30',
            endHour: '20:00',
            fare: '250,000',
            boardingPoint: 'پایانه جنوب',
            dropPoint: 'پایانه مشهد',
            duration: '11 ساعت و 30 دقیقه',
            seatNumbers: ['12A', '12B', '13A']
          };
          
          setTicket(fetchedTicket);
          setLoading(false);
        }, 1500);
      } catch (err) {
        console.error('Error fetching ticket:', err);
        setError(err.message || 'Failed to load ticket');
        toast.error(err.message || 'خطا در دریافت اطلاعات بلیط');
        setLoading(false);
      }
    };

    fetchTicketData();
  }, [ticketId]);

  return { ticket, loading, error };
};

const ConfirmBookingBus = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  // State management
  const [step, setStep] = useState('loading');
  const [passengerCount, setPassengerCount] = useState(1);
  const [passengers, setPassengers] = useState([]);
  const [currentPassengerIndex, setCurrentPassengerIndex] = useState(0);
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const ticketRef = useRef();

  // Get ticket ID from URL
  const ticketId = getTicketIdFromUrl(window.location.pathname);
  const { ticket, loading, error } = useTicketData(ticketId);

  // Form handling
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch
  } = useForm();

  // Update step when data is loaded
  useEffect(() => {
    if (ticket) {
      setStep('count');
    }
  }, [ticket]);

  // Handle passenger count submission
  const handlePassengerCountSubmit = (data) => {
    const count = parseInt(data.count);
    setPassengerCount(count);
    setPassengers(Array(count).fill({}));
    setStep('form');
    reset();
  };

  // Handle passenger form submission
  const handlePassengerSubmit = (data) => {
    const newPassengers = [...passengers];
    newPassengers[currentPassengerIndex] = data;
    setPassengers(newPassengers);

    if (currentPassengerIndex < passengerCount - 1) {
      setCurrentPassengerIndex(currentPassengerIndex + 1);
      reset();
      toast.success(`اطلاعات مسافر ${currentPassengerIndex + 1} ثبت شد`);
    } else {
      setStep('complete');
      toast.success('اطلاعات تمام مسافران ثبت شد');
    }
  };

  // Generate PDF ticket
  const handleDownloadPDF = useCallback(async () => {
    try {
      toast.info('در حال ایجاد فایل PDF...');
      
      // Dynamically import jsPDF and html2canvas
      const { jsPDF } = await import('jspdf');
      const html2canvas = await import('html2canvas');
      
      const input = ticketRef.current;
      const canvas = await html2canvas.default(input, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`بلیط-اتوبوس-${ticket.bookingId}.pdf`);
      
      toast.success('فایل PDF با موفقیت ایجاد شد');
    } catch (err) {
      console.error('Error generating PDF:', err);
      toast.error('خطا در ایجاد فایل PDF');
    }
  }, [ticket]);

  // Download as image
  const handleDownloadImage = useCallback(async () => {
    try {
      toast.info('در حال ایجاد تصویر بلیط...');
      
      const html2canvas = await import('html2canvas');
      const input = ticketRef.current;
      
      const canvas = await html2canvas.default(input, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      const image = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.href = image;
      link.download = `بلیط-اتوبوس-${ticket.bookingId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('تصویر بلیط با موفقیت دانلود شد');
    } catch (err) {
      console.error('Error generating image:', err);
      toast.error('خطا در ایجاد تصویر بلیط');
    }
  }, [ticket]);

  // Confirm ticket
  const handleConfirmTicket = async () => {
    try {
      const data = { ticketId, passengers };
      // Simulate API call
      setTimeout(() => {
        toast.success('بلیط با موفقیت تایید شد');
      }, 1500);
    } catch (err) {
      console.error('Error confirming ticket:', err);
      toast.error('خطا در تایید بلیط');
    }
  };

  // Print ticket
  const handlePrint = () => {
    setShowPrintDialog(true);
  };

  const handleClosePrintDialog = () => {
    setShowPrintDialog(false);
  };

  const handleConfirmPrint = () => {
    toast.info('آماده‌سازی برای چاپ...');
    const content = ticketRef.current;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Ticket</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; direction: rtl; background: white; }
            .ticket { border: 1px solid #bdbdbd; border-radius: 8px; padding: 20px; background: white; }
            .header { border-bottom: 1px solid #e0e0e0; padding: 10px; text-align: center; }
            .footer { border-top: 1px solid #e0e0e0; padding: 8px; text-align: center; }
            @media print { 
              body { padding: 0; margin: 0; background: white; } 
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          ${content.innerHTML}
          <div class="no-print" style="text-align: center; margin-top: 20px;">
            <button onclick="window.print()" style="padding: 10px 20px; background: #424242; color: white; border: none; border-radius: 5px; cursor: pointer;">چاپ</button>
            <button onclick="window.close()" style="padding: 10px 20px; background: #9e9e9e; color: white; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">بستن</button>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    setShowPrintDialog(false);
  };

  // Go back to previous step
  const handleBack = () => {
    if (step === 'form' && currentPassengerIndex > 0) {
      setCurrentPassengerIndex(currentPassengerIndex - 1);
      reset(passengers[currentPassengerIndex - 1]);
    } else if (step === 'form' && currentPassengerIndex === 0) {
      setStep('count');
    } else if (step === 'complete') {
      setStep('form');
      setCurrentPassengerIndex(passengerCount - 1);
      reset(passengers[passengerCount - 1]);
    }
  };

  // Loading state
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="70vh"
        flexDirection="column"
      >
        <CircularProgress size={60} thickness={4} sx={{ color: 'primary.main' }} />
        <Typography variant="h6" mt={2} color="text.secondary">
          در حال دریافت اطلاعات بلیط...
        </Typography>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
          flexDirection="column"
          textAlign="center"
        >
          <FaExclamationTriangle size={48} color={theme.palette.text.secondary} />
          <Typography variant="h5" mt={2} color="text.primary" gutterBottom>
            خطا در دریافت اطلاعات
          </Typography>
          <Typography variant="body1" mb={3} color="text.secondary">
            {error}
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <PrimaryButton
              onClick={() => window.location.reload()}
              startIcon={<FaArrowLeft />}
            >
              تلاش مجدد
            </PrimaryButton>
            <MinimalButton href="/">
              بازگشت به صفحه اصلی
            </MinimalButton>
          </Stack>
        </Box>
      </Container>
    );
  }

  // Ticket not found state
  if (!ticket) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
          flexDirection="column"
          textAlign="center"
        >
          <FaExclamationTriangle size={48} color={theme.palette.text.secondary} />
          <Typography variant="h5" mt={2} gutterBottom color="text.primary">
            بلیطی یافت نشد
          </Typography>
          <Typography variant="body1" mb={3} color="text.secondary">
            شماره بلیط وارد شده معتبر نمی‌باشد
          </Typography>
          <MinimalButton href="/">
            بازگشت به صفحه اصلی
          </MinimalButton>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" color="text.primary" gutterBottom>
          تکمیل و تایید بلیط اتوبوس
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          شماره رزرو: {ticket.bookingId}
        </Typography>
      </Box>

      {step === 'count' ? (
        <Grid container justifyContent="center">
          <Grid item xs={12} md={6}>
            <StyledPaper>
              <Typography variant="h6" textAlign="center" gutterBottom color="text.primary">
                تعداد مسافران را مشخص کنید
              </Typography>
              <form onSubmit={handleSubmit(handlePassengerCountSubmit)}>
                <FormControl fullWidth error={!!errors.count} sx={{ my: 2 }}>
                  <InputLabel>تعداد مسافران</InputLabel>
                  <Select
                    label="تعداد مسافران"
                    defaultValue={1}
                    {...register("count", {
                      required: "لطفا تعداد مسافران را انتخاب کنید",
                      min: { value: 1, message: "حداقل 1 مسافر لازم است" }
                    })}
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <MenuItem key={num} value={num}>{num} نفر</MenuItem>
                    ))}
                  </Select>
                  {errors.count && (
                    <FormHelperText>{errors.count.message}</FormHelperText>
                  )}
                </FormControl>
                <PrimaryButton
                  type="submit"
                  fullWidth
                  size="large"
                  sx={{ mt: 2 }}
                >
                  ادامه
                </PrimaryButton>
              </form>
            </StyledPaper>
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={3}>
          {/* Left Column - Ticket */}
          <Grid item xs={12} lg={6}>
            <Box ref={ticketRef}>
              <TicketCard>
                <CardHeader 
                  title={ticket.busType}
                  subheader={`شماره اتوبوس: ${ticket.busNumber} | شماره بلیط: ${ticket.ticketNumber}`}
                  titleTypographyProps={{ variant: 'h6', align: 'center', color: 'text.primary' }}
                  subheaderTypographyProps={{ align: 'center', color: 'text.secondary' }}
                  sx={{ 
                    backgroundColor: 'background.paper',
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    py: 2
                  }}
                />
                <CardContent sx={{ p: 3 }}>
                  {/* Route Information */}
                  <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 3, pb: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
                    <Box textAlign="center">
                      <Typography variant="body2" color="text.secondary">مبدا</Typography>
                      <Typography variant="h6" fontWeight="bold" color="text.primary">{ticket.from}</Typography>
                    </Box>
                    <Box sx={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: '50%', 
                      backgroundColor: 'grey.100',
                      border: `1px solid ${theme.palette.divider}`,
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <FaBus color={theme.palette.text.secondary} />
                    </Box>
                    <Box textAlign="center">
                      <Typography variant="body2" color="text.secondary">مقصد</Typography>
                      <Typography variant="h6" fontWeight="bold" color="text.primary">{ticket.to}</Typography>
                    </Box>
                  </Stack>

                  {/* Journey Details */}
                  <Stack spacing={2} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', p: 1.5, backgroundColor: 'grey.50', borderRadius: 1, border: `1px solid ${theme.palette.divider}` }}>
                      <FaCalendarAlt style={{ marginLeft: 8, color: theme.palette.text.secondary }} />
                      <Box sx={{ marginRight: 1 }}>
                        <Typography variant="body2" color="text.secondary">تاریخ حرکت</Typography>
                        <Typography variant="body1" fontWeight="medium" color="text.primary">{ticket.movingDate}</Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', p: 1.5, backgroundColor: 'grey.50', borderRadius: 1, border: `1px solid ${theme.palette.divider}` }}>
                      <FaClock style={{ marginLeft: 8, color: theme.palette.text.secondary }} />
                      <Box sx={{ marginRight: 1 }}>
                        <Typography variant="body2" color="text.secondary">ساعت حرکت</Typography>
                        <Typography variant="body1" fontWeight="medium" color="text.primary">{ticket.startHour}</Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', p: 1.5, backgroundColor: 'grey.50', borderRadius: 1, border: `1px solid ${theme.palette.divider}` }}>
                      <FaClock style={{ marginLeft: 8, color: theme.palette.text.secondary }} />
                      <Box sx={{ marginRight: 1 }}>
                        <Typography variant="body2" color="text.secondary">ساعت رسیدن</Typography>
                        <Typography variant="body1" fontWeight="medium" color="text.primary">{ticket.endHour}</Typography>
                      </Box>
                    </Box>
                  </Stack>

                  {/* Passengers List */}
                  {step === 'complete' && (
                    <Box sx={{ mb: 3, pb: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
                      <Typography variant="subtitle2" gutterBottom color="text.primary">لیست مسافران</Typography>
                      <Stack spacing={1}>
                        {passengers.map((passenger, index) => (
                          <Paper key={index} elevation={0} sx={{ p: 1.5, border: `1px solid ${theme.palette.divider}`, backgroundColor: 'grey.50' }}>
                            <Typography variant="body2" fontWeight="medium" gutterBottom color="text.primary">
                              مسافر {index + 1}: {passenger.name}
                            </Typography>
                            <Grid container spacing={1}>
                              <Grid item xs={6}>
                                <Typography variant="caption" display="block" color="text.secondary">کد ملی: {passenger.nationalCode}</Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="caption" display="block" color="text.secondary">سن: {passenger.age}</Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="caption" display="block" color="text.secondary">
                                  جنسیت: {passenger.gender === 'male' ? 'مرد' : 'زن'}
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="caption" display="block" color="text.secondary">
                                  صندلی: {ticket.seatNumbers?.[index] || 'تعیین نشده'}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Paper>
                        ))}
                      </Stack>
                    </Box>
                  )}

                  {/* Price and Boarding Info */}
                  <Stack spacing={2} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', p: 1.5, backgroundColor: 'grey.50', borderRadius: 1, border: `1px solid ${theme.palette.divider}` }}>
                      <Box sx={{ marginRight: 1 }}>
                        <Typography variant="body2" color="text.secondary">قیمت کل</Typography>
                        <Typography variant="h6" fontWeight="bold" color="text.primary">
                          {new Intl.NumberFormat('fa-IR').format(
                            (parseInt(ticket.fare?.replace(/\D/g, '') || 0) * passengerCount)
                          )} تومان
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>

                  {/* Boarding Points */}
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', p: 1.5, backgroundColor: 'grey.50', borderRadius: 1, border: `1px solid ${theme.palette.divider}` }}>
                      <FaMapMarkerAlt style={{ marginLeft: 8, marginTop: 4, color: theme.palette.text.secondary }} />
                      <Box sx={{ marginRight: 1 }}>
                        <Typography variant="body2" color="text.secondary">محل سوار شدن</Typography>
                        <Typography variant="body1" fontWeight="medium" color="text.primary">{ticket.boardingPoint}</Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'flex-start', p: 1.5, backgroundColor: 'grey.50', borderRadius: 1, border: `1px solid ${theme.palette.divider}` }}>
                      <FaMapMarkerAlt style={{ marginLeft: 8, marginTop: 4, color: theme.palette.text.secondary }} />
                      <Box sx={{ marginRight: 1 }}>
                        <Typography variant="body2" color="text.secondary">محل پیاده شدن</Typography>
                        <Typography variant="body1" fontWeight="medium" color="text.primary">{ticket.dropPoint}</Typography>
                      </Box>
                    </Box>
                  </Stack>
                </CardContent>
                <Box sx={{ 
                  backgroundColor: 'grey.100',
                  borderTop: `1px solid ${theme.palette.divider}`,
                  color: 'text.secondary', 
                  py: 1.5, 
                  px: 2,
                  textAlign: 'center'
                }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption">مدت سفر: {ticket.duration}</Typography>
                    <Typography variant="caption">شماره رزرو: {ticket.bookingId}</Typography>
                  </Stack>
                </Box>
              </TicketCard>
            </Box>
          </Grid>

          {/* Right Column - Form or Completion */}
          <Grid item xs={12} lg={6}>
            {step === 'form' ? (
              <StyledPaper>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  {currentPassengerIndex > 0 && (
                    <Button 
                      startIcon={<FaArrowLeft />} 
                      onClick={handleBack}
                      sx={{ mr: 2, color: 'text.secondary' }}
                      variant="outlined"
                    >
                      بازگشت
                    </Button>
                  )}
                  <Typography variant="h6" color="text.primary">
                    اطلاعات مسافر {currentPassengerIndex + 1} از {passengerCount}
                  </Typography>
                </Box>
                
                <form onSubmit={handleSubmit(handlePassengerSubmit)}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="نام کامل مسافر"
                        variant="outlined"
                        defaultValue={passengers[currentPassengerIndex]?.name || ''}
                        {...register("name", {
                          required: "نام مسافر الزامی است",
                          minLength: {
                            value: 3,
                            message: "نام باید حداقل ۳ حرف باشد"
                          }
                        })}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="کد ملی"
                        variant="outlined"
                        inputProps={{ maxLength: 10 }}
                        defaultValue={passengers[currentPassengerIndex]?.nationalCode || ''}
                        {...register("nationalCode", {
                          required: "کد ملی الزامی است",
                          pattern: {
                            value: /^\d{10}$/,
                            message: "کد ملی باید ۱۰ رقم باشد"
                          }
                        })}
                        error={!!errors.nationalCode}
                        helperText={errors.nationalCode?.message}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="سن"
                        variant="outlined"
                        type="number"
                        inputProps={{ min: 1, max: 120 }}
                        defaultValue={passengers[currentPassengerIndex]?.age || ''}
                        {...register("age", {
                          required: "سن الزامی است",
                          min: {
                            value: 1,
                            message: "سن باید بیشتر از ۰ باشد"
                          },
                          max: {
                            value: 120,
                            message: "سن باید کمتر از ۱۲۰ باشد"
                          }
                        })}
                        error={!!errors.age}
                        helperText={errors.age?.message}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <FormControl fullWidth error={!!errors.gender}>
                        <InputLabel>جنسیت</InputLabel>
                        <Select
                          label="جنسیت"
                          defaultValue={passengers[currentPassengerIndex]?.gender || ''}
                          {...register("gender", {
                            required: "انتخاب جنسیت الزامی است"
                          })}
                        >
                          <MenuItem value="male">مرد</MenuItem>
                          <MenuItem value="female">زن</MenuItem>
                        </Select>
                        <FormHelperText>{errors.gender?.message}</FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <PrimaryButton
                        type="submit"
                        fullWidth
                        size="large"
                        disabled={isSubmitting}
                      >
                        {currentPassengerIndex < passengerCount - 1 ? 'ثبت و ادامه به مسافر بعدی' : 'تکمیل اطلاعات'}
                      </PrimaryButton>
                    </Grid>
                  </Grid>
                </form>
              </StyledPaper>
            ) : (
              <StyledPaper>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <FaCheckCircle style={{ fontSize: 60, color: theme.palette.success.main, marginBottom: 16 }} />
                  <Typography variant="h6" color="text.primary" gutterBottom>
                    اطلاعات تمام مسافران ثبت شد
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    لطفاً بلیط خود را ذخیره یا چاپ کنید
                  </Typography>

                  <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: 'center', flexWrap: 'wrap' }}>
                    <MinimalButton
                      startIcon={<FaPrint />}
                      onClick={handlePrint}
                      sx={{ m: 0.5 }}
                    >
                      چاپ بلیط
                    </MinimalButton>
                    <MinimalButton
                      startIcon={<FaDownload />}
                      onClick={handleDownloadPDF}
                      sx={{ m: 0.5 }}
                    >
                      دانلود PDF
                    </MinimalButton>
                    <MinimalButton
                      startIcon={<FaDownload />}
                      onClick={handleDownloadImage}
                      sx={{ m: 0.5 }}
                    >
                      دانلود تصویر
                    </MinimalButton>
                    <PrimaryButton
                      onClick={handleConfirmTicket}
                      sx={{ m: 0.5 }}
                    >
                      تایید بلیط
                    </PrimaryButton>
                  </Stack>
                </Box>

                <Divider sx={{ my: 3, borderColor: 'divider' }} />

                <Alert severity="info" sx={{ mb: 2, backgroundColor: 'grey.50', color: 'text.primary', border: `1px solid ${theme.palette.divider}` }}>
                  <Typography variant="subtitle2" gutterBottom color="text.primary">
                    راهنمای سفر
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, m: 0 }}>
                    <Typography component="li" variant="body2" color="text.secondary">
                      لطفاً حداقل ۴۵ دقیقه قبل از حرکت در محل سوار شدن حاضر باشید
                    </Typography>
                    <Typography component="li" variant="body2" color="text.secondary">
                      کارت شناسایی معتبر همراه داشته باشید
                    </Typography>
                    <Typography component="li" variant="body2" color="text.secondary">
                      بلیط چاپ شده یا دیجital خود را به راننده نشان دهید
                    </Typography>
                    <Typography component="li" variant="body2" color="text.secondary">
                      در صورت هرگونه مشکل با پشتیبانی تماس بگیرید: ۰۲۱-۱۲۳۴۵۶۷۸
                    </Typography>
                  </Box>
                </Alert>
              </StyledPaper>
            )}
          </Grid>
        </Grid>
      )}

      {/* Print Confirmation Dialog */}
      <Dialog open={showPrintDialog} onClose={handleClosePrintDialog}>
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">تایید چاپ</Typography>
            <IconButton onClick={handleClosePrintDialog}>
              <FaTimes />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>
            آیا مطمئن هستید که می‌خواهید بلیط را چاپ کنید؟
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePrintDialog} color="primary">
            انصراف
          </Button>
          <Button onClick={handleConfirmPrint} color="primary" variant="contained">
            تایید و چاپ
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ConfirmBookingBus;