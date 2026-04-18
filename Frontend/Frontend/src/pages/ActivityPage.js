import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ActivityForm from '../components/ActivityForm';
import ActivityList from '../components/ActivityList';
import { useAuth } from '../context/AuthContext';

const ActivityPage = () => {
  const [activities, setActivities] = useState([]);
  const userData = useAuth();
  const adminId = userData?.user?.id;
  const token = userData?.user?.token;
  const backendBaseUrl = process.env.REACT_APP_BACKEND_BASE_URL;

  const fetchActivities = async () => {
    if (!adminId) return;

    const res = await axios.get(
      `${backendBaseUrl}/api/activities/admin/${adminId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setActivities(res.data);
  };

  useEffect(() => {
    fetchActivities();
  }, [adminId, token, fetchActivities]);

  return (
    <div style={styles.page}>

      <div style={styles.header}>
        <div>
          <div style={styles.title}>Activities</div>
          <div style={styles.subtitle}>
            Manage and track all activities
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={styles.grid}>

        {/* Form Section */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>Create Activity</div>
          <ActivityForm adminId={adminId} refresh={fetchActivities} />
        </div>

        {/* List Section */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>Activity List</div>
          <ActivityList activities={activities} refresh={fetchActivities}  />
        </div>

      </div>
    </div>
  );
};

/* Styles aligned with dashboard */
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
    fontSize: "20px",
    fontWeight: 600,
    color: "#111827",
  },

  subtitle: {
    fontSize: "13px",
    color: "#6B7280",
    marginTop: 4,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1.2fr",
    gap: "20px",
  },

  card: {
    background: "#ffffff",
    borderRadius: "14px",
    padding: "18px",
    border: "1px solid #E5E7EB",
    boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  cardTitle: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#111827",
  },
};

export default ActivityPage;