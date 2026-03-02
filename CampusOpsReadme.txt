# 🏫 CampusOps – Modular Campus Operations Platform

## 📌 Project Overview

**CampusOps** is a modular campus management platform designed to simplify and automate:

- Student admissions
- Batch management
- Discount management
- Approval workflows
- Revenue analytics

The system focuses on real-world admission workflows where students register first and administrators 
verify and approve admissions before final confirmation.

---

## 🎯 Problem Statement

Educational institutes face problems like:

- Managing multiple courses & batches
- Handling admission approvals manually
- Applying complex discount policies
- Tracking revenue & analytics

CampusOps solves this by providing a centralized, role-based system with automated validation 
 and discount logic.

---

## 🛠 Tech Stack

### Backend
- Java
- Spring Boot
- Spring Security (Role-based access)
- Spring Data JPA / Hibernate
- MySQL Database
- REST APIs

### Frontend
- React JS
- Axios
- Bootstrap
- React Toastify
- Responsive Glass UI Design

---

## 👥 Roles

###🎓 Student
- Submit admission registration
- View available offers notification
- Wait for admin approval

### 👨‍💼 Admin
- Manage courses & batches
- Create discounts
- Approve / reject admissions
- Apply discount before approval
- View analytics dashboard

---

## 📚 Core Modules

### 1️⃣ Course Management
- Create modular courses
- Course-wise batch creation

---

### 2️⃣ Batch Management
- Assign timing, mode, capacity
- Track seat usage
- Monitor batch progress

---

### 3️⃣ Admission Workflow

#### Step-by-step Flow:

1. Student submits registration  
2. Status becomes **PENDING**  
3. Admin reviews application  
4. Admin selects discount (optional)  
5. Admission becomes:

- APPROVED
- or REJECTED

---

### 4️⃣ Discount Engine (Main Feature)

A strategy-based discount system allows flexible discount handling.

Only **ONE discount** is applied per registration.

---

## 🎁 Discount Types (Easy Explanation)

### ⭐ Early Bird
- Valid for specific dates.
- Automatically validated by date.

---

### 👥 Group Discount
- Admin adds group emails after student call/confirmation.
- Only listed emails can use group discount.
- Students only see notification:
  > “Group discount available — contact admin.”

---

### 👤 Individual Discount
- Special discount for specific student email.
- Admin manually applies during approval.

---

### 🔁 Loyalty Discount
- For students already having an **APPROVED** admission in another course.
- Admin selects it manually.
- System validates automatically.

---

### 🔗 Combo Discount
- Applied if student already enrolled in another course.
- Encourages multi-course admissions.

---

## ⚙️ Discount Engine Logic

System uses **Strategy Pattern**:

```
Admin selects discount
        ↓
Discount Engine validates rules
        ↓
Apply OR return 0 (invalid)
```

This prevents wrong discount usage even if admin selects incorrectly.

---

## ✅ Validation Rules

### General Validation
- Only ONE discount per admission.
- Discount must be within start & end date.
- Batch-specific discounts only apply to that batch.

---

### Group Discount Validation
- Student email must exist in group email list.
- If not → discount = 0.

---

### Individual Discount Validation
- Email must match assigned student email.

---

### Loyalty Validation
- Student must have previous APPROVED admission.

---

### Combo Validation
- Student must already belong to another course.

---

### Approval Validation
- Discount cannot be changed after approval.
- Only admins can approve or reject.

---

## 📊 Analytics Dashboard

Admin can view:

- Total registrations
- Approved / Pending / Rejected
- Total revenue
- Total discounts given
- Course-wise analytics
- Batch-wise analytics

---

## 🔥 Architecture Highlights

- Modular design
- Role-based access
- Strategy Pattern for discounts
- Centralized validation engine
- Scalable REST architecture

---

## 🚀 How to Run Project

### Backend

```
1. Import project into IDE
2. Configure MySQL database
3. Run Spring Boot Application
```

---

### Frontend

```
npm install
npm start
```

---

## 💡 Special Highlights for Judges

- Real-world admission approval workflow
- Enterprise-style discount engine
- Admin-controlled pricing logic
- Clean separation of frontend & backend
- Validation-driven architecture

---

## 🏁 Project Goal

To build a scalable campus operations platform that reduces manual work, 
improves admission accuracy, and supports complex business discount rules.

---

# ⭐ (Judge Impression Tip)

This project demonstrates:

✔ System Design Thinking  
✔ Business Rule Implementation  
✔ Real-world Workflow Automation  
✔ Clean Architecture Principles

---

## 🎤 30‑Second Project Explanation (Judge Pitch)

“CampusOps is a modular campus operations platform that automates student admissions with 
admin-controlled approval and smart discount logic. Students register first, then admins validate and 
apply business rules like group, loyalty, combo, or early-bird discounts using a 
strategy-based discount engine. The system ensures one valid discount per admission, 
prevents misuse through backend validation, and provides real-time analytics 
for revenue, courses, and batches — making admissions faster, safer, and scalable.”
