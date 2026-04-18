import React, { useEffect, useState } from 'react';
import ActivitiesCountPerProject from './ActivitiesCountPerProject';
import ActivityTimelineForProject from './ActivityTimelineForProject';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { CircularProgress } from '@mui/material';

const AnalyticsFeed = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const userData = useAuth();
  const token = userData?.user?.token;
  const adminId = userData?.user?.id;
  const backendBaseUrl = process.env.REACT_APP_BACKEND_BASE_URL;

  useEffect(() => {
    axios
      .get(`${backendBaseUrl}/api/projects/projectByAdmin/${adminId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProjects(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token, adminId, backendBaseUrl]);

  return (
    <div style={styles.page}>
      
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.title}>Analytics</div>
          <div style={styles.subtitle}>
            Track project performance & activity insights
          </div>
        </div>
      </div>

      {loading ? (
        <div style={styles.loader}>
          <CircularProgress />
        </div>
      ) : (
        <>
          {/* Overview */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>Overview</div>

            <div style={styles.glassCard}>
              <ActivitiesCountPerProject projects={projects} />
            </div>
          </div>

          {/* Timeline Grid */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>Project Timelines</div>

            <div style={styles.grid}>
              {projects.map((project) => (
                <div key={project.id} style={styles.timelineCard}>
                  
                  <div style={styles.projectHeader}>
                    <div style={styles.projectTitle}>
                      {project.title}
                    </div>

                    <div style={styles.badge}>
                      #{project.id}
                    </div>
                  </div>

                  <ActivityTimelineForProject projectId={project.id} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

/* 🔥 Modern Styles */
const styles = {
  page: {
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    background: "#F8FAFC",
    minHeight: "100vh",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: "22px",
    fontWeight: 700,
    color: "#111827",
  },

  subtitle: {
    fontSize: "13px",
    color: "#6B7280",
    marginTop: 4,
  },

  section: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  sectionTitle: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#374151",
  },

  /* Glass effect */
  glassCard: {
    background: "rgba(255,255,255,0.7)",
    backdropFilter: "blur(10px)",
    borderRadius: "16px",
    padding: "16px",
    border: "1px solid #E5E7EB",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "18px",
  },

  timelineCard: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "16px",
    border: "1px solid #E5E7EB",
    boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    transition: "all 0.2s ease",
  },

  projectHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  projectTitle: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#111827",
  },

  badge: {
    fontSize: "11px",
    padding: "4px 8px",
    background: "#EEF2FF",
    color: "#4F46E5",
    borderRadius: "999px",
    fontWeight: 500,
  },

  loader: {
    display: "flex",
    justifyContent: "center",
    padding: "40px",
  },
};

export default AnalyticsFeed;