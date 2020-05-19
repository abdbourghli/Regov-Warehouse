# Regov-Warehouse

# user
### login
POST /login
```
{
  "userName": String,
  "password": String
}
```

### Register
POST /register
{
  userName: String,
  email: String,
  password: String
}

# Products
### add product
POST /api/addproduct
{
  name: String
}

### find product
GET /api/product/{Name}

### list all products
GET /api/products

### remove a product
DELETE /api/product/{Name}

# Warehouse
### add warehouse
POST /api/addwarehouse
{
  name: String
}

### find warehouse
GET /api/warehouse/{name}

### list all warehouses
GET /api/warehouses

### remove a warehouse
DELETE /api/warehouse/{name}

# Stocks
### get stock in warehouse
GET /api/warehousestock/{warehouse}

### add stock
PUT /api/stock
{
  product: String,
  warehouse: String,
  amount: Int
}

### remove stock
PUT /api/unstock
{
  product: String,
  warehouse: String,
  amount: Int
}
