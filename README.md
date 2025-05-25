# POP - Social Media API

POP is a RESTful API built for social media applications that allows users to create accounts, share publications, and follow other users. It provides a robust backend infrastructure for developing social networking platforms.

## Features

- **User Management**: Registration, authentication, profile management
- **Publications**: Create, read, update, and delete posts
- **Follow System**: Follow/unfollow users and manage connections
- **File Uploads**: Support for image uploads (profile pictures, publication images)
- **Role-Based Access Control**: Different permission levels (user, admin, owner, superadmin)
- **Secure Authentication**: JWT-based authentication system

## Technology Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcrypt for password hashing
- **Validation**: Zod for schema validation
- **File Upload**: Multer

## Prerequisites

- Node.js (v16+)
- MongoDB (v5+)
- pnpm (v10.5.2+)

## Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/pop.git
   cd pop
   ```

2. Install dependencies
   ```
   pnpm install
   ```

3. Set up environment variables
   Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/pop
   JWT_SECRET=your_jwt_secret_key
   ```

4. Build the project
   ```
   pnpm tsc
   ```

5. Start the server
   ```
   node dist/index.js
   ```

## API Endpoints

### User Routes
- `POST /api/user` - Create a new user
- `POST /api/user/login` - Login
- `GET /api/user/me/:id?` - Get user profile
- `GET /api/user/users/:page?` - List users with pagination
- `PATCH /api/user` - Update user information
- `DELETE /api/user` - Delete user account
- `POST /api/user/upload` - Upload profile picture
- `GET /api/user/pfp/:filename` - Get user profile picture

### Publication Routes
- `POST /api/publication` - Create a new publication
- `GET /api/publication/:id?` - Get publications
- `PATCH /api/publication/:id` - Update a publication
- `DELETE /api/publication/:id` - Delete a publication

### Follow Routes
- `POST /api/follow` - Follow a user
- `DELETE /api/follow/:id` - Unfollow a user
- `GET /api/follow/following/:id?` - Get list of users being followed
- `GET /api/follow/followers/:id?` - Get list of followers

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Role-based authorization
- Input validation

## License

ISC