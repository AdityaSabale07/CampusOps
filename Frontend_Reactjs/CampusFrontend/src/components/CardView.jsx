import React from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";

const CardView = () => {

  const cards = [
    { title: "30", description: "Feedbacks" },
    { title: "3.6", description: "Average Feedback" },
    { title: "5", description: "Pending Tasks" },
    { title: "4", description: "QB Invitations" },
    { title: "10", description: "Weekly Schedules" },
    { title: "25", description: "Messages" },
    { title: "10", description: "Logs Submitted" },
    { title: "8", description: "Logs Verified" },
    { title: "300", description: "Approved Logs" },
    { title: "2", description: "Rejected Logs" },
    { title: "10", description: "Verification Waiting" },
    { title: "11", description: "Approval Waiting" }
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((card, index) => (
        <Grid item xs={12} sm={3} md={2} key={index}>
          <Card
            sx={{
              borderRadius: "20px",
              background: "rgba(255,255,255,0.8)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
            }}
          >
            <CardContent>
              <Typography variant="h4" fontWeight="bold">
                {card.title}
              </Typography>

              <Typography variant="body2" mt={1}>
                {card.description}
              </Typography>

            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default CardView;
