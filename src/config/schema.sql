CREATE TABLE IF NOT EXISTS recipes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    base_portion_size INTEGER NOT NULL DEFAULT 2,
    instructions TEXT
);

CREATE TABLE IF NOT EXISTS recipe_variants (
    id SERIAL PRIMARY KEY,
    base_recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
    variant_name VARCHAR(255) NOT NULL,
    notes TEXT
);