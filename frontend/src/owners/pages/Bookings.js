import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import TitleCard from "../components/Cards/TitleCard";
import { setPageTitle } from "../features/common/headerSlice";
import axios from "axios";
import "../components/modal.css";
import { IoEyeOutline } from "react-icons/io5";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { DataGrid } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { faIR } from "@mui/x-data-grid/locales";
import { Box, TextField, IconButton, CircularProgress } from "@mui/material";
import { ArrowForwardIos, ArrowBackIos } from "@mui/icons-material";

import { useOwnerAuthStore } from "../stores/authStore"; 

const TopSideButtons = () => (
  <div className="inline-block">
    <h6>لیست رزرو ها</h6>
  </div>
);

const Bookings = () => {
  const [reservations, setReservations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(8);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  // ✅ We still listen to auth state, in case you want to check authentication
  const isOwnerAuthenticated = useOwnerAuthStore(
    (state) => state.isOwnerAuthenticated
  );

  useEffect(() => {
    dispatch(setPageTitle({ title: "لیست رزروها" }));
  }, [dispatch]);

  useEffect(() => {
    if (!isOwnerAuthenticated) return; // Prevent API call if not logged in

    setLoading(true);

    axios
      .get("/api/owners/reservations", { withCredentials: true }) 
      .then((response) => {
        setReservations(response.data.reservations || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching reservations:", error);
        setLoading(false);
      });
  }, [isOwnerAuthenticated]);

  const columns = [
    { field: "_id", headerName: "کد رزرو", flex: 1 },
    { field: "price", headerName: "قیمت", flex: 1 },
    {
      field: "createdAt",
      headerName: "تاریخ ایجاد",
      flex: 1,
      renderCell: (params) => (
        <span>{new Date(params.value).toLocaleDateString("fa")}</span>
      ),
    },
    {
      field: "isActive",
      headerName: "وضعیت رزرو",
      flex: 1,
      renderCell: (params) =>
        params.value ? (
          <span className="mt-5 bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm">
            فعال
          </span>
        ) : (
          <span className="mt-5 bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm">
            غیرفعال
          </span>
        ),
    },
    {
      field: "details",
      headerName: " جزئیات ",
      flex: 0.5,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <a href={`/owners/bookings/${params.row._id}/update`}>
          <IoEyeOutline className="w-6 h-6 mt-3" />
        </a>
      ),
    },
  ];

  const rows = reservations.map((item) => ({
    id: item._id,
    _id: item._id,
    name: item.name || "—",
    createdAt: item.createdAt || null,
    price: item.price,
    isActive: item.isActive,
    province: item.province,
    city: item.city,
  }));

  const filteredRows = rows.filter((row) =>
    Object.values(row).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const theme = createTheme({ direction: "rtl" }, faIR);

  return (
    <>
      <TitleCard title="" topMargin="mt-2" TopSideButtons={<TopSideButtons />}>
        {reservations.length > 0 ? (
          <ThemeProvider theme={theme}>
            <Box sx={{ height: 500, width: "100%" }}>
              <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-start" }}>
                <TextField
                  placeholder="جستجو..."
                  variant="outlined"
                  size="small"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{
                    width: 300,
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#ccc", border: "0" },
                      "&.Mui-focused fieldset": { border: 0 },
                    },
                  }}
                  inputProps={{
                    style: {
                      textAlign: "right",
                      direction: "rtl",
                      outline: "0",
                      border: "1px solid	#ccc",
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
                }}
              />
            </Box>
          </ThemeProvider>
        ) : (
          <h1>هنوز هیچ رزروی اضافه نشده است.</h1>
        )}
      </TitleCard>
      <ToastContainer />
    </>
  );
};

export default Bookings;
