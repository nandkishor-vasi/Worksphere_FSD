import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  CircularProgress,
  Chip,
  Paper,
  Button,
  Avatar
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AssignmentIcon from "@mui/icons-material/Assignment"; 
import { useNavigate } from "react-router-dom";


const ProjectList = ({ role = "member", projects: externalProjects }) => {
  const userData = JSON.parse(localStorage.getItem("user")) || {};
  const userId = userData?.id;
  const token = userData?.token;
  const backendBaseUrl = process.env.REACT_APP_BACKEND_BASE_URL;
  const navigate = useNavigate();

  const [projects, setProjects] = useState(externalProjects || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 useEffect(() => {
  if (externalProjects) {
    setProjects(externalProjects);
    setLoading(false);
    return;
  }

  if (!userId || !token) {
    setError("User not logged in");
    setLoading(false);
    return;
  }

  const endpoint =
    role === "admin"
      ? `/api/projects/projectByAdmin/${userId}`
      : `/api/projects/projectByMember/${userId}`;

  axios
    .get(`${backendBaseUrl}${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      setProjects(res.data);
      setLoading(false);
    })
    .catch(() => {
      setError("Failed to load projects.");
      setLoading(false);
    });
}, [userId, token, role, externalProjects, backendBaseUrl]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={250}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" textAlign="center">
        {error}
      </Typography>
    );
  }

 if (!projects || projects.length === 0)
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      mt={8}
      textAlign="center"
    >
      <Avatar
        sx={{
          bgcolor: "#e0e7ff",
          width: 80,
          height: 80,
          mb: 2,
        }}
      >
        <AssignmentIcon sx={{ fontSize: 40, color: "#4f46e5" }} />
      </Avatar>

      <Typography variant="h6" fontWeight={600}>
        No Activities Yet
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        mt={1}
        maxWidth={300}
      >
        You don’t have any assigned projects right now. Once something is
        assigned, it will appear here.
      </Typography>

      <Button
        variant="contained"
        sx={{ mt: 3 }}
        onClick={() => window.location.reload()}
      >
        Refresh
      </Button>
    </Box>
  );

   const columns = [
    {
      field: "title",
      headerName: "Project Title",
      flex: 1,
      minWidth: 180,
      renderCell: (params) => (
        <Typography fontWeight={600}>{params.value || "Untitled"}</Typography>
      ),
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1.5,
      minWidth: 240,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary" noWrap>
          {params.value || "—"}
        </Typography>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.8,
      minWidth: 140,
      renderCell: (params) => (
        <Chip
          label={
            params.value === "IN_PROGRESS"
              ? "In Progress"
              : params.value === "COMPLETED"
              ? "Completed"
              : params.value === "NOT_STARTED"
              ? "Not Started"
              : "Pending"
          }
          color={
            params.value === "COMPLETED"
              ? "success"
              : params.value === "IN_PROGRESS"
              ? "primary"
              : params.value === "NOT_STARTED"
              ? "default"
              : "default"
          }
          size="small"
        />
      ),
    },
    {
      field: "startDate",
      headerName: "Start Date",
      flex: 0.8,
      minWidth: 150,
      renderCell: (params) =>
        params.value ? (
          <Typography variant="body2" color="text.secondary">
            {new Date(params.value).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">
            —
          </Typography>
        ),
    },
    {
      field: "endDate",
      headerName: "End Date",
      flex: 0.8,
      minWidth: 150,
      renderCell: (params) =>
        params.value ? (
          <Typography variant="body2" color="text.secondary">
            {new Date(params.value).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">
            —
          </Typography>
        ),
    },
    {
    field: "activities",
    headerName: "Activities",
    flex: 0.6,
    minWidth: 140,
    renderCell: (params) => (
      <Button
        variant="contained"
        size="small"
        onClick={() =>
          navigate(
            role === "admin"
              ? `/admin/${userData?.id}/activity`
              : `/member/${userData?.id}/activity`,
            { state: { projectId: params.row.id } }
          )
        }
      >
        View
      </Button>
    ),
  },
  ];

  return (
    <Paper
      elevation={4}
      sx={{
        p: 3,
        m: 2,
        borderRadius: 3,
        background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
      }}
    >
      <Typography
        variant="h6"
        fontWeight={700}
        mb={2}
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          ml: 1,
        }}
      >
        {role === "admin" ? "All Projects" : "Assigned Projects"}
      </Typography>

      <Box
        sx={{
          height: 480,
          width: "100%",
          bgcolor: "background.paper",
          borderRadius: 2,
          overflow: "hidden",
          p: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f3f4f6",
            color: "#374151",
            fontWeight: 600,
            borderBottom: "1px solid #e5e7eb",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "1px solid #f1f1f1",
            display: "flex",
            alignItems: "center",
            textAlign: "center",
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "#eef2ff",
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: "#fafafa",
            borderTop: "1px solid #e0e0e0",
          },
        }}
      >
        <DataGrid
          rows={projects.map((proj, idx) => ({ id: proj.id || idx, ...proj }))}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10]}
          disableSelectionOnClick
        />
      </Box>
    </Paper>
  );
};

export default ProjectList;
