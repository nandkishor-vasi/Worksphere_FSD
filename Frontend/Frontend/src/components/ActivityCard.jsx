import React from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
} from "@mui/material";

const ActivityCard = ({ activity, refresh}) => {
  const userData = useAuth();
  const token = userData?.user?.token;

  const backendBaseUrl = process.env.REACT_APP_BACKEND_BASE_URL;

  const handleDelete = async () => {
   try {
    await axios.delete(`${backendBaseUrl}/api/activities/${activity.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    refresh();
  } catch (err) {
    console.error(err);
  }
  };

  return (
    <Card
      style={{
        width: "100%",
        maxWidth: "400px",
        margin: "15px auto",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#fafafa",
      }}
    >
      <CardContent>
        <Typography variant="h6" color="primary" gutterBottom>
          {activity.action}
        </Typography>

        <Typography variant="body1" gutterBottom>
          {activity.detail}
        </Typography>

        <Box>
          <Chip
  label={`Created by: ${activity.createdByName}`}
  color="primary"
  size="small"
  style={{ marginRight: "5px" }}
/>

<Chip
  label={`Handled by: ${activity.handledByName}`}
  color="secondary"
  size="small"
  style={{ marginRight: "5px" }}
/>

<Chip
  label={`Project ID: ${activity.projectId}`}
  color="default"
  size="small"
/>
        </Box>

        <Typography
          variant="caption"
          color="textSecondary"
          display="block"
          style={{ marginTop: "10px" }}
        >
          {new Date(activity.timestamp).toLocaleString()}
        </Typography>

        {activity.fileUrl ? (
          <Typography mt={2}>
            📄{" "}
            <a
              href={activity.fileUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                color: "#2563eb",
                textDecoration: "underline",
                fontWeight: "500",
              }}
            >
              {decodeURIComponent(activity.fileUrl.split("/").pop())}
            </a>
          </Typography>
        ) : (
          <Typography mt={2} color="text.secondary">
            No file uploaded
          </Typography>
        )}

        <Button
          onClick={handleDelete}
          variant="outlined"
          color="error"
          fullWidth
          style={{
            marginTop: "15px",
            borderRadius: "20px",
            fontWeight: "bold",
          }}
        >
          Delete
        </Button>
      </CardContent>
    </Card>
  );
};

export default ActivityCard;
