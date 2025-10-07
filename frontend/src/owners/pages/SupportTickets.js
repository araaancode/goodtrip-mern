import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import TitleCard from "../components/Cards/TitleCard";
import { setPageTitle } from "../features/common/headerSlice";
import axios from "axios";
import "../components/modal.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useOwnerAuthStore } from "../stores/authStore";

// Icons
import {
  PiTicket,
  PiClock,
  PiWarningCircle,
  PiCheckCircle,
  PiXCircle,
  PiEye,
} from "react-icons/pi";

// MUI Components
import { DataGrid } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { faIR } from "@mui/x-data-grid/locales";
import {
  Box,
  TextField,
  IconButton,
  CircularProgress,
  Button,
  useMediaQuery,
} from "@mui/material";
import { ArrowForwardIos, ArrowBackIos } from "@mui/icons-material";

// Configure axios to send credentials
axios.defaults.withCredentials = true;

const TopSideButtons = () => (
  <div className="inline-block">
    <div className="flex items-center gap-3">
  
    </div>
  </div>
);

const SupportTickets = () => {
  const [supportTickets, setSupportTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(8);
  const dispatch = useDispatch();
  const { isOwnerAuthenticated } = useOwnerAuthStore();

  // Responsive
  const isMobile = useMediaQuery("(max-width: 600px)");
  const isTablet = useMediaQuery("(max-width: 960px)");

  useEffect(() => {
    dispatch(setPageTitle({ title: "لیست تیکت ها" }));
  }, [dispatch]);

  useEffect(() => {
    if (!isOwnerAuthenticated) return;

    const fetchTickets = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/owners/support-tickets", {
          withCredentials: true
        });
        setSupportTickets(response.data.tickets || []);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [isOwnerAuthenticated]);

  const columns = [
    {
      field: "_id",
      headerName: "کد تیکت",
      flex: isMobile ? 0 : 1,
      width: isMobile ? 120 : undefined,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 rounded-lg">
            <PiTicket className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-sm font-medium text-gray-900 font-mono truncate">
            {params.value.slice(-8)}
          </span>
        </div>
      ),
    },
    {
      field: "title",
      headerName: isMobile ? "عنوان" : "عنوان تیکت",
      flex: isMobile ? 0 : 1,
      width: isMobile ? 120 : undefined,
      renderCell: (params) => (
        <span className="text-sm text-gray-700 truncate">{params.value}</span>
      ),
    },
    {
      field: "status",
      headerName: isMobile ? "وضعیت" : "وضعیت تیکت",
      flex: isMobile ? 0 : 1,
      width: isMobile ? 100 : undefined,
      renderCell: (params) => {
        const status = params.value;
        let statusConfig = {};
        
        if (status === "Open") {
          statusConfig = {
            text: "باز",
            color: "text-blue-700",
            bg: "bg-blue-50",
            iconColor: "text-blue-600",
            icon: PiClock
          };
        } else if (status === "In Progress") {
          statusConfig = {
            text: "در حال بررسی",
            color: "text-yellow-700",
            bg: "bg-yellow-50",
            iconColor: "text-yellow-600",
            icon: PiWarningCircle
          };
        } else if (status === "Closed") {
          statusConfig = {
            text: "بسته شده",
            color: "text-green-700",
            bg: "bg-green-50",
            iconColor: "text-green-600",
            icon: PiCheckCircle
          };
        } else {
          statusConfig = {
            text: status,
            color: "text-gray-700",
            bg: "bg-gray-50",
            iconColor: "text-gray-600",
            icon: PiXCircle
          };
        }

        const StatusIcon = statusConfig.icon;

        return (
          <div className={`${statusConfig.color} px-3 py-1.5 rounded-lg flex items-center gap-2`}>
            <span className={`${statusConfig.bg} p-1.5 rounded-full`}>
              <StatusIcon className="w-3.5 h-3.5" />
            </span>
            {!isMobile && (
              <span className="text-xs font-medium">{statusConfig.text}</span>
            )}
          </div>
        );
      },
    },
    {
      field: "priority",
      headerName: isMobile ? "اولویت" : "اولویت تیکت",
      flex: isMobile ? 0 : 1,
      width: isMobile ? 100 : undefined,
      renderCell: (params) => {
        const priority = params.value;
        let priorityConfig = {};
        
        if (priority === "Low") {
          priorityConfig = {
            text: "کم",
            color: "text-yellow-700",
            bg: "bg-yellow-50",
          };
        } else if (priority === "Medium") {
          priorityConfig = {
            text: "متوسط",
            color: "text-purple-700",
            bg: "bg-purple-50",
          };
        } else if (priority === "High") {
          priorityConfig = {
            text: "بالا",
            color: "text-red-700",
            bg: "bg-red-50",
          };
        } else {
          priorityConfig = {
            text: priority,
            color: "text-gray-700",
            bg: "bg-gray-50",
          };
        }

        return (
          <div className={`${priorityConfig.color} px-3 py-1.5 rounded-lg flex items-center gap-2`}>
            <span className={`${priorityConfig.bg} p-1.5 rounded-full`}>
              <PiWarningCircle className="w-3.5 h-3.5" />
            </span>
            {!isMobile && (
              <span className="text-xs font-medium">{priorityConfig.text}</span>
            )}
          </div>
        );
      },
    },
    {
      field: "createdAt",
      headerName: isMobile ? "تاریخ" : "تاریخ ایجاد",
      flex: isMobile ? 0 : 1,
      width: isMobile ? 100 : undefined,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-rose-50 rounded-full">
            <PiClock className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <span className="text-sm text-gray-700">
            {new Date(params.value).toLocaleDateString("fa-IR")}
          </span>
        </div>
      ),
    },
    {
      field: "details",
      headerName: isMobile ? "" : "جزئیات",
      flex: 0.5,
      width: isMobile ? 80 : undefined,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <a
          href={`/owners/support-tickets/${params.row._id}`}
          className="flex items-center justify-center p-2 rounded-xl hover:bg-gray-100 transition-colors"
          aria-label="مشاهده جزئیات"
        >
          <div className="flex items-center gap-2">
            {!isMobile && (
              <span className="text-sm font-medium text-gray-700">مشاهده</span>
            )}
          </div>
        </a>
      ),
    },
  ];

  const rows = supportTickets.map((spt) => ({
    id: spt._id,
    _id: spt._id,
    title: spt.title || "—",
    createdAt: spt.createdAt || new Date().toISOString(),
    status: spt.status || "Open",
    priority: spt.priority || "Medium",
    isRead: spt.isRead || false,
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
          main: "#3B82F6",
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
        {!isOwnerAuthenticated ? (
          <div className="text-center py-10">
            <p className="text-red-500">
              لطفا برای مشاهده تیکت‌های خود وارد شوید
            </p>
          </div>
        ) : (
          <>
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
                    placeholder="جستجو در تیکت‌ها ..."
                    variant="outlined"
                    size="small"
                    value={searchQuery}
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
                      },
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

                {supportTickets.length > 0 ? (
                  <Box
                    sx={{
                      height: 500,
                      width: "100%",
                      "& .MuiDataGrid-root": {
                        border: "none",
                        borderRadius: "16px",
                        overflow: "hidden",
                        background: "white",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      },
                    }}
                  >
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
                          background:
                            "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
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
                              <CircularProgress
                                size={32}
                                className="text-blue-500"
                              />
                              <p className="mt-2 text-gray-600">
                                در حال بارگذاری تیکت‌ها...
                              </p>
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
                              <PiTicket className="w-12 h-12 text-gray-400" />
                            </div>
                            <div className="text-center">
                              <p className="text-lg font-semibold text-gray-600">
                                هیچ تیکتی یافت نشد
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                هیچ تیکتی مطابق با جستجوی شما یافت نشد
                              </p>
                            </div>
                          </Box>
                        ),
                      }}
                      slotProps={{
                        pagination: {
                          labelRowsPerPage: "تعداد ردیف در هر صفحه:",
                          rowsPerPageOptions: isMobile
                            ? [5, 8]
                            : [5, 8, 10, 20],
                          nextIconButton: (
                            <IconButton
                              size="small"
                              className="bg-blue-50 hover:bg-blue-100"
                            >
                              <ArrowForwardIos
                                fontSize="small"
                                className="text-blue-600"
                              />
                            </IconButton>
                          ),
                          previousIconButton: (
                            <IconButton
                              size="small"
                              className="bg-blue-50 hover:bg-blue-100"
                            >
                              <ArrowBackIos
                                fontSize="small"
                                className="text-blue-600"
                              />
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
                ) : (
                  !loading && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: 400,
                        flexDirection: "column",
                        gap: 2,
                      }}
                    >
                      <div className="p-6 bg-gray-100 rounded-full">
                        <PiTicket className="w-16 h-16 text-gray-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold text-gray-600">
                          هنوز هیچ تیکتی ایجاد نکرده‌اید
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          برای شروع، تیکت اول خود را ایجاد کنید
                        </p>
                      </div>
                     
                    </Box>
                  )
                )}
              </Box>
            </ThemeProvider>
          </>
        )}
      </TitleCard>
      <ToastContainer
        position="top-right"
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

export default SupportTickets;