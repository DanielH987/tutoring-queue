# Tutoring Queue Application

Welcome to the **Tutoring Queue Application**, a web-based system designed to help manage the flow of students requesting tutoring assistance. The app allows students to submit questions, get placed into a queue, and receive help from tutors in real-time. Tutors can view, pick up, and resolve requests while tracking metrics such as average and median wait times.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [Contact](#contact)

## Overview

The **Tutoring Queue Application** facilitates the interaction between students and tutors by managing a queue system for tutoring sessions. Students can submit their names, courses, and questions, and tutors can pick up these requests, help students, and mark the requests as completed. The app also provides tutors with performance metrics such as average wait times and the duration of tutoring sessions.

This app is designed with simplicity and scalability in mind, using modern tools and a clean architecture to ensure it can handle multiple users and grow over time.

## Features

- **Real-time queue management**: Students are placed into a queue when they submit a request for tutoring, and tutors can view all active requests in real-time.
- **Tutor profiles**: Tutors can see all the requests they have picked up, with a detailed history of past requests.
- **Performance metrics**: Tutors can view helpful statistics like average wait time, help time, and medians.
- **Admin management**: Admins can approve pending user accounts, manage user roles, and suspend or delete accounts.
- **Responsive design**: The application is designed to work on both desktop and mobile devices.

## Tech Stack

- **Next.js** (with `app/` directory structure) for the frontend and backend
- **TypeScript** for type safety
- **MongoDB** as the database, managed through **Prisma**
- **Tailwind CSS** for styling
- **Pusher** for real-time updates via WebSockets
- **NextAuth** for authentication and role management
- **Prisma ORM** for database interaction

## Project Structure
- `app/`
  - `api/` - API routes for requests, user management, etc.
  - `components/` - Reusable components (e.g., Request, Modal)
  - `tutor/` - Pages related to tutor views (e.g., profile, requests)
  - `admin/` - Admin panel views
  - `layout.tsx` - Global layout with shared metadata
  - `page.tsx` - Main landing page
- `prisma/`
  - `schema.prisma` - Prisma schema for MongoDB database
- `public/`
  - `favicon.ico` - Favicon for the app
  - `logo.png` - Branding assets

## Contributing

We welcome contributions to this project! While this app is currently built with a specific goal in mind, there's always room for improvement, new features, and bug fixes. Here's how you can contribute:

1. **Fork the repository** to your own GitHub account.
2. **Clone the repository** to your local machine:
   ```bash
   git clone https://github.com/yourusername/tutoring-queue-app.git
3. **Create a new branch** for your feature or bug fix:
    ```bash
    git checkout -b your-branch-name
4. **Make your changes** and test thoroughly.
5. **Commit your changes:**
    ```bash
    git commit -m "Add new feature or fix"
6. **Push to your branch:**
    ```bash
    git push origin your-branch-name
7. **Create a pull request** from your branch into the main branch of this repository.

## Contact
If you have any questions, suggestions, or want to discuss the project further, feel free to reach out:

- Email: hootinid@gmail.com
- GitHub Issues: Open an issue if you encounter any bugs or have feature requests.
