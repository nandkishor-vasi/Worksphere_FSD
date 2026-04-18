import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const ProjectTimeline = ({ projectId }) => {
  const [timeline, setTimeline] = useState(null);
  const [loading, setLoading] = useState(true);
  const backendBaseUrl = process.env.REACT_APP_BACKEND_BASE_URL;
  const userData = useAuth();
  const token = userData?.user?.token;

  useEffect(() => {
    if (projectId) {
      axios
        .get(`${backendBaseUrl}/api/analytics/projects/${projectId}/timeline`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => setTimeline(res.data))
        .catch((err) => console.error("Failed:", err))
        .finally(() => setLoading(false));
    }
  }, [projectId, backendBaseUrl, token]);

  return (
    <div style={styles.wrapper}>
      
      {/* Header */}
      <div style={styles.header}>
        Project Timeline
        <span style={styles.subId}>#{projectId}</span>
      </div>

      {/* Loading */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
          <CircularProgress size={26} />
        </Box>
      ) : !timeline ? (
        <div style={styles.empty}>No timeline data available</div>
      ) : (
        <div style={styles.grid}>

          <Stat label="Title" value={timeline.title} />
          <Stat label="Start Date" value={formatDate(timeline.start_date)} />
          <Stat label="End Date" value={formatDate(timeline.end_date)} />
          <Stat label="Created" value={formatDateTime(timeline.created_at)} />
          <Stat label="Duration" value={`${timeline.duration_days} days`} />
          
          <Stat
            label="Status"
            value={formatStatus(timeline.status)}
            highlight
            status={timeline.status}
          />

        </div>
      )}
    </div>
  );
};

/* Small reusable stat */
const Stat = ({ label, value, highlight, status }) => {
  return (
    <div style={styles.card}>
      <div style={styles.label}>{label}</div>

      <div
        style={{
          ...styles.value,
          ...(highlight && getStatusStyle(status)),
        }}
      >
        {value || "—"}
      </div>
    </div>
  );
};

/* Helpers */
const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString() : "—";

const formatDateTime = (d) =>
  d ? new Date(d).toLocaleString() : "—";

const formatStatus = (s) =>
  s?.replace("_", " ") || "—";

const getStatusStyle = (status) => ({
  color:
    status === "COMPLETED"
      ? "#10B981"
      : status === "IN_PROGRESS"
      ? "#F59E0B"
      : "#EF4444",
});

/* Styles */
const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },

  header: {
    fontSize: 14,
    fontWeight: 600,
    color: "#111827",
    display: "flex",
    justifyContent: "space-between",
  },

  subId: {
    fontSize: 12,
    color: "#6B7280",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 12,
  },

  card: {
    background: "#ffffff",
    border: "1px solid #F1F5F9",
    borderRadius: 10,
    padding: 12,
  },

  label: {
    fontSize: 11,
    color: "#6B7280",
    marginBottom: 4,
  },

  value: {
    fontSize: 14,
    fontWeight: 600,
    color: "#111827",
  },

  empty: {
    fontSize: 13,
    color: "#6B7280",
  },
};

export default ProjectTimeline;