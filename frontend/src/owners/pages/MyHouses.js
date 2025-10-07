import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useOwnerAuthStore } from "../stores/authStore";
import TitleCard from "../components/Cards/TitleCard";
import { setPageTitle } from "../features/common/headerSlice";

// Icons
import {
  PiHouse,
  PiMapPin,
  PiCurrencyCircleDollar,
  PiCalendar,
  PiCheckCircle,
  PiXCircle,

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

const MyHouses = () => {
  const { isOwnerAuthenticated } = useOwnerAuthStore();
  const dispatch = useDispatch();

  // State
  const [houses, setHouses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(8);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [refresh, setRefresh] = useState(false);

  // Responsive
  const isMobile = useMediaQuery("(max-width: 600px)");
  const isTablet = useMediaQuery("(max-width: 960px)");

  // Set page title
  useEffect(() => {
    dispatch(setPageTitle({ title: "لیست ملک‌ها" }));
  }, [dispatch]);

  // Fetch houses
  useEffect(() => {
    if (!isOwnerAuthenticated) return;

    const fetchHouses = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/owners/houses", {
          withCredentials: true,
        });
        setHouses(response.data.houses || []);
      } catch (error) {
        console.error("Error fetching houses:", error);
        toast.error("خطا در دریافت لیست ملک‌ها");
      } finally {
        setLoading(false);
      }
    };

    fetchHouses();
  }, [isOwnerAuthenticated, refresh]);

  // Toggle house status
  const toggleStatus = async (id, currentStatus) => {
    try {
      const response = await axios.put(
        `/api/owners/houses/${id}/status`,
        { isActive: !currentStatus },
        { withCredentials: true }
      );

      setHouses(
        houses.map((house) =>
          house._id === id ? { ...house, isActive: !currentStatus } : house
        )
      );
      toast.success(`ملک ${!currentStatus ? "فعال" : "غیرفعال"} شد`);
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error("خطا در تغییر وضعیت ملک");
    }
  };

  // Columns configuration
  const columns = [
    {
      field: "_id",
      headerName: "کد ملک",
      flex: isMobile ? 0 : 1,
      width: isMobile ? 120 : undefined,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 rounded-lg">
            <PiHouse className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-sm font-medium text-gray-900 font-mono truncate">
            {params.value.slice(-8)}
          </span>
        </div>
      ),
    },
    {
      field: "name",
      headerName: isMobile ? "نام" : "نام ملک",
      flex: isMobile ? 0 : 1,
      width: isMobile ? 100 : undefined,
      renderCell: (params) => (
        <span className="text-sm text-gray-700 truncate">{params.value}</span>
      ),
    },
    {
      field: "location",
      headerName: isMobile ? "موقعیت" : "موقعیت مکانی",
      flex: isMobile ? 0 : 1,
      width: isMobile ? 120 : undefined,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-purple-50 rounded-full">
            <PiMapPin className="w-3.5 h-3.5 text-purple-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-700">
              {params.row.city || "—"}
            </span>
            {!isMobile && (
              <span className="text-xs text-gray-500">
                {params.row.province || "—"}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      field: "price",
      headerName: "قیمت",
      flex: isMobile ? 0 : 1,
      width: isMobile ? 120 : undefined,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-50 rounded-full">
            <PiCurrencyCircleDollar className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <span className="whitespace-nowrap text-sm font-bold text-gray-900">
            {params.value
              ? new Intl.NumberFormat("fa-IR").format(params.value) + " تومان"
              : "—"}
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
            {new Date(params.value).toLocaleDateString("fa-IR")}
          </span>
        </div>
      ),
    },
    {
      field: "isActive",
      headerName: isMobile ? "وضعیت" : "وضعیت",
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
      headerName: isMobile ? "" : "عملیات",
      flex: 0.8,
      width: isMobile ? 100 : undefined,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div className="flex gap-2">
          <a
            href={`/owners/houses/${params.row._id}/update`}
            className="flex items-center justify-center p-2 rounded-xl hover:bg-gray-100 transition-colors"
            aria-label="ویرایش"
          >
            {!isMobile && (
              <span className="mr-2 text-sm font-medium text-gray-700">
                ویرایش
              </span>
            )}
          </a>

          <button
            onClick={() => toggleStatus(params.row._id, params.row.isActive)}
            className="flex items-center justify-center p-2 rounded-xl hover:bg-gray-100 transition-colors"
            aria-label={params.row.isActive ? "غیرفعال کردن" : "فعال کردن"}
            disabled={deleteLoading && deleteId === params.row._id}
          ></button>

       
        </div>
      ),
    },
  ];

  // Prepare rows data
  const rows = houses.map((house) => ({
    id: house._id,
    ...house,
    price: house.price || 0,
    isActive: house.isActive || false,
    province: house.province || "—",
    city: house.city || "—",
    location: `${house.city || ""} - ${house.province || ""}`.trim(),
  }));

  // Filter rows based on search query
  const filteredRows = rows.filter((row) =>
    Object.values(row).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
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
              لطفا برای مشاهده ملک‌های خود وارد شوید
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
                    placeholder="جستجو در ملک‌ها ..."
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

                {houses.length > 0 ? (
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
                                در حال بارگذاری ملک‌ها...
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
                              <PiHouse className="w-12 h-12 text-gray-400" />
                            </div>
                            <div className="text-center">
                              <p className="text-lg font-semibold text-gray-600">
                                هیچ ملکی یافت نشد
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                هیچ ملکی مطابق با جستجوی شما یافت نشد
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
                        <PiHouse className="w-16 h-16 text-gray-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold text-gray-600">
                          هنوز هیچ ملکی اضافه نکرده‌اید
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          برای شروع، ملک اول خود را اضافه کنید
                        </p>
                      </div>
                      <Button
                        variant="contained"
                        color="primary"
                        href="/owners/houses/add"
                        className="mt-4 px-6 py-2 rounded-xl"
                        sx={{
                          background:
                            "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
                          boxShadow: "0 4px 6px -1px rgba(59, 130, 246, 0.3)",
                          "&:hover": {
                            background:
                              "linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)",
                            boxShadow: "0 6px 8px -1px rgba(59, 130, 246, 0.4)",
                          },
                        }}
                      >
                        افزودن ملک جدید
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

export default MyHouses;
