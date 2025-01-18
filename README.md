# Contact Manager Web App

## Project Overview
This project is a **Contact Manager Web Application** developed using the LAMP stack (**Linux, Apache, MySQL, PHP**). It allows users to register, log in, and manage a list of contacts with basic CRUD operations (Create, Read, Update, Delete). The app also includes a search functionality for efficiently finding contacts.

## Features
- User authentication: Registration and Login.
- Contact management: Create, read, update, and delete contacts.
- Search functionality: Search for contacts by name (case-insensitive and partial matches).
- RESTful API: Backend communication with JSON data.
- Hosted on a remote server for accessibility.

## Team Members and Roles
| Name                  | Role                 |
|-----------------------|----------------------|
| **Daliboyina, Hasini** | API Development      |
| **Jerome, Aridsondez** | API Development      |
| **Sachs, Annabel**     | Frontend Development |
| **Gabrielle Coronel**  | Database Management  |

## Tools and Technologies
- **Frontend**: HTML, CSS, JavaScript (Bootstrap, jQuery recommended)
- **Backend**: PHP (RESTful API)
- **Database**: MySQL
- **Hosting**: Remote server (e.g., AWS, Heroku, Azure)
- **Version Control**: GitHub
- **API Documentation**: SwaggerHub

## Requirements
1. **Frontend**
   - Create a responsive UI for user registration, login, and contact management.
   - Implement AJAX requests to interact with the API.

2. **Backend API**
   - Develop endpoints for user registration, login, and CRUD operations for contacts.
   - Use JSON for communication.

3. **Database**
   - Design and maintain the MySQL database.
   - Include an Entity Relationship Diagram (ERD).

4. **Remote Server Hosting**
   - Host the application on a publicly accessible remote server.

5. **Documentation and Presentation**
   - Maintain API documentation using SwaggerHub.
   - Prepare a PowerPoint presentation including a Gantt chart, Use Case Diagram, and ERD.

## API Endpoints
| Endpoint              | Method | Description                  |
|-----------------------|--------|------------------------------|
| `/api/register.php`   | POST   | Register a new user          |
| `/api/login.php`      | POST   | Authenticate a user          |
| `/api/contacts.php`   | GET    | Retrieve all user contacts   |
| `/api/contact.php`    | POST   | Add a new contact            |
| `/api/contact.php`    | PUT    | Update an existing contact   |
| `/api/contact.php`    | DELETE | Delete a contact             |

## Getting Started

### Prerequisites
- PHP installed on your system (use `php -v` to check).
- MySQL database set up.
- A remote server for hosting (e.g., AWS, GoDaddy, etc.).

### Installation
1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd contact-manager-api
   ```
2. Set up the database:
   - Import `db.sql` into MySQL.
3. Configure database connection in `config/db.php`:
   ```php
   <?php
   $host = 'localhost';
   $db_name = 'contact_manager';
   $username = 'root';
   $password = 'your_password';
   ?>
   ```
4. Start the PHP development server:
   ```bash
   php -S localhost:8000
   ```
5. Test the API endpoints using Postman or SwaggerHub.

## Contributing
All team members contribute to the development and maintenance of the project. Responsibilities include:
- **API Developers**: Creating and documenting endpoints.
- **Frontend Developer**: Building and styling the user interface.
- **Database Manager**: Maintaining and optimizing the database schema.

## License
This project is licensed under the MIT License.

## Acknowledgments
- **Instructor**: Rick Leinecker
- **Teaching Assistants**: Ghulam Mohiuddin and Maryam Kebari

