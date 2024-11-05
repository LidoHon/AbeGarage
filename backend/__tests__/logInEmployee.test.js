const { logInEmployee } = require('../services/login.service');
const jwt = require('jsonwebtoken');

describe('Employee Login Logic', () => {
    it('should return success and employee data when correct credentials are provided', async () => {
        const formData = { email: 'ebeni@example.com', password: '123456789' };

        const response = await logInEmployee(formData);

        expect(response.status).toBe('success');
        expect(response.data).toHaveProperty('employee_id');
        expect(response.data).toHaveProperty('employee_first_name', 'ebeni');
    });

    it('should fail when incorrect password is provided', async () => {
        const formData = { email: 'ebeni@example.com', password: 'wrongPassword' };

        const response = await logInEmployee(formData);

        expect(response.status).toBe('fail');
        expect(response.message).toBe('Incorrect password');
    });

    it('should fail when the employee does not exist', async () => {
        const formData = { email: 'nonexistent@company.com', password: 'password123' };

        const response = await logInEmployee(formData);

        expect(response.status).toBe('fail');
        expect(response.message).toBe('Employee does not exist');
    });

    it('should generate a valid JWT token with the correct payload', async () => {
        const formData = { email: 'ebeni@example.com', password: '123456789' };

        const response = await logInEmployee(formData);

        expect(response.status).toBe('success');
        
        const decoded = jwt.verify(
            response.data.employee_token,
            process.env.JWT_SECRET
        );

        expect(decoded).toHaveProperty('employee_id');
        expect(decoded).toHaveProperty('employee_first_name', 'ebeni');
        expect(decoded).toHaveProperty('employee_role', 1); 
    });
});
