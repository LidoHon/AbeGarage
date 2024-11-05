import { describe, it, expect, vi } from 'vitest';
import { loginService } from '../Components/services/login.service';
import decodePayload from '../Components/util/auth'; // Import the decodePayload function

// Destructure the function to test
const { logInCustomer } = loginService;

describe('Frontend Customer Login Logic', () => {
  
  it('should return success and store decoded customer_id when only the token is provided', async () => {
    const mockToken = 'valid_token';
    const decodedData = { customer_id: 7 }; // Mock the decoded payload

    // Mock the fetch response with missing customer_id
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            status: 'success',
            data: {
              customer_token: mockToken,
              customer_first_name: 'lidoo',
            },
          }),
        ok: true,
      })
    );

    // Mock the decodePayload function to return decodedData
    vi.mock('../util/auth', () => ({
      default: vi.fn(() => decodedData),
    }));

    const response = await logInCustomer('lido@lido.com', '123456789');

    expect(response.status).toBe('success');
    expect(decodePayload).toHaveBeenCalledWith(mockToken); // Verify decode function is called
    expect(response.data.customer_id).toBe(7); // Ensure the decoded ID is stored
    expect(response.data.customer_first_name).toBe('lidoo');
  });

  it('should return success and store customer_id when provided directly', async () => {
    const mockResponse = {
      status: 'success',
      data: {
        customer_id: 7,
        customer_first_name: 'lidoo',
        customer_token: 'valid_token',
      },
    };

    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockResponse),
        ok: true,
      })
    );

    const response = await logInCustomer('lido@lido.com', '123456789');

    expect(response.status).toBe('success');
    expect(response.data).toHaveProperty('customer_id', 7);
    expect(response.data).toHaveProperty('customer_first_name', 'lidoo');
  });

  it('should throw an error when incorrect credentials are provided', async () => {
    const mockResponse = {
      status: 'fail',
      message: 'Incorrect password',
    };

    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockResponse),
        ok: false,
      })
    );

    try {
      await logInCustomer('lido@lido.com', 'wrongPassword');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Incorrect password');
    }
  });
});
