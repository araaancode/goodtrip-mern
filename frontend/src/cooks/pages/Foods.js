import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import TitleCard from "../components/Cards/TitleCard";
import { setPageTitle } from "../features/common/headerSlice";
import { useCookAuthStore } from "../stores/authStore";
import { toast,ToastContainer } from "react-toastify";
import { PiNewspaperClipping } from "react-icons/pi";
import { IoEyeOutline } from "react-icons/io5";

import { DataGrid } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { faIR } from "@mui/x-data-grid/locales";
import { Box, TextField } from "@mui/material";
import { IconButton } from "@mui/material";
import { ArrowForwardIos, ArrowBackIos } from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios"

const TopSideButtons = () => (
  <div className="inline-block">
    <h6>لیست غذا‌ها</h6>
  </div>
);

const Foods = () => {
  const { token } = useCookAuthStore();
  const [foods, setFoods] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(8);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "لیست غذا‌ها" }));
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get("/api/cooks/foods", {
        headers: { authorization: `Bearer ${token}` },
      });
      
      setFoods(response.data.foods);
    } catch (error) {
      const errorMessage = error.response?.data?.msg || "خطا در دریافت لیست غذاها";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      field: "_id",
      headerName: "کد غذا",
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <span>{params.value}</span>
        </div>
      ),
    },
    {
      field: "name",
      headerName: "نام غذا",
      flex: 1,
    },
    {
      field: "category",
      headerName: "نوع غذا",
      flex: 1,
      renderCell: (params) => {
        const categoryMap = {
          "پیش غذا": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
          "غذای اصلی": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
          "دسر و نوشیدنی": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
          "ایتالیایی": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
          "ایرانی": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
          "ساندویچ": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
          "فست فود": "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
          "سوپ": "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
          "آش": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
        };

        return (
          <span className={`${categoryMap[params.value] || 'bg-gray-100 text-gray-800'} text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm`}>
            {params.value}
          </span>
        );
      },
    },
    {
      field: "price",
      headerName: "قیمت",
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <span>{params.value.toLocaleString()} تومان</span>
        </div>
      ),
    },
    {
      field: "createdAt",
      headerName: "تاریخ ایجاد",
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <span>{new Date(params.value).toLocaleDateString("fa-IR")}</span>
        </div>
      ),
    },
    {
      field: "isActive",
      headerName: "وضعیت",
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <span className={`mt-5 ${params.value ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'} text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm`}>
            {params.value ? "فعال" : "غیرفعال"}
          </span>
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "عملیات",
      flex: 0.5,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div className="flex gap-2">
          <a 
            href={`/cooks/foods/${params.row._id}/update`}
            className="text-blue-600 hover:text-blue-800"
            title="مشاهده و ویرایش"
          >
            <IoEyeOutline className="w-6 h-6 mt-3" />
          </a>
        </div>
      ),
    },
  ];

  const rows = foods.map((item) => ({
    id: item._id,
    ...item,
    price: item.price || 0,
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
      palette: {
        mode: 'light',
      },
    },
    faIR
  );

  return (
    <>
      <TitleCard title="" topMargin="mt-2" TopSideButtons={<TopSideButtons />}>
        {error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : foods.length > 0 ? (
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
                  placeholder="جستجو در نام غذا، نوع غذا، قیمت..."
                  variant="outlined"
                  size="small"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{
                    width: 300,
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#ccc",
                        border: "0",
                      },
                      "&.Mui-focused fieldset": {
                        border: 0,
                      },
                    },
                  }}
                  inputProps={{
                    style: {
                      textAlign: "right",
                      direction: "rtl",
                      outline: "0",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                    },
                  }}
                />
              </Box>

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
                slots={{
                  loadingOverlay: CircularProgress,
                  noRowsOverlay: () => (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        fontFamily: "IRANSans",
                      }}
                    >
                      {loading ? <CircularProgress /> : "داده‌ای برای نمایش وجود ندارد"}
                    </Box>
                  ),
                }}
                slotProps={{
                  pagination: {
                    labelRowsPerPage: "تعداد ردیف در هر صفحه:",
                    nextIconButton: {
                      children: <ArrowForwardIos fontSize="small" />,
                    },
                    previousIconButton: {
                      children: <ArrowBackIos fontSize="small" />,
                    },
                  },
                }}
                localeText={{
                  ...faIR.components.MuiDataGrid.defaultProps.localeText,
                  footerPaginationDisplayedRows: ({ from, to, count }) =>
                    `${from}–${to} از ${count}`,
                  noRowsLabel: "داده‌ای برای نمایش وجود ندارد",
                }}
                sx={{
                  direction: "rtl",
                  fontFamily: "IRANSans, Tahoma, sans-serif",
                  "& .MuiDataGrid-cell": {
                    textAlign: "right",
                    justifyContent: "flex-end",
                  },
                  "& .MuiDataGrid-columnHeaderTitle": {
                    textAlign: "right",
                    fontWeight: "bold",
                  },
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#f8fafc",
                  },
                  "& .MuiDataGrid-row:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                  },
                  "& .MuiDataGrid-footerContainer": {
                    direction: "rtl",
                  },
                }}
              />
            </Box>
          </ThemeProvider>
        ) : (
          !loading && (
            <div className="text-center py-8">
              <PiNewspaperClipping className="w-12 h-12 mx-auto text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                هنوز هیچ غذایی اضافه نشده است
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                برای اضافه کردن غذا جدید، از منوی غذاها اقدام کنید
              </p>
            </div>
          )
        )}
      </TitleCard>
      <ToastContainer />
    </>
  );
};

export default Foods;