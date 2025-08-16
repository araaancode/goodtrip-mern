import { useEffect, useState } from "react";
import { useOwnerAuthStore } from "../stores/authStore";
import TitleCard from "../components/Cards/TitleCard";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoEyeOutline } from "react-icons/io5";
import axios from "axios";

import { DataGrid } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { faIR } from "@mui/x-data-grid/locales";
import { Box, TextField, CircularProgress, Typography } from "@mui/material";

// Configure axios to always send credentials
axios.defaults.withCredentials = true;

const Advertisments = () => {
  const { isOwnerAuthenticated, checkAuthOwner } = useOwnerAuthStore();
  const [ads, setAds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 8,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAds = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!isOwnerAuthenticated) {
        await checkAuthOwner();
        if (!isOwnerAuthenticated) {
          throw new Error("لطفاً ابتدا وارد شوید");
        }
      }

      const response = await axios.get("/api/owners/ads");
      
      if (response.data.status === "success") {
        // تبدیل داده‌ها به ساختار یکسان
        const processedAds = response.data.ads.map(ad => ({
          ...ad,
          id: ad._id,
          ownerName: ad.owner?.name || "نامشخص",
          companyName: ad.company?.name || "شرکت نامشخص",
          formattedPrice: ad.price ? `${ad.price.toLocaleString('fa-IR')} تومان` : "قیمت نامشخص",
          formattedDate: ad.createdAt ? new Date(ad.createdAt).toLocaleDateString('fa-IR') : "تاریخ نامشخص"
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

  const columns = [
    {
      field: "_id",
      headerName: "شناسه آگهی",
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" noWrap>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "title",
      headerName: "عنوان آگهی",
      flex: 1,
      renderCell: (params) => params.value || "—"
    },
    {
      field: "companyName",
      headerName: "نام شرکت",
      flex: 1,
    },
    {
      field: "formattedPrice",
      headerName: "قیمت",
      flex: 1,
    },
    {
      field: "formattedDate",
      headerName: "تاریخ ایجاد",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "جزئیات",
      flex: 0.5,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <a href={`/owners/advertisments/${params.row._id}/update`}>
          <IoEyeOutline className="w-6 h-6" title="مشاهده جزئیات" />
        </a>
      ),
    },
  ];

  const filteredRows = ads.filter(ad => 
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

  const theme = createTheme({ 
    direction: "rtl",
    typography: {
      fontFamily: "'IRANSans', 'Tahoma', sans-serif",
    }
  }, faIR);

  return (
    <TitleCard title="لیست آگهی‌های شما" topMargin="mt-2">
      <ThemeProvider theme={theme}>
        <Box sx={{ height: 500, width: "100%" }}>
          <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-start" }}>
            <TextField
              placeholder="جستجو..."
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                width: 300,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#ccc" },
                  "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
                },
              }}
              InputProps={{
                sx: { 
                  borderRadius: "8px",
                  "& input": { 
                    textAlign: "right",
                    fontFamily: "'IRANSans', 'Tahoma', sans-serif"
                  }
                }
              }}
            />
          </Box>

          {error ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: 300,
              color: 'error.main'
            }}>
              <Typography fontFamily="'IRANSans', 'Tahoma', sans-serif">
                {error}
              </Typography>
            </Box>
          ) : (
            <DataGrid
              rows={filteredRows}
              columns={columns}
              pagination
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[5, 8, 10, 20]}
              disableRowSelectionOnClick
              loading={loading}
              localeText={{
                ...faIR.components.MuiDataGrid.defaultProps.localeText,
                footerPaginationDisplayedRows: ({ from, to, count }) =>
                  `${from}–${to} از ${count}`,
                noRowsLabel: "داده‌ای موجود نیست",
                columnMenuLabel: "منو",
                columnMenuShowColumns: "نمایش ستون‌ها",
                columnMenuFilter: "فیلتر",
                columnMenuHideColumn: "مخفی کردن",
                columnMenuUnsort: "عدم مرتب‌سازی",
                columnMenuSortAsc: "مرتب‌سازی صعودی",
                columnMenuSortDesc: "مرتب‌سازی نزولی",
              }}
              sx={{
                "& .MuiDataGrid-cell": {
                  textAlign: "right",
                  justifyContent: "flex-end",
                  fontFamily: "'IRANSans', 'Tahoma', sans-serif"
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                  fontWeight: "bold",
                  fontFamily: "'IRANSans', 'Tahoma', sans-serif"
                },
                "& .MuiDataGrid-footerContainer": {
                  direction: "rtl"
                }
              }}
            />
          )}
        </Box>
      </ThemeProvider>
    </TitleCard>
  );
};

export default Advertisments;