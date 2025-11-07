CREATE TABLE IF NOT EXISTS cooks (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clients (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  dietary_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS menu_assignments (
  id SERIAL PRIMARY KEY,
  cook_id INTEGER REFERENCES cooks(id) ON DELETE CASCADE,
  recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
  client_id INTEGER REFERENCES clients(id) ON DELETE SET NULL,
  assignment_date DATE NOT NULL,
  portions_needed INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_menu_assignments_date ON menu_assignments(assignment_date);
CREATE INDEX IF NOT EXISTS idx_menu_assignments_cook_date ON menu_assignments(cook_id, assignment_date);