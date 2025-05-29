# Natural Language Task Manager

A modern, full-stack web application that converts natural language task descriptions into structured to-do items using OpenAI's API. Built with React, Express.js, and Tailwind CSS.

![Task Manager Screenshot](screenshot.png)

## Features

- **Natural Language Processing**: Convert plain English task descriptions into structured tasks
- **Smart Task Parsing**: Automatically extracts:
  - Task description
  - Assignee
  - Due date/time
  - Priority level
- **Modern UI/UX**:
  - Clean, responsive design
  - Dark mode support
  - Smooth animations
  - Intuitive task management
- **Task Management**:
  - Add, edit, and delete tasks
  - Mark tasks as complete
  - Filter tasks by status and priority
  - Keyboard shortcuts for quick actions
- **Data Persistence**: Tasks are saved in localStorage

## Tech Stack

- **Frontend**:
  - React
  - Tailwind CSS
  - React Icons
  - Axios
- **Backend**:
  - Express.js
  - OpenAI API
- **Development**:
  - Vite
  - Node.js

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/natural-language-task-manager.git
   cd natural-language-task-manager
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

## Running the Application

1. Start the backend server:
   ```bash
   node server.js
   ```
   The server will run on http://localhost:5000

2. In a new terminal, start the frontend development server:
   ```bash
   npm run dev
   ```
   The application will be available at http://localhost:3000

## Usage

1. **Adding Tasks**:
   - Type a natural language task description in the input field
   - Example: "Call client Rajeev tomorrow 5pm urgent"
   - Click "Parse Task" or press Enter
   - The task will be automatically parsed and added to your list

2. **Managing Tasks**:
   - Click the checkbox to mark a task as complete
   - Use the edit button (pencil icon) to modify task details
   - Use the delete button (trash icon) to remove tasks
   - Filter tasks using the dropdown menu

3. **Keyboard Shortcuts**:
   - Enter: Save task or edit
   - Escape: Cancel edit mode

## Task Format Examples

The application understands various natural language formats:

- "Finish report for Anjali by 7pm tomorrow"
- "Schedule meeting with team next Monday 2pm important"
- "Call client Rajeev tomorrow 5pm urgent"
- "Review project proposal by Friday high priority"

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenAI for providing the API
- React and Tailwind CSS communities
- All contributors and users of this project
