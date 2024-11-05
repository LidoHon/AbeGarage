import { describe, it, expect, vi } from 'vitest';
import { loginService } from '../Components/services/login.service';

// Destructure the logOut function
const { logOut } = loginService;

describe('Logout Functionality', () => {
    it('should clear all customer and employee tokens and objects from localStorage', () => {
        // Mock initial data in localStorage
        localStorage.setItem('customer_token', 'mockCustomerToken');
        localStorage.setItem('employee_token', 'mockEmployeeToken');
        localStorage.setItem('customer', JSON.stringify({ customer_id: 1, customer_first_name: 'Test' }));
        localStorage.setItem('employee', JSON.stringify({ employee_id: 1, employee_first_name: 'Admin' }));

        // Verify that the data exists in localStorage before calling logOut
        expect(localStorage.getItem('customer_token')).toBe('mockCustomerToken');
        expect(localStorage.getItem('employee_token')).toBe('mockEmployeeToken');
        expect(localStorage.getItem('customer')).not.toBeNull();
        expect(localStorage.getItem('employee')).not.toBeNull();

        // Call logOut function
        logOut();

        // Verify that the data has been removed from localStorage
        expect(localStorage.getItem('customer_token')).toBeNull();
        expect(localStorage.getItem('employee_token')).toBeNull();
        expect(localStorage.getItem('customer')).toBeNull();
        expect(localStorage.getItem('employee')).toBeNull();
    });
});
