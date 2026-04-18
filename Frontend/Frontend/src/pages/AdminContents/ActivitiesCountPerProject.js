import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const ActivitiesCountPerProject = ({ projects }) => {
  const [activitiesCount, setActivitiesCount] = useState({});
  const [loading, setLoading] = useState(true);
  const backendBaseUrl = process.env.REACT_APP_BACKEND_BASE_URL;
  const userData = useAuth();
  const token = userData?.user?.token;

  useEffect(() => {
    const fetchCounts = async () => {
      const counts = {};
      for (const project of projects) {
        try {
          const res = await axios.get(
            `${backendBaseUrl}/api/analytics/activities/${project.id}/count-per-project`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          counts[project.id] = res.data.length || 0;
        } catch (err) {
          console.error(`Failed for project ${project.id}:`, err);
        }
      }
      setActivitiesCount(counts);
      setLoading(false);
    };

    if (projects.length > 0) {
      fetchCounts();
    }
  }, [projects,backendBaseUrl , token]);

  return (
    <div style={styles.wrapper}>
      
      {/* Header */}
      <div style={styles.header}>Activities Overview</div>

      {/* Loading */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress size={28} />
        </Box>
      ) : (
        <div style={styles.grid}>
          {projects.map((project) => (
            <div key={project.id} style={styles.card}>
              
              <div style={styles.title}>
                {project.title || "Project"}
              </div>

              <div style={styles.count}>
                {activitiesCount[project.id] ?? 0}
              </div>

              <div style={styles.label}>
                Activities
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* Dashboard-aligned styles */
const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },

  header: {
    fontSize: 16,
    fontWeight: 600,
    color: "#111827",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: 14,
  },

  card: {
    background: "#ffffff",
    borderRadius: 12,
    padding: 16,
    border: "1px solid #F1F5F9",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },

  title: {
    fontSize: 13,
    fontWeight: 500,
    color: "#374151",
  },

  count: {
    fontSize: 22,
    fontWeight: 600,
    color: "#6366F1",
  },

  label: {
    fontSize: 12,
    color: "#6B7280",
  },
};

export default ActivitiesCountPerProject;