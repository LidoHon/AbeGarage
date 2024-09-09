const orderService = require("../services/order.service");
const customerService = require('../services/customer.service'); 

// Example function to fetch customers within order context
async function getAllCustomersForOrder(req, res) {
    try {
        const searchQuery = req.query.search || '';
        const customers = await customerService.getAllCustomers(searchQuery);  
        res.status(200).json({
            status: 'success',
            customers,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch customers for order',
        });
    }
}

module.exports = { getAllCustomersForOrder };

// Controller for creating a new order
async function createOrder(req, res) {
    try {
        const orderData = req.body;
        const newOrder = await orderService.createOrder(orderData);
        res.status(201).json({
            status: 'success',
            message: 'Order created successfully',
            data: newOrder,
        });
    } catch (err) {
        console.error("Error creating order:", err);
        res.status(500).json({
            status: 'error',
            message: 'Failed to create order',
        });
    }
}



async function getAllOrders(req, res) {
    try {
        const orders = await orderService.getAllOrders();
        if (!orders) {
            return res.status(404).json({
                status: 'error',
                message: 'No orders found',
            });
        }
        res.status(200).json({
            status: 'success',
            data: orders,
        });
    } catch (err) {
        console.error("Error fetching orders:", err);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch orders',
        });
    }
}

async function updateOrder(req, res) {
    try {
        const orderId = req.params.id;
        const updatedData = req.body;
        const updatedOrder = await orderService.updateOrder(orderId, updatedData);

        if (!updatedOrder) {
            return res.status(404).json({
                status: 'error',
                message: 'Order not found',
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Order updated successfully',
            data: updatedOrder,
        });
    } catch (err) {
        console.error("Error updating order:", err);
        res.status(500).json({
            status: 'error',
            message: 'Failed to update order',
        });
    }
}

async function deleteOrder(req, res) {
    try {
        const orderId = req.params.id;
        const deletedOrder = await orderService.deleteOrder(orderId);

        if (!deletedOrder) {
            return res.status(404).json({
                status: 'error',
                message: 'Order not found or failed to delete',
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Order deleted successfully',
        });
    } catch (err) {
        console.error("Error deleting order:", err);
        res.status(500).json({
            status: 'error',
            message: 'Failed to delete order',
        });
    }
}

async function getOrderById(req, res) {
    try {
        const orderId = req.params.orderId;
        const order = await orderService.getOrderById(orderId);

        if (!order) {
            return res.status(404).json({
                status: 'error',
                message: 'Order not found',
            });
        }

        res.status(200).json({
            status: 'success',
            data: order,
        });
    } catch (err) {
        console.error("Error fetching order:", err);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch order',
        });
    }
}

module.exports = {
    createOrder,
    getAllOrders,
    updateOrder,
    deleteOrder,
    getOrderById,
};
