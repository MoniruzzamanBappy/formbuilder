# Form Builder

A web‑based, drag‑and‑drop form builder application built with React, Wouter, React Query, React DnD, Shadcn‑UI & Tailwind CSS. Visually design custom forms by adding, arranging, and configuring fields and fieldsets, then save or export your form schema via a REST API.

---

## 🚀 Features

- **Field Palette**  
  A sidebar of draggable “palette” items (Text, Number, Dropdown, Radio, Checkbox, Date, Label, Textarea).  
- **Drag & Drop**  
  • Drop palette items onto the canvas to auto‑create a new fieldset or add to an existing one  
  • Reorder fields within a fieldset, move fields between fieldsets  
  • Reorder entire fieldsets  
- **Properties Panel**  
  Click any field or fieldset to edit its properties (name, label, options for multi‑choice fields, etc.)  
- **Duplicate & Delete**  
  Quickly duplicate or delete individual fields  
- **Save & Draft**  
  • Save your form (POST to your API endpoint) or save as draft  
  • “Last saved” timestamp in the header  
  • Toast notifications for success/error via Sonner  
- **Load Existing Form**  
  On load, fetch your saved form schema (GET from your API) and hydrate the canvas  
- **Responsive Layout**  
  Works across desktop and mobile viewports  

---

## 🛠 Tech Stack

- **Framework & Rendering**: React + Wouter  
- **Data Fetching**: @tanstack/react-query  
- **Drag & Drop**: react-dnd + HTML5 backend  
- **UI Library**: Shadcn‑UI primitives (Toast, Tooltip, Buttons, Inputs, Selects)  
- **Icons**: Lucide‑React  
- **Styling**: Tailwind CSS  
- **State Management**: React Context + useReducer  

---

## ⚙️ Usage

1. **Add Fields**
Drag a field type from the Custom Field sidebar onto the white canvas.

2. **Reorder / Move**
• Drag the handle to reorder within a fieldset
• Drop between fieldsets or onto the canvas to create/move fields & fieldsets

3. **Edit Properties**
Select a field or fieldset to edit its name, label, and––for multi‑choice fields––its options.

4. **Duplicate / Delete**
Use the duplicate (copy) or trash icons on each field.

5. **Save / Draft**
Click Save Form or Draft in the footer. A toast will confirm success or error.

6. **Load Existing**
On page load, any previously saved form (via your API) will automatically load into the canvas.

## ✍️ Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/MoniruzzamanBappy/formbuilder.git
   cd formbuilder
2. **Install dependencies:**

   ```bash
   npm install
3. **Run the development server:**

   ```bash
   npm run dev