# the_phd_citation_tool
PhD Citation Assistant is a React-based web application designed to help PhD students and academic researchers write synopses, thesis drafts, and papers more efficiently with real-time citation recommendations. It features a powerful rich text editor, live citation suggestions via @mention, document customization options, and multiple export format
⚙️ Key Features
📝 Rich Text Editor powered by @mantine/rte

🔍 Smart Citation Suggestions using @mention functionality (@keyword)

Fetches real-time results via backend API from Open Library or custom database

📄 Export Options

Save as .docx using docx + file-saver

Save as .html via blob generation

💡 Word & Character Count

Automatically updates as you type

💾 Auto-Save

LocalStorage persistence to avoid accidental data loss

⚙️ Document Settings Modal

Change default font family, size, and text color

🎯 Success Animation

Visual feedback after inserting a citation

🔐 Safe React Hooks Usage

Built with modular, clean, and reusable React components

🛠️ Tech Stack
Technology	Purpose
React.js	Frontend framework
@mantine/core	UI components and modal system
@mantine/rte	Rich Text Editor (WYSIWYG)
axios	API calls to citation backend
Open Library API (via backend)	Fetch book/author info
docx + file-saver	Export content as .docx files
localStorage	Store document drafts persistently

📂 Folder Structure (High Level)
scss
Copy
Edit
📁 src
 ┣ 📄 App.js              ← Main editor logic and layout
 ┣ 📄 SuggestionDropdown.jsx ← Handles citation dropdown UI
 ┣ 📁 assets               ← (Optional) Icons or static files
 ┗ 📄 index.js            ← Entry point
💻 How to Run
Clone the repository:

bash
Copy
Edit
git clone https://github.com/Chanchala9876/the_phd_citation_tool.git
cd phd-citation-tool
Install dependencies:

bash
Copy
Edit
npm install
Start the development server:

bash
Copy
Edit
npm start
Make sure the citation backend (Node.js or similar) is also running locally on port 5000.

