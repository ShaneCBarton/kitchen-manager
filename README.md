# Kitchen Manager

A web-based meal service kitchen management system that streamlines recipe management, meal assignments, and ingredient aggregation for professional kitchens.

## Features

### 📝 Recipe Management
- Create, edit, and delete recipes
- Upload recipe images
- Track ingredient amounts for automatic aggregation
- Organize recipes by category
- Store detailed cooking instructions

### 👨‍🍳 Cook Management
- Manage kitchen staff profiles
- Track cook contact information
- Assign meals to specific cooks

### 👥 Client Management
- Maintain client profiles
- Track dietary requirements and preferences
- Link clients to specific meal assignments

### 📅 Assignment System
- Assign recipes to cooks by date
- Specify portion quantities
- Add assignment notes
- Filter assignments by date and cook

### 🔢 Automatic Ingredient Aggregation
- Automatically calculate total ingredient amounts per cook per day
- Eliminates manual tallying of proteins and other ingredients
- Converts between grams and kilograms automatically
- Groups same ingredients across multiple recipes

## Tech Stack

**Backend:**
- Node.js
- Express.js
- PostgreSQL
- Multer (file uploads)

**Frontend:**
- Vanilla JavaScript
- HTML5
- CSS3

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- Git

## Installation

1. **Clone the repository:**
```bash
git clone https://github.com/ShaneCBarton/kitchen-manager.git
cd kitchen-manager
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up PostgreSQL database:**
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE kitchen_manager;
\q
```

4. **Run database migrations:**
```bash
psql -U postgres -d kitchen_manager -f src/config/schema.sql
psql -U postgres -d kitchen_manager -f src/config/add_images.sql
psql -U postgres -d kitchen_manager -f src/config/phase2_tables.sql
```

5. **Configure environment variables:**

Create a `.env` file in the project root:
```
DB_USER=postgres
DB_HOST=localhost
DB_NAME=kitchen_manager
DB_PASSWORD=your_postgres_password
DB_PORT=5432
PORT=3000
```

6. **Start the server:**
```bash
# Development mode (auto-restart on changes)
npm run dev

# Production mode
npm start
```

7. **Access the application:**
Open your browser to `http://localhost:3000`

## Project Structure

```
kitchen-manager/
├── src/
│   ├── config/
│   │   ├── database.js          # Database connection
│   │   ├── upload.js            # File upload configuration
│   │   └── *.sql                # Database schemas
│   ├── controllers/
│   │   ├── recipeController.js
│   │   ├── cookController.js
│   │   ├── clientController.js
│   │   └── assignmentController.js
│   ├── models/
│   │   ├── recipeModel.js
│   │   ├── cookModel.js
│   │   ├── clientModel.js
│   │   └── assignmentModel.js
│   ├── routes/
│   │   ├── recipeRoutes.js
│   │   ├── cookRoutes.js
│   │   ├── clientRoutes.js
│   │   ├── assignmentRoutes.js
│   │   └── uploadRoutes.js
│   └── server.js                # Express server
├── public/
│   ├── index.html               # Recipe management page
│   ├── cooks.html               # Cook management page
│   ├── clients.html             # Client management page
│   ├── assignments.html         # Assignment page
│   ├── app.js                   # Recipe management JS
│   ├── cooks.js                 # Cook management JS
│   ├── clients.js               # Client management JS
│   ├── assignments.js           # Assignment JS
│   ├── styles.css               # Global styles
│   └── uploads/                 # Recipe images
├── .env                         # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## API Endpoints

### Recipes
- `GET /api/recipes` - Get all recipes
- `GET /api/recipes/:id` - Get single recipe
- `POST /api/recipes` - Create recipe
- `PUT /api/recipes/:id` - Update recipe
- `DELETE /api/recipes/:id` - Delete recipe

### Cooks
- `GET /api/cooks` - Get all cooks
- `GET /api/cooks/:id` - Get single cook
- `POST /api/cooks` - Create cook
- `PUT /api/cooks/:id` - Update cook
- `DELETE /api/cooks/:id` - Delete cook

### Clients
- `GET /api/clients`
