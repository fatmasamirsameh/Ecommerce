**Endpoints**
  * User*
  # Authenticate/post
  http://localhost:3000/api/users/authenticate
  <!-- {
   "email":"fatma@gmail.com",
   "password":"123456"   
} -->

  # Create new user/post
  http://localhost:3000/api/users
   ## Sample data 
  <!-- "email":"fatma@gmail.com",
"user_name":"fatmasamir",
"first_name":"fatma",
"last_name":"samir",
"password":"123456"    
} -->

  # Get all users/Get
  http://localhost:3000/api/users
  # Get one user/Get
  http://localhost:3000/api/users/1
  # update one/patch
  http://localhost:3000/api/users/2
  ## Sample data  
  <!-- {
    "id":2,
    "email":"ali@gmail.com",
    "user_name":"aliahmed",
    "first_name":"ali",
    "last_name":"ahmed",
    "password":"123"    
    } -->

  # delete user
  http://localhost:3000/api/users/2
  * Order *
  # Create new  Order/post
  http://localhost:3000/api/orders
   ## Sample data  
    <!-- {
  "status":"complete" 

  } -->
  # Get all Orders/Get
  http://localhost:3000/api/orders
  # Get one  Orders/Get
  http://localhost:3000/api/orders/1
  # update one/patch
  http://localhost:3000/api/orders/2
  ## Sample data  
  <!-- {
    {
     "id":2,
  "status": "complete"
}
-->
  # delete  Order/delete
  http://localhost:3000/api/orders/2
  * Product *
  # Create new  product/post
  http://localhost:3000/api/products
   ## Sample data  
      <!-- {
  "product_name":"mobile",
  "price":3000,
  "category":"electronics"   
  
  } -->

  # Get all products/Get
  http://localhost:3000/api/products
  # Get one  products/Get
  http://localhost:3000/api/products/1
  # update one/patch
  http://localhost:3000/api/products/2
  ## Sample data  
  <!-- {
    "id":2,
  "product_name":"TV",
  "price":2000,
  "category":"electronics"   
  
  } -->

  # delete  Product/delete
  http://localhost:3000/api/products/2
  
* orderProduct *
# Add Product/post
http://localhost:3000/api/orders/25/products

  <!-- {
  "product_id":1,
  "quantity":"2" 
  } -->

Result:
{
    "data": {
        "id": 31,
        "quantity": 2,
        "order_id": "25",
        "product_id": 1
    },
    "message": "add Product created successfully"
}
 



 






# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index 
- Show
- Create [token required]
- [OPTIONAL] Top 5 most popular products 
- [OPTIONAL] Products by category (args: product category)

#### Users
- Index [token required]
- Show [token required]
- Create N[token required]

#### Orders
- Current Order by user (args: user id)[token required]
- [OPTIONAL] Completed Orders by user (args: user id)[token required]

## Data Shapes
#### Product
-  id
- name
- price
- [OPTIONAL] category

#### User
- id
- first_name
- last_name
- password

#### Orders
- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)

