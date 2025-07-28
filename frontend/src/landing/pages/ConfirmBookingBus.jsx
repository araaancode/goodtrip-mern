import React, { useRef, useState, useEffect } from 'react';
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
  Box
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
  FaExclamationTriangle
} from 'react-icons/fa';

import { useBusStore } from '../store/busStore';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '12px',
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0px 6px 24px rgba(0, 0, 0, 0.15)',
  },
}));

const ConfirmBookingBus = () => {
  // State management
  const [step, setStep] = useState('loading');
  const [passengerCount, setPassengerCount] = useState(1);
  const [passengers, setPassengers] = useState([]);
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPassengerIndex, setCurrentPassengerIndex] = useState(0);
  const ticketRef = useRef();

  // Form handling
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm();

  // Get ticket ID from URL
  const ticketId = window.document.URL.split('/confirm-bus-ticket/')[1]

  const { fetchTicketById, confirmTicket, cancelTicket } = useBusStore();

  // Fetch ticket data
  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        setLoading(true);
        setError(null);


        const fetchedTicket = await fetchTicketById(ticketId);

        if (!fetchedTicket || !fetchedTicket._id) {
          throw new Error('Ticket data not found');
        }

        setTicket(fetchedTicket);
        setStep('count');
      } catch (error) {
        console.error('Error fetching ticket:', error);
        // setError(error.message || 'Failed to load ticket');
        // toast.error(error.message || 'خطا در دریافت اطلاعات بلیط');

      } finally {
        setLoading(false);
      }
    };

    fetchTicketData();
  }, [fetchTicketById]);

  // Handle passenger count submission
  const handlePassengerCountSubmit = (data) => {
    setPassengerCount(parseInt(data.count));
    setStep('form');
    reset();
  };

  // Handle passenger form submission
  const handlePassengerSubmit = (data) => {
    const newPassengers = [...passengers, data];
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
  const handleDownloadPDF = async () => {
    try {
      toast.info('در حال ایجاد فایل PDF...');
      const { jsPDF } = await import('jspdf');
      const { default: html2canvas } = await import('html2canvas');

      const input = ticketRef.current;
      const canvas = await html2canvas(input, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', [120, 150]);
      pdf.addImage(imgData, 'PNG', 0, 0, 120, 150);
      pdf.save(`بلیط-اتوبوس-${ticket.bookingId}.pdf`);
      toast.success('فایل PDF با موفقیت ایجاد شد');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('خطا در ایجاد فایل PDF');
    }
  };


  // confirm ticket
  const handleConfirmTicket = async() => {
    const data={ticketId,passengers}
    await confirmTicket(data)
  }

  // Print ticket
  const handlePrint = () => {
    toast.info('آماده‌سازی برای چاپ...');
    window.print();
  };

  // Loading state
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Box textAlign="center">
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" mt={2}>
            در حال دریافت اطلاعات بلیط...
          </Typography>
        </Box>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        flexDirection="column"
      >
        <FaExclamationTriangle size={48} color="#f44336" />
        <Typography variant="h5" mt={2} color="error">
          خطا در دریافت اطلاعات
        </Typography>
        <Typography variant="body1" mt={1}>
          {error}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
          onClick={() => window.location.reload()}
        >
          تلاش مجدد
        </Button>
      </Box>
    );
  }

  // Ticket not found state
  if (!ticket) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        flexDirection="column"
      >
        <FaExclamationTriangle size={48} color="#ff9800" />
        <Typography variant="h5" mt={2}>
          بلیطی یافت نشد
        </Typography>
        <Typography variant="body1" mt={1}>
          شماره بلیط وارد شده معتبر نمی‌باشد
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          sx={{ mt: 3 }}
          href="/"
        >
          بازگشت به صفحه اصلی
        </Button>
      </Box>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gray-50" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <Typography variant="h4" component="h1" className="text-center text-indigo-700 mb-2">
          تکمیل و تایید بلیط اتوبوس
        </Typography>
        <Typography variant="subtitle1" className="text-center text-gray-600 mb-8">
          شماره رزرو: {ticket.bookingId}
        </Typography>

        {step === 'count' ? (
          <StyledPaper className="max-w-md mt-8 mx-auto p-6">
            <Typography variant="h6" className="text-center mb-4">
              تعداد مسافران را مشخص کنید
            </Typography>
            <form onSubmit={handleSubmit(handlePassengerCountSubmit)}>
              <FormControl fullWidth error={!!errors.count}>
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
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                sx={{ mt: 2 }}
              >
                ادامه
              </Button>
            </form>
          </StyledPaper>
        ) : (
          <Grid container spacing={4}>
            {/* Left Column - Ticket */}
            <Grid item xs={12} md={6}>
              <StyledPaper ref={ticketRef} className="h-full">
                {/* Ticket Header */}
                <div className="bg-indigo-600 p-3 text-white text-center rounded-t-lg">
                  <h2 className="text-xl font-bold">{ticket.busType}</h2>
                  <div className="flex justify-center gap-4 mt-1 text-xs">
                    <p>شماره اتوبوس: {ticket.busNumber}</p>
                    <p>شماره بلیط: {ticket.ticketNumber}</p>
                  </div>
                </div>

                {/* Ticket Body */}
                <div className="p-4">
                  {/* Route Information */}
                  <div className="flex justify-between items-center mb-4 pb-3 border-b">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">مبدا</p>
                      <p className="font-bold text-lg">{ticket.from}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <FaBus className="text-indigo-600 text-xl" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">مقصد</p>
                      <p className="font-bold text-lg">{ticket.to}</p>
                    </div>
                  </div>

                  {/* Journey Details */}
                  <div className="grid grid-cols-1 gap-4 text-sm mb-4">
                    <div className="flex items-center bg-indigo-50 p-2 rounded">
                      <FaCalendarAlt className="text-indigo-600 ml-2" />
                      <div>
                        <p className="text-gray-500">تاریخ حرکت</p>
                        <p className="font-medium">{ticket.movingDate}</p>
                      </div>
                    </div>

                    <div className="flex items-center bg-indigo-50 p-2 rounded">
                      <FaClock className="text-indigo-600 ml-2" />
                      <div>
                        <p className="text-gray-500">ساعت حرکت</p>
                        <p className="font-medium">{ticket.startHour}</p>
                      </div>
                    </div>

                    <div className="flex items-center bg-indigo-50 p-2 rounded">
                      <FaClock className="text-indigo-600 ml-2" />
                      <div>
                        <p className="text-gray-500">ساعت رسیدن</p>
                        <p className="font-medium">{ticket.endHour}</p>
                      </div>
                    </div>
                  </div>

                  {/* Passengers List */}
                  {step === 'complete' && (
                    <div className="mb-4 border-b pb-4">
                      <h3 className="font-semibold mb-2">لیست مسافران</h3>
                      {passengers.map((passenger, index) => (
                        <div key={index} className="mb-2 p-2 bg-gray-50 rounded">
                          <p className="font-medium">مسافر {index + 1}: {passenger.name}</p>
                          <div className="grid grid-cols-2 text-xs">
                            <p>کد ملی: {passenger.nationalCode}</p>
                            <p>سن: {passenger.age}</p>
                            <p>جنسیت: {passenger.gender === 'male' ? 'مرد' : 'زن'}</p>
                            <p>صندلی: {ticket.seatNumbers?.[index] || 'تعیین نشده'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Price and Boarding Info */}
                  <div className="grid grid-cols-1 gap-4 text-sm mb-4">
                    <div className="flex items-center bg-indigo-50 p-2 rounded">
                      <div>
                        <p className="text-gray-500">قیمت کل</p>
                        <p className="font-medium text-indigo-600">
                          {new Intl.NumberFormat('fa-IR').format(
                            (parseInt(ticket.fare?.replace(/\D/g, '') || 0) * passengerCount)
                          )} تومان
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Boarding Points */}
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start bg-indigo-50 p-2 rounded">
                      <FaMapMarkerAlt className="text-indigo-600 ml-2 mt-1" />
                      <div>
                        <p className="text-gray-500">محل سوار شدن</p>
                        <p className="font-medium">{ticket.boardingPoint}</p>
                      </div>
                    </div>

                    <div className="flex items-start bg-indigo-50 p-2 rounded">
                      <FaMapMarkerAlt className="text-indigo-600 ml-2 mt-1" />
                      <div>
                        <p className="text-gray-500">محل پیاده شدن</p>
                        <p className="font-medium">{ticket.dropPoint}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ticket Footer */}
                <div className="bg-indigo-600 p-2 text-center text-xs text-white rounded-b-lg">
                  <div className="flex justify-between px-4">
                    <p>مدت سفر: {ticket.duration}</p>
                    <p>شماره رزرو: {ticket.bookingId}</p>
                  </div>
                </div>
              </StyledPaper>
            </Grid>

            {/* Right Column - Form or Completion */}
            <Grid item xs={12} md={6}>
              {step === 'form' ? (
                <StyledPaper>
                  <Typography variant="h6" className="mb-4 text-center">
                    اطلاعات مسافر {currentPassengerIndex + 1} از {passengerCount}
                  </Typography>
                  <form onSubmit={handleSubmit(handlePassengerSubmit)}>
                    <div className="grid grid-cols-1 gap-4 mb-6">
                      <TextField
                        fullWidth
                        label="نام کامل مسافر"
                        variant="outlined"
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

                      <TextField
                        fullWidth
                        label="کد ملی"
                        variant="outlined"
                        inputProps={{ maxLength: 10 }}
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

                      <TextField
                        fullWidth
                        label="سن"
                        variant="outlined"
                        type="number"
                        inputProps={{ min: 1, max: 120 }}
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

                      <FormControl fullWidth error={!!errors.gender}>
                        <InputLabel>جنسیت</InputLabel>
                        <Select
                          label="جنسیت"
                          {...register("gender", {
                            required: "انتخاب جنسیت الزامی است"
                          })}
                        >
                          <MenuItem value="male">مرد</MenuItem>
                          <MenuItem value="female">زن</MenuItem>
                        </Select>
                        <FormHelperText>{errors.gender?.message}</FormHelperText>
                      </FormControl>
                    </div>

                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      size="large"
                    >
                      {currentPassengerIndex < passengerCount - 1 ? 'ثبت و ادامه به مسافر بعدی' : 'تکمیل اطلاعات'}
                    </Button>
                  </form>
                </StyledPaper>
              ) : (
                <StyledPaper>
                  <div className="text-center mb-6">
                    <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-3" />
                    <Typography variant="h6" className="text-green-700 mb-2">
                      اطلاعات تمام مسافران ثبت شد
                    </Typography>
                    <Typography variant="body1" className="mb-4">
                      لطفاً بلیط خود را ذخیره یا چاپ کنید
                    </Typography>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<FaPrint />}
                        onClick={handlePrint}
                        fullWidth
                        size="large"
                      >
                        چاپ بلیط
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<FaDownload />}
                        onClick={handleDownloadPDF}
                        fullWidth
                        size="large"
                      >
                        دانلود بلیط (PDF)
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleConfirmTicket}
                        fullWidth
                        size="large"
                      >
                        تایید بلیط
                      </Button>
                    </div>
                  </div>

                  <Divider className="my-6" />

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-bold mb-2">راهنمای سفر</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start">
                        <span className="text-blue-500 ml-2">•</span>
                        لطفاً حداقل ۴۵ دقیقه قبل از حرکت در محل سوار شدن حاضر باشید
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 ml-2">•</span>
                        کارت شناسایی معتبر همراه داشته باشید
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 ml-2">•</span>
                        بلیط چاپ شده یا دیجیتال خود را به راننده نشان دهید
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 ml-2">•</span>
                        در صورت هرگونه مشکل با پشتیبانی تماس بگیرید: ۰۲۱-۱۲۳۴۵۶۷۸
                      </li>
                    </ul>
                  </div>
                </StyledPaper>
              )}
            </Grid>
          </Grid>
        )}
      </div>
    </div>
  );
};

export default ConfirmBookingBus;