import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import TitleCard from "../components/Cards/TitleCard";
import { setPageTitle } from "../features/common/headerSlice";
import axios from "axios";
import { PiNewspaperClipping } from "react-icons/pi";
import { IoEyeOutline } from "react-icons/io5";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCookAuthStore } from "../stores/authStore";

import { DataGrid } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { faIR } from "@mui/x-data-grid/locales";
import { Box, TextField, useMediaQuery } from "@mui/material";
import { IconButton } from "@mui/material";
import { ArrowForwardIos, ArrowBackIos } from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";

import dayjs from "dayjs";
import "dayjs/locale/fa";

const TopSideButtons = () => (
  <div className="inline-block">
    <h6 className="text-lg font-semibold text-gray-800">لیست سفارش‌ها</h6>
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
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setLoading(false);
      });
  }, [isCookAuthenticated]);

  const columns = [
    {
      field: "_id",
      headerName: "کد سفارش",
      flex: isMobile ? 0 : 1,
      width: isMobile ? 120 : undefined,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <span className="text-sm truncate">{params.value}</span>
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
        let statusClass = "";
        let statusText = "";
        
        switch(status) {
          case "Pending":
            statusClass = "bg-blue-100 text-blue-800";
            statusText = "در حال پردازش";
            break;
          case "Completed":
            statusClass = "bg-green-100 text-green-800";
            statusText = "بسته شده";
            break;
          case "Cancelled":
            statusClass = "bg-yellow-100 text-yellow-800";
            statusText = "لغو شده";
            break;
          case "Confirmed":
            statusClass = "bg-green-100 text-green-800";
            statusText = "تایید شده";
            break;
          default:
            statusClass = "bg-gray-100 text-gray-800";
            statusText = status;
        }
        
        return (
          <span className={`${statusClass} text-xs font-medium px-2.5 py-0.5 rounded-sm`}>
            {statusText}
          </span>
        );
      },
    },
    {
      field: "price",
      headerName: "قیمت",
      flex: isMobile ? 0 : 1,
      width: isMobile ? 80 : undefined,
      renderCell: (params) => (
        <span className="whitespace-nowrap text-sm">
          {new Intl.NumberFormat('fa-IR').format(params.value)} تومان
        </span>
      ),
    },
    {
      field: "createdAt",
      headerName: isMobile ? "تاریخ" : "تاریخ ایجاد",
      flex: isMobile ? 0 : 1,
      width: isMobile ? 100 : undefined,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <span className="text-sm">
            {new Date(params.value).toLocaleDateString("fa")}
          </span>
        </div>
      ),
    },
    {
      field: "details",
      headerName: isMobile ? "" : "جزئیات",
      flex: 0.5,
      width: isMobile ? 60 : undefined,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <a 
          href={`/cooks/orders/${params.row._id}/show-details`}
          className="flex items-center justify-center p-1 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="مشاهده جزئیات"
        >
          <IoEyeOutline className="w-5 h-5 text-gray-600" />
          {!isMobile && <span className="mr-1 text-sm">مشاهده</span>}
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
    price: order.totalPrice,
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
    },
    faIR
  );

  return (
    <div className="p-2 md:p-4 bg-gray-50 min-h-screen">
      <TitleCard 
        title="" 
        topMargin="mt-2" 
        TopSideButtons={<TopSideButtons />}
        className="shadow-md rounded-lg overflow-hidden border-0"
      >
        <ThemeProvider theme={theme}>
          <Box sx={{ height: 500, width: "100%" }}>
            <Box
              sx={{
                mb: 2,
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              <TextField
                placeholder="جستجو..."
                variant="outlined"
                size="small"
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  width: { xs: "100%", sm: 300 },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#e2e8f0",
                      borderRadius: "8px",
                    },
                    "&:hover fieldset": {
                      borderColor: "#cbd5e0",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#4299e1",
                      borderWidth: "1px",
                    },
                  },
                }}
                inputProps={{
                  style: {
                    textAlign: "right",
                    direction: "rtl",
                  },
                }}
              />
            </Box>

            <Box sx={{ 
              height: 500, 
              width: "100%",
              "& .MuiDataGrid-root": {
                border: "none",
                borderRadius: "8px",
                overflow: "hidden",
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
                    padding: isMobile ? "4px" : "8px 16px",
                    fontSize: isMobile ? "0.75rem" : "0.875rem",
                    borderBottom: "1px solid #e2e8f0",
                  },
                  "& .MuiDataGrid-columnHeaderTitle": {
                    textAlign: "right",
                    justifyContent: "flex-end",
                    width: "100%",
                    fontSize: isMobile ? "0.75rem" : "0.875rem",
                    fontWeight: "600",
                  },
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#f7fafc",
                    borderBottom: "2px solid #e2e8f0",
                  },
                  "& .MuiDataGrid-row": {
                    backgroundColor: "#fff",
                    "&:hover": {
                      backgroundColor: "#f8fafc",
                    },
                    "&:nth-of-type(even)": {
                      backgroundColor: "#fafafa",
                      "&:hover": {
                        backgroundColor: "#f1f5f9",
                      },
                    },
                  },
                  "& .MuiTablePagination-root": {
                    direction: "rtl",
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
                        backgroundColor: "rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      <CircularProgress size={24} />
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
                        gap: 1,
                        color: "text.secondary",
                      }}
                    >
                      <PiNewspaperClipping className="w-12 h-12 opacity-50" />
                      <p>هیچ سفارشی یافت نشد</p>
                    </Box>
                  ),
                }}
                slotProps={{
                  pagination: {
                    labelRowsPerPage: "تعداد ردیف در هر صفحه:",
                    rowsPerPageOptions: isMobile ? [5, 8] : [5, 8, 10, 20],
                    nextIconButton: (
                      <IconButton size="small">
                        <ArrowForwardIos fontSize="small" />
                      </IconButton>
                    ),
                    previousIconButton: (
                      <IconButton size="small">
                        <ArrowBackIos fontSize="small" />
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
          background-color: #f8fafc;
        }
        
        @media (max-width: 600px) {
          :global(.MuiDataGrid-virtualScroller) {
            overflow-x: auto;
          }
          
          :global(.MuiDataGrid-row) {
            min-width: 600px;
          }
        }
      `}</style>
    </div>
  );
};

export default Orders;