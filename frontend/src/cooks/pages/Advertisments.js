import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import TitleCard from "../components/Cards/TitleCard";
import { setPageTitle } from "../features/common/headerSlice";
import { useCookAuthStore } from "../stores/authStore";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { faIR } from "@mui/x-data-grid/locales";
import { Box, TextField, IconButton, CircularProgress } from "@mui/material";
import { ArrowForwardIos, ArrowBackIos } from "@mui/icons-material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoEyeOutline } from "react-icons/io5";
import dayjs from "dayjs";
import "dayjs/locale/fa";

const TopSideButtons = () => (
  <div className="inline-block">
    <h6>لیست آگهی ها</h6>
  </div>
);

const Advertisements = () => {
  const [ads, setAds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(8);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const { isCookAuthenticated } = useCookAuthStore();

  useEffect(() => {
    dispatch(setPageTitle({ title: "لیست آگهی ها" }));
  }, []);

  useEffect(() => {
    if (!isCookAuthenticated) return;

    setLoading(true);
    axios
      .get("/api/cooks/ads", {
        withCredentials: true, // Using cookies instead of Bearer token
      })
      .then((response) => {
        setAds(response.data.ads);
        setLoading(false);
      })
      .catch((error) => {
        console.log("error ", error);
        setLoading(false);
      });
  }, [isCookAuthenticated]); // Add isCookAuthenticated as dependency

  const columns = [
    {
      field: "_id",
      headerName: "کد آگهی",
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <span>{params.value}</span>
        </div>
      ),
    },
    {
      field: "title",
      headerName: "عنوان آگهی",
      flex: 1,
    },
    {
      field: "price",
      headerName: "قیمت",
      flex: 1,
      renderCell: (params) => (
        <div>
          {params.value ? params.value.toLocaleString() + " ریال" : "—"}
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
      field: "details",
      headerName: "جزئیات",
      flex: 0.5,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <a href={`/cooks/advertisements/${params.row._id}/update`}>
          <IoEyeOutline className="w-6 h-6 mt-3" />
        </a>
      ),
    },
  ];

  const rows = ads.map((item) => ({
    id: item._id,
    _id: item._id,
    title: item.title || "—",
    createdAt: item.createdAt || null,
    price: item.price || null,
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
    },
    faIR
  );

  return (
    <>
      <TitleCard title="" topMargin="mt-2" TopSideButtons={<TopSideButtons />}>
        {ads.length > 0 ? (
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
                  loadingOverlay: () => (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                      }}
                    >
                      <CircularProgress />
                    </Box>
                  ),
                  noRowsOverlay: () => (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                      }}
                    >
                      <CircularProgress />
                    </Box>
                  ),
                }}
                slotProps={{
                  pagination: {
                    labelRowsPerPage: "تعداد ردیف در هر صفحه:",
                    nextIconButton: (
                      <IconButton>
                        <ArrowForwardIos />
                      </IconButton>
                    ),
                    previousIconButton: (
                      <IconButton>
                        <ArrowBackIos />
                      </IconButton>
                    ),
                  },
                }}
                localeText={{
                  ...faIR.components.MuiDataGrid.defaultProps.localeText,
                  footerPaginationDisplayedRows: (from, to, count) =>
                    `${from}–${to} از ${count}`,
                }}
                sx={{
                  direction: "rtl",
                  fontFamily: "IRANSans, Tahoma, sans-serif",
                  textAlign: "right",
                  "& .MuiDataGrid-cell": {
                    textAlign: "right",
                    justifyContent: "flex-end",
                  },
                  "& .MuiDataGrid-columnHeaderTitle": {
                    textAlign: "right",
                    justifyContent: "flex-end",
                    width: "100%",
                  },
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#fff",
                    fontWeight: "bold",
                  },
                  "& .MuiDataGrid-row": {
                    backgroundColor: "#fff",
                  },
                  "& .MuiDataGrid-row:hover": {
                    backgroundColor: "#fff",
                  },
                  "& .MuiTablePagination-root": {
                    direction: "rtl",
                  },
                  "& .MuiTablePagination-actions": {
                    direction: "rtl",
                  },
                }}
              />
            </Box>
          </ThemeProvider>
        ) : (
          <div className="text-center py-8">
            <h1 className="text-lg text-gray-600">
              {loading ? "در حال بارگذاری..." : "هنوز هیچ آگهی اضافه نشده است."}
            </h1>
          </div>
        )}
      </TitleCard>
      <ToastContainer rtl position="top-center" />
    </>
  );
};

export default Advertisements;
