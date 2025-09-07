# FullStack Intern Coding Challenge
- ## Tech Stack
- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MySQL / PostgreSQL
- **State Management:** React Hooks
- **Styling:** CSS / Bootstrap
- **Authentication:** JWT (JSON Web Tokens)
- **Other Libraries:** SweetAlert2, React Router
## Project Overview
This web application allows users to submit ratings for stores registered on the platform. Ratings range from **1 to 5**. A single login system is implemented for all users, 
and access is determined by their role:

**User Roles:**
1. **System Administrator**
2. **Normal User**
3. **Store Owner**

## Functionalities

### System Administrator
- Add new stores, normal users, and admin users.
- Dashboard displays:
  - Total number of users
  - Total number of stores
  - Total number of submitted ratings
- Add new users with Name, Email, Password, and Address.
- View list of stores with Name, Email, Address, and Rating.
- View list of normal and admin users with Name, Email, Address, and Role.
- Apply filters on listings by Name, Email, Address, and Role.
- View user details; for Store Owners, their Rating is displayed.
- Logout functionality.

### Normal User
- Sign up and log in.
- Signup form includes Name, Email, Address, and Password.
- Update password after login.
- View list of all registered stores.
- Search stores by Name and Address.
- Store listings display:
  - Store Name
  - Address
  - Overall Rating
  - User's Submitted Rating
  - Option to submit/modify ratings
- Submit ratings (1 to 5) for individual stores.
- Logout functionality.

### Store Owner
- Log in to the platform.
- Update password after login.
- Dashboard shows:
  - List of users who submitted ratings for their store.
  - Average rating of the store.
- Logout functionality.

## Form Validations
- **Name:** 20–60 characters
- **Address:** Max 400 characters
- **Password:** 8–16 characters, includes at least one uppercase letter and one special character
- **Email:** Standard email validation
- <img width="1920" height="1080" alt="signup" src="https://github.com/user-attachments/assets/a64978ac-57f2-4016-9294-d0e2fdc263ca" />
<img width="1920" height="1080" alt="login" src="https://github.com/user-attachments/assets/fc71d1ee-ebc3-4fdb-b9ac-fedc910800bd" />
<img width="1920" height="1080" alt="admin" src="https://github.com/user-attachments/assets/cacf44ca-cd54-4a98-b1c5-1dac79e787f9" />
<img width="1920" height="1080" alt="admin (2)" src="https://github.com/user-attachments/assets/0d786919-198d-47f0-902a-4e6aa4ac1688" />
<img width="1920" height="1080" alt="admin (3)" src="https://github.com/user-attachments/assets/f3f3b1da-3ff7-4fba-a1d3-4a2fe23ad994" />
<img width="1920" height="1080" alt="admin (4)" src="https://github.com/user-attachments/assets/507ec35e-29e0-45fb-bdb9-c4c543ad7667" />
<img width="1920" height="1080" alt="user dashboard" src="https://github.com/user-attachments/assets/776c421f-adf9-4fd1-8343-81839bbbf229" />
<img width="1920" height="1080" alt="storeowner" src="https://github.com/user-attachments/assets/45198b05-55ad-4226-80ce-8603e2ec8f1a" />






