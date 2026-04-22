export const ROLES = {
    ARTISAN: 'ARTISAN',
    BUYER: 'BUYER',
    ADMIN: 'ADMIN',
};

// Dummy Credentials for Mock Auth
export const MOCK_USERS = [
    {
        id: 'u1',
        name: 'hassan nissar',
        email: 'buyer@example.com',
        password: 'password123', // In a real app, this would be hashed
        role: ROLES.BUYER,
        avatar: null,
    },
    {
        id: 'u2',
        name: 'Muzammil Hussain',
        email: 'artisan@example.com',
        password: 'password123',
        role: ROLES.ARTISAN,
        avatar: null,
    },
    {
        id: 'admin1',
        name: 'Super Admin',
        email: 'admin@craftistan.com',
        password: 'admin123',
        role: ROLES.ADMIN,
        avatar: null,
    }
];

export const MOCK_GOOGLE_USER = {
    id: 'g1',
    name: 'Google User',
    email: 'google@example.com',
    role: ROLES.BUYER, // Default to Buyer for social login
    avatar: 'https://lh3.googleusercontent.com/a/default-user',
};
