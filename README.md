# **Task Management Application Backend**

### **Live Link: https://task-management-mdminhazulislamkhan.vercel.app/**

### **Frontend Github: https://github.com/MDMinhazulIslamKhan/task-management-frontend**

### **Backend Deploy Link: https://tutor-booking-and-management-mdminhazulislamkhan.vercel.app**

---

---

### **Requerment analysis - [_click here_](https://docs.google.com/document/d/19VdmRYnKdyV4vzuzAb0x4BTecCNzcznHKVlfpNs8PCQ/edit?usp=drive_link)**

### **ER Diagram - [_click here_](https://docs.google.com/document/d/19VdmRYnKdyV4vzuzAb0x4BTecCNzcznHKVlfpNs8PCQ/edit?usp=sharing)**

---

## Used Technology

- TypeScript
- NodeJs | ExpressJs
- MongoDB | Mongoose
- Zod
- Jsonwebtoken
- Bcrypt
- Cors
- Dotenv
- Http-status
- Ts-node-dev
- ESLint
- Prettier
- Lint-staged
- Husky

## Main Functionality

- Registration and login
- Edit profile
- Change password
- View profile
- Create task
- Assign task
- Notification
- See all task with pagination and filtering
- View task details
- Update task ( only for task creator )
- Delete task ( only for task creator )
- Accept assigned task
- Cancel assigned task
- Complete task
- Give feedback on task
- Delete own feedback on task

## API Endpoints

#### User

- /user/signup (post)
- /user/login (post)
- /user/change-password (patch)
- /user/profile (get) ⇒ (for getting own profile information)
- /user/profile (patch) ⇒ (for updating own profile)
- /user/get-all-users (get)
- /user/single-user/:id (get) ⇒ (for getting single user profile information)

#### Task

- /task/create (post) ⇒ (for creating task)
- /task/get-all-tasks (get) ⇒ (for getting all task)
- /task/get-all-my-tasks (get) ⇒ (for getting all own created task)
- /task/:id (get) ⇒ (for getting single task)
- /task/:id (patch) ⇒ (for updating own created task)
- /task/:id (delete) ⇒ (for deleting own created task)
- /task/feedback/:id (post)
- /task/feedback/:id (delete)
- /task/get-my-task (get) ⇒ (for getting my assigned task)
- /task/accept-assigned-task/:id (patch)
- /task/cancel-assigned-task/:id (patch)
- /task/complete-task/:id (patch)

## Login information

- email : minhaz@gmail.com

- password : 123456

```json
{
  "email": "minhaz@gmail.com",
  "password": "123456"
}
```
