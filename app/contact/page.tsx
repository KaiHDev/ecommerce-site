"use client";

import React from "react";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { Button, TextField, Typography, Box, Paper } from "@mui/material";
import HeroSectionSmall from "../components/HeroSectionSmall";

const ContactUsPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    console.log("Form data submitted:", data);
  };

  return (
    <div>
      {/* Hero Section */}
      <HeroSectionSmall title="Contact Us" />

      {/* Contact Page Container */}
      <div className="max-w-screen-xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          {/* Contact Form */}
          <Box component="form" onSubmit={handleSubmit(onSubmit)} className="md:col-span-2 space-y-6">
            <TextField
              label="Your Name"
              variant="outlined"
              fullWidth
              {...register("name", { required: "Name is required" })}
              error={!!errors.name}
              helperText={errors.name ? errors.name.message as string : ""}
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                  message: "Invalid email address",
                },
              })}
              error={!!errors.email}
              helperText={errors.email ? errors.email.message as string : ""}
            />
            <TextField
              label="Message"
              variant="outlined"
              multiline
              rows={4}
              fullWidth
              {...register("message", { required: "Message is required" })}
              error={!!errors.message}
              helperText={errors.message ? errors.message.message as string : ""}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              className="bg-accent hover:bg-accent-dark text-white py-2 rounded-md transition"
            >
              Send Message
            </Button>
          </Box>

          {/* Shop Address */}
          <Paper elevation={3} className="bg-white shadow-md border border-gray-200 rounded-lg p-6">
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
              Find Us
            </Typography>
            <Box className="space-y-3">
              <Typography variant="body1" sx={{ fontSize: "1.1rem", color: "gray.800" }}>
                <strong>Email:</strong> support@mystore.com
              </Typography>
              <Typography variant="body1" sx={{ fontSize: "1.1rem", color: "gray.800" }}>
                <strong>Phone:</strong> +1 (123) 456-7890
              </Typography>
              <Typography variant="body1" sx={{ fontSize: "1.1rem", color: "gray.800" }}>
                <strong>Address:</strong> 123 E-commerce St, Shop City
              </Typography>
            </Box>
          </Paper>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
