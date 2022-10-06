
CREATE TABLE IF NOT EXISTS products(
  id SERIAL PRIMARY  KEY,
  product_name VARCHAR(150) NOT NULL,
  price integer NOT NULL,
  category varchar(150)

);