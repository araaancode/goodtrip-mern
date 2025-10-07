import { useEffect, useState } from "react";
import { useOwnerAuthStore } from "../stores/authStore";
import TitleCard from "../components/Cards/TitleCard";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

// Icons
import {
  PiMegaphone,
  PiCurrencyCircleDollar,
  PiCalendar,
  PiCheckCircle,
  PiXCircle,
  PiEye,
  PiBuildings,
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

// Configure axios to always send credentials
axios.defaults.withCredentials = true;

const TopSideButtons = () => (
  <div className="inline-block">
    <div className="flex items-center gap-3">
      {/* You can add buttons here if needed */}
    </div>
  </div>
);

const Advertisments = () => {
  const { isOwnerAuthenticated, checkAuthOwner } = useOwnerAuthStore();
  const [ads, setAds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(8);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Responsive
  const isMobile = useMediaQuery("(max-width: 600px)");
  const isTablet = useMediaQuery("(max-width: 960px)");

  const fetchAds = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!isOwnerAuthenticated) {
        await checkAuthOwner();
        if (!isOwnerAuthenticated) {
          throw new Error("لطفا ابتدا وارد شوید");
        }
      }

      const response = await axios.get("/api/owners/ads");
      
      if (response.data.status === "success") {
        // Process data to unified structure
        const processedAds = response.data.ads.map(ad => ({
          ...ad,
          id: ad._id,
          ownerName: ad.owner?.name || "نامشخص",
          companyName: ad.company?.name || "شرکت نامشخص",
          formattedPrice: ad.price ? `${ad.price.toLocaleString('fa-IR')} تومان` : "قیمت نامشخص",
          formattedDate: ad.createdAt ? new Date(ad.createdAt).toLocaleDateString('fa-IR') : "تاریخ نامشخص",
          isActive: ad.isActive || false
        }));

        setAds(processedAds);
      } else {
        throw new Error(response.data.msg || "خطا در دریافت آگهی‌ها");
      }
    } catch (error) {
      console.error("خطا در دریافت آگهی‌ها:", error);
      setError(error.response?.data?.msg || error.message);
      toast.error(error.response?.data?.msg || "خطا در بارگذاری آگهی‌ها");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, [isOwnerAuthenticated]);

  // Columns configuration
  const columns = [
    {
      field: "_id",
      headerName: "کد آگهی",
      flex: isMobile ? 0 : 1,
      width: isMobile ? 120 : undefined,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-50 rounded-lg">
            <PiMegaphone className="w-4 h-4 text-purple-600" />
          </div>
          <span className="text-sm font-medium text-gray-900 font-mono truncate">
            {params.value.slice(-8)}
          </span>
        </div>
      ),
    },
    {
      field: "title",
      headerName: isMobile ? "عنوان" : "عنوان آگهی",
      flex: isMobile ? 0 : 1,
      width: isMobile ? 120 : undefined,
      renderCell: (params) => (
        <span className="text-sm text-gray-700 truncate">{params.value || "—"}</span>
      ),
    },
    {
      field: "companyName",
      headerName: isMobile ? "شرکت" : "نام شرکت",
      flex: isMobile ? 0 : 1,
      width: isMobile ? 100 : undefined,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 rounded-full">
            <PiBuildings className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <span className="text-sm text-gray-700 truncate">{params.value}</span>
        </div>
      ),
    },
    {
      field: "formattedPrice",
      headerName: "قیمت",
      flex: isMobile ? 0 : 1,
      width: isMobile ? 120 : undefined,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-50 rounded-full">
            <PiCurrencyCircleDollar className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <span className="whitespace-nowrap text-sm font-bold text-gray-900">
            {params.value}
          </span>
        </div>
      ),
    },
    {
      field: "formattedDate",
      headerName: isMobile ? "تاریخ" : "تاریخ ایجاد",
      flex: isMobile ? 0 : 1,
      width: isMobile ? 100 : undefined,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-rose-50 rounded-full">
            <PiCalendar className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <span className="text-sm text-gray-700">
            {params.value}
          </span>
        </div>
      ),
    },
    {
      field: "isActive",
      headerName: isMobile ? "وضعیت" : "وضعیت آگهی",
      flex: isMobile ? 0 : 1,
      width: isMobile ? 90 : undefined,
      renderCell: (params) => {
        const statusConfig = params.value
          ? {
              text: "فعال",
              color: "text-green-700",
              bg: "bg-green-50",
              iconColor: "text-green-600",
            }
          : {
              text: "غیرفعال",
              color: "text-red-700",
              bg: "bg-red-50",
              iconColor: "text-red-600",
            };

        return (
          <div
            className={`${statusConfig.color} px-3 py-1.5 rounded-lg flex items-center gap-2`}
          >
            <span className={`${statusConfig.bg} p-1.5 rounded-full`}>
              {params.value ? (
                <PiCheckCircle className="w-3.5 h-3.5" />
              ) : (
                <PiXCircle className="w-3.5 h-3.5" />
              )}
            </span>
            {!isMobile && (
              <span className="text-xs font-medium">{statusConfig.text}</span>
            )}
          </div>
        );
      },
    },
    {
      field: "actions",
      headerName: isMobile ? "" : "جزئیات",
      flex: 0.5,
      width: isMobile ? 80 : undefined,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <a
          href={`/owners/advertisments/${params.row._id}/update`}
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

  // Prepare rows data
  const rows = ads.map(ad => ({
    id: ad._id,
    _id: ad._id,
    title: ad.title || "—",
    companyName: ad.companyName,
    formattedPrice: ad.formattedPrice,
    formattedDate: ad.formattedDate,
    isActive: ad.isActive || false,
    price: ad.price || 0,
  }));

  // Filter rows based on search query
  const filteredRows = rows.filter(ad => 
    Object.values({
      _id: ad._id,
      title: ad.title,
      companyName: ad.companyName,
      formattedPrice: ad.formattedPrice,
      formattedDate: ad.formattedDate,
    }).some(
      value => value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Create MUI theme with RTL support
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
              لطفا برای مشاهده آگهی‌ها وارد شوید
            </p>
          </div>
        ) : error ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: 300,
            flexDirection: 'column',
            gap: 2
          }}>
            <div className="p-4 bg-red-50 rounded-full">
              <PiMegaphone className="w-12 h-12 text-red-400" />
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-red-600">
                خطا در بارگذاری آگهی‌ها
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {error}
              </p>
            </div>
            <Button
              variant="contained"
              color="primary"
              onClick={fetchAds}
              className="mt-4 px-6 py-2 rounded-xl"
              sx={{
                background: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
                boxShadow: "0 4px 6px -1px rgba(59, 130, 246, 0.3)",
                "&:hover": {
                  background: "linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)",
                  boxShadow: "0 6px 8px -1px rgba(59, 130, 246, 0.4)",
                },
              }}
            >
              تلاش مجدد
            </Button>
          </Box>
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
                    placeholder="جستجو در آگهی‌ها ..."
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

                {ads.length > 0 ? (
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
                                در حال بارگذاری آگهی‌ها...
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
                              <PiMegaphone className="w-12 h-12 text-gray-400" />
                            </div>
                            <div className="text-center">
                              <p className="text-lg font-semibold text-gray-600">
                                هیچ آگهی یافت نشد
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                هیچ آگهی مطابق با جستجوی شما یافت نشد
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
                        <PiMegaphone className="w-16 h-16 text-gray-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold text-gray-600">
                          هنوز هیچ آگهی اضافه نکرده‌اید
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          برای شروع، آگهی اول خود را اضافه کنید
                        </p>
                      </div>
                      <Button
                        variant="contained"
                        color="primary"
                        href="/owners/advertisments/add"
                        className="mt-4 px-6 py-2 rounded-xl"
                        sx={{
                          background: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
                          boxShadow: "0 4px 6px -1px rgba(59, 130, 246, 0.3)",
                          "&:hover": {
                            background: "linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)",
                            boxShadow: "0 6px 8px -1px rgba(59, 130, 246, 0.4)",
                          },
                        }}
                      >
                        افزودن آگهی جدید
                      </Button>
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

export default Advertisments;