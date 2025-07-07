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
import { Box, TextField } from "@mui/material";
import { IconButton } from "@mui/material";
import { ArrowForwardIos, ArrowBackIos } from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";

import "dayjs/locale/fa";

const TopSideButtons = () => (
  <div className="inline-block">
    <h6>لیست تیکت ها</h6>
  </div>
);

const SupportTickets = () => {
  const [supportTickets, setSupportTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(8);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "لیست تیکت ها" }));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const AuthStr = "Bearer ".concat(token);

    setLoading(true);
    axios
      .get("/api/owners/support-tickets", {
        headers: { authorization: AuthStr },
      })
      .then((response) => {
        setSupportTickets(response.data.tickets);
        setLoading(false);
      })
      .catch((error) => {
        console.log("error " + error);
        setLoading(false);
      });
  }, []);

  const columns = [
    {
      field: "_id",
      headerName: "کد تیکت",
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <span>{params.value}</span>
        </div>
      ),
    },
    {
      field: "title",
      headerName: "عنوان تیکت",
      flex: 1,
    },
    {
      field: "status",
      headerName: "وضعیت تیکت",
      flex: 1,
      renderCell: (params) => {
        const status = params.value;
        if (status === "Open")
          return (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-blue-900 dark:text-blue-300">
              باز
            </span>
          );
        if (status === "In Progress")
          return (
            <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-green-900 dark:text-green-300">
              بسته شده
            </span>
          );
        if (status === "Closed")
          return (
            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-yellow-900 dark:text-yellow-300">
              در حال بررسی
            </span>
          );
        return <div className="badge">{status}</div>;
      },
    },
    {
      field: "priority",
      headerName: "اولویت تیکت",
      flex: 1,
      renderCell: (params) => {
        const status = params.value;
        if (status === "Low")
          return (
            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-yellow-900 dark:text-yellow-300">
              کم
            </span>
          );
        if (status === "Medium")
          return (
            <span className="bg-purple-100 text-purple-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-purple-900 dark:text-purple-300">
              متوسط
            </span>
          );
        if (status === "High")
          return (
            <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-red-900 dark:text-red-300">
              بالا
            </span>
          );
        return <div className="badge">{status}</div>;
      },
    },
    // {
    //   field: "isRead",
    //   headerName: "خوانده شده/نشده",
    //   flex: 1,
    //   renderCell: (params) => (
    //     <div className="flex items-center gap-2">
    //       {params.value.isRead ? (
    //         <span className="mt-5 bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-green-900 dark:text-green-300">
    //           خوانده شده
    //         </span>
    //       ) : (
    //         <span className="mt-5 bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-red-900 dark:text-red-300">
    //           خوانده نشده
    //         </span>
    //       )}
    //     </div>
    //   ),
    // },
    {
      field: "createdAt",
      headerName: "تاریخ ایجاد",
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <span>{new Date(params.value).toLocaleDateString("fa")}</span>
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
        <a href={`/owners/support-tickets/${params.row._id}`}>
          <IoEyeOutline className="w-6 h-6 mt-3" />
        </a>
      ),
    },
  ];

  const rows = supportTickets.map((spt) => ({
    id: spt._id,
    _id: spt._id,
    title: spt.title || "—",
    createdAt: spt.createdAt || null,
    status: spt.status || null,
    priority: spt.priority || "—",
    isRead: spt.isRead || "—",
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
        {supportTickets.length > 0 ? (
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
                loading={loading} // Enable MUI DataGrid's built-in loading state
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
                  "& .MuiTablePagination-actions button svg": {
                    // transform: "rotate(180deg)", // Flip left/right arrows
                  },
                  "& .MuiTablePagination-root .css-1hr2sou-MuiTablePagination-root":
                    {
                      display: "none",
                      hidden: true,
                    },
                }}
              />
            </Box>
          </ThemeProvider>
        ) : (
          <h1>هنوز هیچ تیکت پشتیبانی اضافه نشده است.</h1>
        )}
      </TitleCard>
      <ToastContainer />
    </>
  );
};

export default SupportTickets;
