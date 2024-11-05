const { logInCustomer } = require('../services/login.service');
const jwt = require('jsonwebtoken');

describe('Customer Login Logic', () => {
    it('should return success and customer data when correct credentials are provided', async () => {
        const formData = { email: 'lido@lido.com', password: '123456789' };

        const response = await logInCustomer(formData);

        expect(response.status).toBe('success');
        expect(response.data).toHaveProperty('customer_id');
        expect(response.data).toHaveProperty('customer_first_name', 'lidoo');
    });

    it('should fail when incorrect password is provided', async () => {
        const formData = { email: 'lido@lido.com', password: 'wrongPassword' };

        const response = await logInCustomer(formData);

        expect(response.status).toBe('fail');
        expect(response.message).toBe('Incorrect password');
    });

    it('should fail when the customer does not exist', async () => {
        const formData = { email: 'nonexistent@customer.com', password: 'password123' };

        const response = await logInCustomer(formData);

        expect(response.status).toBe('fail');
        expect(response.message).toBe('Customer does not exist');
    });

    it('should generate a valid JWT token with the correct payload', async () => {
        const formData = { email: 'lido@lido.com', password: '123456789' };

        const response = await logInCustomer(formData);

        expect(response.status).toBe('success');
        
        const decoded = jwt.verify(
            response.data.customer_token,
            process.env.JWT_SECRET
        );

        expect(decoded).toHaveProperty('customer_id', 7);
        expect(decoded).toHaveProperty('customer_first_name', 'lidoo');
        expect(decoded).toHaveProperty('customer_email', 'lido@lido.com');
    });
});
