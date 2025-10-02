import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import TitleCard from "../components/Cards/TitleCard";
import { setPageTitle } from "../features/common/headerSlice";
import axios from "axios";
import { PiNewspaperClipping, PiReceipt, PiCurrencyCircleDollar, PiCalendar, PiMagnifyingGlass, PiListBullets, PiUser, PiPhone, PiEye } from "react-icons/pi";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCookAuthStore } from "../stores/authStore";

import { DataGrid } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { faIR } from "@mui/x-data-grid/locales";
import { Box, TextField, useMediaQuery, Chip, Avatar } from "@mui/material";
import { IconButton } from "@mui/material";
import { ArrowForwardIos, ArrowBackIos } from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";

import dayjs from "dayjs";
import "dayjs/locale/fa";
import { bgcolor } from "@mui/system";

const TopSideButtons = () => (
  <div className="inline-block">
    <div className="flex items-center gap-3">
   
      <div>
        <h6 className="text-xl font-bold text-gray-800">لیست سفارش‌ها</h6>
        <p className="text-sm text-gray-600 mt-1">مدیریت و پیگیری سفارش‌های مشتریان</p>
      </div>
    </div>
  </div>
);

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(8);
  const dispatch = useDispatch();
  const { isCookAuthenticated } = useCookAuthStore();
  
  const isMobile = useMediaQuery('(max-width: 600px)');
  const isTablet = useMediaQuery('(max-width: 960px)');

  useEffect(() => {
    dispatch(setPageTitle({ title: "لیست سفارش‌ها" }));
  }, [dispatch]);

  useEffect(() => {
    if (!isCookAuthenticated) return;

    setLoading(true);
    axios
      .get("/api/cooks/foods/order-foods", {
        withCredentials: true
      })
      .then((response) => {
        setOrders(response.data.orders);
        setLoading(false);
        console.log(response.data.orders)
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setLoading(false);
      });
  }, [isCookAuthenticated]);

  const getStatusIcon = (status) => {
    switch(status) {
      case "Pending":
        return <PiListBullets className="w-4 h-4" />;
      case "Completed":
        return <PiReceipt className="w-4 h-4" />;
      case "Cancelled":
        return <PiListBullets className="w-4 h-4" />;
      case "Confirmed":
        return <PiReceipt className="w-4 h-4" />;
      default:
        return <PiListBullets className="w-4 h-4" />;
    }
  };

  const columns = [
    {
      field: "_id",
      headerName: "کد سفارش",
      flex: isMobile ? 0 : 1,
      width: isMobile ? 120 : undefined,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 rounded-lg">
            <PiReceipt className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-sm font-medium text-gray-900 font-mono truncate">
            {params.value.slice(-8)}
          </span>
        </div>
      ),
    },
    {
      field: "userName",
      headerName: "مشتری",
      flex: isMobile ? 0 : 1,
      width: isMobile ? 100 : undefined,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-green-50 rounded-full">
            <PiUser className="w-3.5 h-3.5 text-green-600" />
          </div>
          <span className="text-sm text-gray-700 truncate">
            {params.value}
          </span>
        </div>
      ),
    },
    {
      field: "phone",
      headerName: "تلفن",
      flex: isMobile ? 0 : 1,
      width: isMobile ? 100 : undefined,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-purple-50 rounded-full">
            <PiPhone className="w-3.5 h-3.5 text-purple-600" />
          </div>
          <span className="text-sm text-gray-700 dir-ltr">
            {params.value}
          </span>
        </div>
      ),
    },
    {
      field: "orderStatus",
      headerName: isMobile ? "وضعیت" : "وضعیت سفارش",
      flex: isMobile ? 0 : 1,
      width: isMobile ? 100 : undefined,
      renderCell: (params) => {
        const status = params.value;
        let statusConfig = {};
        
        switch(status) {
          case "Pending":
            statusConfig = {
              textClass: "text-blue-700",
              statusText: "در حال پردازش",
              bgClass: "bg-blue-50",
              iconColor: "text-blue-600"
            };
            break;
          case "Completed":
            statusConfig = {
              textClass: "text-green-700",
              statusText: "تکمیل شده",
              bgClass: "bg-green-50",
              iconColor: "text-green-600"
            };
            break;
          case "Cancelled":
            statusConfig = {
              textClass: "text-red-700",
              statusText: "لغو شده",
              bgClass: "bg-red-50",
              iconColor: "text-red-600"
            };
            break;
          case "Confirmed":
            statusConfig = {
              textClass: "text-emerald-700",
              statusText: "تایید شده",
              bgClass: "bg-emerald-50",
              iconColor: "text-emerald-600"
            };
            break;
          default:
            statusConfig = {
              textClass: "text-gray-700",
              statusText: status,
              bgClass: "bg-gray-50",
              iconColor: "text-gray-600"
            };
        }

        return (
          <div className={`${statusConfig.textClass} px-3 py-1.5 rounded-lg flex items-center gap-2`}>
            <span className={`${statusConfig.bgClass} p-1.5 rounded-full`}>
              {getStatusIcon(status)}
            </span>
            <span className="text-xs font-medium">{statusConfig.statusText}</span>
          </div>
        );
      },
    },
    {
      field: "price",
      headerName: "قیمت",
      flex: isMobile ? 0 : 1,
      width: isMobile ? 100 : undefined,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-50 rounded-full">
            <PiCurrencyCircleDollar className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <span className="whitespace-nowrap text-sm font-bold text-gray-900">
            {new Intl.NumberFormat('fa-IR').format(params.value)} تومان
          </span>
        </div>
      ),
    },
    {
      field: "createdAt",
      headerName: isMobile ? "تاریخ" : "تاریخ ایجاد",
      flex: isMobile ? 0 : 1,
      width: isMobile ? 100 : undefined,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-rose-50 rounded-full">
            <PiCalendar className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <span className="text-sm text-gray-700">
            {new Date(params.value).toLocaleDateString("fa")}
          </span>
        </div>
      ),
    },
    {
      field: "details",
      headerName: isMobile ? "" : "عملیات",
      flex: 0.5,
      width: isMobile ? 60 : undefined,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <a 
          href={`/cooks/orders/${params.row._id}/show-details`}
          className="flex items-center justify-center p-2 rounded-xl hover:bg-gray-100 transition-colors"
          aria-label="مشاهده جزئیات"
        >
          <PiEye className="w-4 h-4 text-gray-600" />
          {!isMobile && <span className="mr-2 text-sm font-medium text-gray-700">مشاهده</span>}
        </a>
      ),
    },
  ];

  const rows = orders.map((order) => ({
    id: order._id,
    _id: order._id,
    userName: order.user?.name || "—",
    phone: order.user?.phone || "—",
    orderStatus: order.orderStatus,
    createdAt: order.createdAt || null,
    price: order.totalAmount,
  }));

  const filteredRows = rows.filter((row) =>
    Object.values(row).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const theme = createTheme(
    {
      direction: "rtl",
      breakpoints: {
        values: {
          xs: 0,
          sm: 600,
          md: 960,
          lg: 1280,
          xl: 1920,
        },
      },
      palette: {
        primary: {
          main: '#3B82F6',
        },
      },
    },
    faIR
  );

  return (
    <div className="p-2 md:p-4 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <TitleCard 
        title="" 
        topMargin="mt-2" 
        TopSideButtons={<TopSideButtons />}
        className="shadow-xl rounded-2xl overflow-hidden border-0 bg-white/80 backdrop-blur-sm"
      >
        <ThemeProvider theme={theme}>
          <Box sx={{ height: 550, width: "100%" }}>
            <Box
              sx={{
                mb: 3,
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              <TextField
                placeholder="جستجو در سفارش‌ها ..."
                variant="outlined"
                size="small"
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  width: { xs: "100%", sm: 350 },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#e2e8f0",
                      borderRadius: "12px",
                      borderWidth: "2px",
                    },
                    "&:hover fieldset": {
                      borderColor: "#cbd5e0",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#3B82F6",
                      borderWidth: "2px",
                    },
                  },
                  "& .MuiInputBase-input": {
                    paddingRight: "12px",
                  }
                }}
                inputProps={{
                  style: {
                    textAlign: "right",
                    direction: "rtl",
                    fontSize: "14px",
                  },
                }}
               
              />
            </Box>

            <Box sx={{ 
              height: 500, 
              width: "100%",
              "& .MuiDataGrid-root": {
                border: "none",
                borderRadius: "16px",
                overflow: "hidden",
                background: "white",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }
            }}>
              <DataGrid
                rows={filteredRows}
                columns={columns}
                pagination
                paginationMode="client"
                paginationModel={{ page, pageSize }}
                onPaginationModelChange={(newModel) => {
                  setPage(newModel.page);
                  setPageSize(newModel.pageSize);
                }}
                pageSizeOptions={[5, 8, 10, 20]}
                disableRowSelectionOnClick
                disableColumnMenu
                loading={loading}
                density={isMobile ? "compact" : "standard"}
                sx={{
                  direction: "rtl",
                  fontFamily: "IRANSans, Tahoma, sans-serif",
                  "& .MuiDataGrid-cell": {
                    textAlign: "right",
                    justifyContent: "flex-end",
                    padding: isMobile ? "8px" : "12px 16px",
                    fontSize: isMobile ? "0.75rem" : "0.875rem",
                    borderBottom: "1px solid #f1f5f9",
                    borderColor: "#f1f5f9",
                  },
                  "& .MuiDataGrid-columnHeaderTitle": {
                    textAlign: "right",
                    justifyContent: "flex-end",
                    width: "100%",
                    fontSize: isMobile ? "0.75rem" : "0.875rem",
                    fontWeight: "700",
                    color: "#374151",
                  },
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#f8fafc",
                    borderBottom: "2px solid #e2e8f0",
                    background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                  },
                  "& .MuiDataGrid-row": {
                    backgroundColor: "#fff",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      backgroundColor: "#f8fafc",
                      transform: "translateY(-1px)",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    },
                    "&:nth-of-type(even)": {
                      backgroundColor: "#fafbfc",
                      "&:hover": {
                        backgroundColor: "#f1f5f9",
                      },
                    },
                  },
                  "& .MuiTablePagination-root": {
                    direction: "rtl",
                    borderTop: "1px solid #e2e8f0",
                  },
                  "& .MuiTablePagination-actions": {
                    direction: "rtl",
                  },
                }}
                slots={{
                  loadingOverlay: () => (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      <div className="text-center">
                        <CircularProgress size={32} className="text-blue-500" />
                        <p className="mt-2 text-gray-600">در حال بارگذاری سفارش‌ها...</p>
                      </div>
                    </Box>
                  ),
                  noRowsOverlay: () => (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        flexDirection: "column",
                        gap: 2,
                        color: "text.secondary",
                      }}
                    >
                      <div className="p-4 bg-gray-100 rounded-full">
                        <PiNewspaperClipping className="w-12 h-12 text-gray-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold text-gray-600">هیچ سفارشی یافت نشد</p>
                        <p className="text-sm text-gray-500 mt-1">هنوز سفارشی ثبت نشده است</p>
                      </div>
                    </Box>
                  ),
                }}
                slotProps={{
                  pagination: {
                    labelRowsPerPage: "تعداد ردیف در هر صفحه:",
                    rowsPerPageOptions: isMobile ? [5, 8] : [5, 8, 10, 20],
                    nextIconButton: (
                      <IconButton size="small" className="bg-blue-50 hover:bg-blue-100">
                        <ArrowForwardIos fontSize="small" className="text-blue-600" />
                      </IconButton>
                    ),
                    previousIconButton: (
                      <IconButton size="small" className="bg-blue-50 hover:bg-blue-100">
                        <ArrowBackIos fontSize="small" className="text-blue-600" />
                      </IconButton>
                    ),
                  },
                }}
                localeText={{
                  ...faIR.components.MuiDataGrid.defaultProps.localeText,
                  footerPaginationDisplayedRows: (from, to, count) =>
                    `${from}–${to} از ${count}`,
                }}
              />
            </Box>
          </Box>
        </ThemeProvider>
      </TitleCard>
      <ToastContainer
        position="top-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <style jsx>{`
        :global(body) {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }
        
        @media (max-width: 600px) {
          :global(.MuiDataGrid-virtualScroller) {
            overflow-x: auto;
          }
          
          :global(.MuiDataGrid-row) {
            min-width: 600px;
          }
        }
        
        .dir-ltr {
          direction: ltr;
        }
      `}</style>
    </div>
  );
};

export default Orders;