import { type StoredUser } from '../types';
import { APP_OWNER_USERNAME } from '../constants';

export const initializeSeedData = () => {
    // Define the correct, authoritative state of the owner account as requested
    const ownerAccount: StoredUser = {
        id: 'user_owner_kushalraam',
        role: 'guru',
        firstName: 'Kushal',
        lastName: 'Raam',
        email: 'gabittukaram@gmail.com',
        username: APP_OWNER_USERNAME,
        mobile: '8277432056',
        password: 'joshi @1233456',
        profilePictureUrl: 'https://i.imgur.com/8m5K4fA.png',
        age: 35,
        expertise: 'App Development & Management',
        bio: 'The creator and manager of GyanSetu, ensuring a seamless experience for all Gurus and Shishyas.',
        rating: 5.0,
        reviews: 999,
        upiId: 'owner@gyansetu'
    };

    try {
        const usersJson = localStorage.getItem('gyansetu-users');
        let users: StoredUser[] = usersJson ? JSON.parse(usersJson) : [];

        const ownerIndex = users.findIndex(user => user.username === APP_OWNER_USERNAME);

        if (ownerIndex > -1) {
            // Update existing owner to ensure credentials are correct
            users[ownerIndex] = ownerAccount;
        } else {
            // Add owner if missing
            users.push(ownerAccount);
        }
        
        localStorage.setItem('gyansetu-users', JSON.stringify(users));
        
        if (!localStorage.getItem('gyansetu-posts')) {
            localStorage.setItem('gyansetu-posts', JSON.stringify([]));
        }

    } catch (error) {
        console.error("Error initializing seed data:", error);
        localStorage.setItem('gyansetu-users', JSON.stringify([ownerAccount]));
    }
};