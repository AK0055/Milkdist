
<h3 align="center">Milk Dist</h3>
<p align="center">
    An easy to use NodeJS-based backend Milk distribution management API 
    <br /></p>

### Built With

- [NodeJS](https://nodejs.org/en/)
- [MongoDB Atlas](https://www.mongodb.com/)
- [Express](https://expressjs.com/)

### Installation and Prerequisites
1. Clone the repo
    ```sh
     git clone https://github.com/AK0055/Milkdist.git
    ```
2. Paste your mongodb URI into your .env file

3. Initialise and install dependencies
    ```sh
     npm init -y
    ```

## Usage
1. Start the application using
```sh
  npm start
  ```
2. Navigate to http://localhost:3002/setday and set maximum capacity in stock to initialise for all days

3. Navigate to http://localhost:3002/add and enter order details prompted and make its order status as `Placed`

4. Navigate to http://localhost:3002/ to view all orders with their details

5. Navigate to http://localhost:3002/update/:id to update the order details for the given `id`

5. Navigate to http://localhost:3002/updateStatus/:id to update the order status for the given `id`

6. Navigate to http://localhost:3002/delete/:id to delete an order with the given `id`

6. Navigate to http://localhost:3002/checkCapacity/:date to check current capacity after all placed orders have been processed for the given `date`

6. Navigate to http://localhost:3002/checkCapacity to check current capacity after all placed orders have been processed for all days



