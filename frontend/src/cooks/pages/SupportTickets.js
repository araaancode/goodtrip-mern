import { useEffect, useState } from "react";
import { useCookAuthStore } from '../stores/authStore'; 
import TitleCard from "../components/Cards/TitleCard";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoEyeOutline } from "react-icons/io5";
import { DataGrid } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { faIR } from "@mui/x-data-grid/locales";
import { Box, TextField, IconButton, CircularProgress } from "@mui/material";
import { ArrowForwardIos, ArrowBackIos } from "@mui/icons-material";

const TopSideButtons = () => (
  <div className="inline-block">
    <h6>لیست تیکت ها</h6>
  </div>
);

const SupportTickets = () => {
  const { isCookAuthenticated, cook } = useCookAuthStore();
  const [supportTickets, setSupportTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(8);

  useEffect(() => {
    const fetchSupportTickets = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/cooks/support-tickets", {
          withCredentials: true
        });
        setSupportTickets(response.data.supportTickets);
      } catch (error) {
        console.error("Error fetching support tickets:", error);
        toast.error("خطا در دریافت لیست تیکت‌ها");
      } finally {
        setLoading(false);
      }
    };

    if (isCookAuthenticated) {
      fetchSupportTickets();
    }
  }, [isCookAuthenticated]);

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
        if (status === "Open") {
          return (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm">
              باز
            </span>
          );
        }
        if (status === "Closed") {
          return (
            <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm">
              بسته شده
            </span>
          );
        }
        if (status === "In Progress") {
          return (
            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm">
              در حال بررسی
            </span>
          );
        }
        return <span>{status}</span>;
      },
    },
    {
      field: "priority",
      headerName: "اولویت تیکت",
      flex: 1,
      renderCell: (params) => {
        const priority = params.value;
        if (priority === "Low") {
          return (
            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm">
              کم
            </span>
          );
        }
        if (priority === "Medium") {
          return (
            <span className="bg-purple-100 text-purple-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm">
              متوسط
            </span>
          );
        }
        if (priority === "High") {
          return (
            <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm">
              بالا
            </span>
          );
        }
        return <span>{priority}</span>;
      },
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
        <a href={`/cooks/support-tickets/${params.row._id}`}>
          <IoEyeOutline className="w-6 h-6 mt-3" />
        </a>
      ),
    },
  ];

  const rows = supportTickets.map((ticket) => ({
    id: ticket._id,
    ...ticket
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
        mode: "light",
      },
    },
    faIR
  );

  return (
    <>
      <TitleCard title="" topMargin="mt-2" TopSideButtons={<TopSideButtons />}>
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
              loading={loading}
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
              localeText={{
                ...faIR.components.MuiDataGrid.defaultProps.localeText,
                footerPaginationDisplayedRows: ({ from, to, count }) =>
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
              }}
              slots={{
                pagination: () => (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      p: 1,
                    }}
                  >
                    <IconButton
                      onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                      disabled={page === 0}
                    >
                      <ArrowBackIos />
                    </IconButton>
                    <span>
                      صفحه {page + 1} از {Math.ceil(filteredRows.length / pageSize)}
                    </span>
                    <IconButton
                      onClick={() =>
                        setPage((prev) =>
                          (prev + 1) * pageSize < filteredRows.length
                            ? prev + 1
                            : prev
                        )
                      }
                      disabled={(page + 1) * pageSize >= filteredRows.length}
                    >
                      <ArrowForwardIos />
                    </IconButton>
                  </Box>
                ),
                noRowsOverlay: () => (
                  <Box
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {loading ? (
                      <CircularProgress />
                    ) : (
                      "هیچ تیکتی یافت نشد"
                    )}
                  </Box>
                ),
                loadingOverlay: CircularProgress,
              }}
            />
          </Box>
        </ThemeProvider>
      </TitleCard>
      <ToastContainer rtl position="top-right" />
    </>
  );
};

export default SupportTickets;