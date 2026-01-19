Front-End Mockup (UI Planning)

Before starting to code, I planned the front-end structure of the application to clearly understand what pages and components were needed and how data would flow through the app. This helped me avoid confusion later and made the implementation easier.

Pages (Routes)

The application has three main pages:

Register Page
Allows a new user to create an account.

Login Page
Allows an existing user to log in and receive an authentication token.

Dashboard Page (/app)
The main page of the application where the user can view and manage their expenses.

Dashboard Layout

The dashboard is designed to be simple and clear:

A header showing the application name and a logout button

A summary section displaying the total amount spent

A form to add a new expense (amount, category, date, optional note)

A list of all the user’s expenses, with options to edit or delete each one

This layout keeps all important information visible without unnecessary complexity.

React Components

The front end is broken down into reusable React components:

Page components

LoginPage

RegisterPage

DashboardPage

Dashboard components

Header

Summary

ExpenseForm

ExpenseList

ExpenseItem

Each component has a single responsibility, which makes the code easier to read and maintain.

Component Hierarchy

The planned component structure is:

App
 ├─ Header
 └─ DashboardPage
     ├─ Summary
     ├─ ExpenseForm
     └─ ExpenseList
          └─ ExpenseItem

State Management Plan

State is placed based on how it is shared between components:

User authentication state is stored at the top level so it is accessible throughout the app.

Expenses state is stored in the DashboardPage because it is shared between the summary, form, and list.

Individual components such as ExpenseItem only handle local UI state (for example, edit mode).

I followed the principle of keeping state as high as needed, but as low as possible to keep components predictable and reusable.

Why This Approach

Planning the UI and component hierarchy before coding helped me:

understand the structure of the app clearly

decide where state should live

reduce unnecessary refactoring later

make the application easier to explain in interviews