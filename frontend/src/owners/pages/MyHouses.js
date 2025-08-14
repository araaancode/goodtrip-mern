import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useOwnerAuthStore } from "../stores/authStore";
import TitleCard from "../components/Cards/TitleCard";
import { setPageTitle } from "../features/common/headerSlice";

// Icons
import { PiHouseLight } from "react-icons/pi";
import { IoEyeOutline } from "react-icons/io5";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { FaSearch } from "react-icons/fa";

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
} from "@mui/material";
import { ArrowForwardIos, ArrowBackIos } from "@mui/icons-material";

// Configure axios to send credentials
axios.defaults.withCredentials = true;

const TopSideButtons = () => (
  <div className="inline-block">
    <h6>لیست ملک ها</h6>
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

  // Set page title
  useEffect(() => {
    dispatch(setPageTitle({ title: "لیست ملک ها" }));
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
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <span>{params.value}</span>
        </div>
      ),
    },
    {
      field: "name",
      headerName: "نام ملک",
      flex: 1,
    },
    {
      field: "province",
      headerName: "استان",
      flex: 1,
    },
    {
      field: "city",
      headerName: "شهر",
      flex: 1,
    },
    {
      field: "price",
      headerName: "قیمت",
      flex: 1,
      renderCell: (params) => (
        <span>
          {params.value ? params.value.toLocaleString() + " تومان" : "—"}
        </span>
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
        <Button
          variant="outlined"
          size="small"
          color={params.value ? "success" : "error"}
          disabled={deleteLoading && deleteId === params.row._id}
        >
          {params.value ? "فعال" : "غیرفعال"}
        </Button>
      ),
    },
    {
      field: "actions",
      headerName: "عملیات",
      flex: 1.5,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div className="flex gap-3">
          <Button
            variant="outlined"
            color="primary"
            size="small"
            href={`/owners/houses/${params.row._id}/update`}
            startIcon={<FiEdit />}
          >
            ویرایش
          </Button>
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
      palette: {
        mode: "light",
      },
    },
    faIR
  );

  return (
    <>
      <TitleCard title="" topMargin="mt-2" TopSideButtons={<TopSideButtons />}>
        {!isOwnerAuthenticated ? (
          <div className="text-center py-10">
            <p className="text-red-500">
              لطفاً برای مشاهده ملک‌های خود وارد شوید
            </p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <Box sx={{ width: 300 }}>
                <TextField
                  fullWidth
                  placeholder="جستجو..."
                  variant="outlined"
                  size="small"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: <FaSearch className="ml-2 text-gray-400" />,
                  }}
                />
              </Box>
              <Button
                variant="contained"
                color="primary"
                href="/owners/houses/add"
              >
                افزودن ملک جدید
              </Button>
            </div>

            {houses.length > 0 ? (
              <ThemeProvider theme={theme}>
                <Box sx={{ height: 500, width: "100%" }}>
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
                            flexDirection: "column",
                            gap: 1,
                          }}
                        >
                          <PiHouseLight className="w-10 h-10 text-gray-400" />
                          <p>هیچ ملکی یافت نشد</p>
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
                      fontFamily: "IRANSans, Tahoma, sans-serif",
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
                        backgroundColor: "#f8fafc",
                        fontWeight: "bold",
                      },
                      "& .MuiDataGrid-row": {
                        backgroundColor: "#fff",
                        "&:hover": {
                          backgroundColor: "#f8fafc",
                        },
                      },
                    }}
                  />
                </Box>
              </ThemeProvider>
            ) : (
              <div className="text-center py-10">
                <PiHouseLight className="w-16 h-16 mx-auto text-gray-400" />
                <p className="mt-4 text-gray-600">
                  هنوز هیچ ملکی اضافه نکرده‌اید
                </p>
                <Button
                  variant="contained"
                  color="primary"
                  href="/owners/houses/add"
                  className="mt-4"
                >
                  افزودن ملک جدید
                </Button>
              </div>
            )}
          </>
        )}
      </TitleCard>
      <ToastContainer position="top-right" rtl />
    </>
  );
};

export default MyHouses;
