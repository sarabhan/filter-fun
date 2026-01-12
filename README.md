# Real-Time Face Filter System 

A browser-based real-time face filter system built as a computer vision engineering exercise

This project uses **MediaPipe FaceMesh only as a landmark sensor** and implements **custom geometry, stabilization, and rendering logic** on top of it.  
The primary goal is to understand and build **robust real-time face tracking pipelines** under practical constraints.


## ✨ Features

- Live webcam input (browser-based)
- Face landmark detection (MediaPipe FaceMesh – sensor only)
- Custom face geometry:
  - Face center estimation
  - Scale estimation from inter-ocular distance
- Temporal stabilization using **One Euro Filter**
- Glasses overlay rendering with correct:
  - Position
  - Scale
  - Mirroring alignment
    
## 🎯 Project Philosophy

> **This is not a Snapchat clone.**

The goal is to:
- Understand real-time CV pipelines
- Work with noisy landmark data
- Handle coordinate systems & mirroring
- Implement stabilization correctly
- Identify and remove mathematically incorrect features

Every component is designed to be modular, inspectable, and replaceable.

## 🛠️ Tech Stack

- **Frontend**: React + Vite
- **Computer Vision**:
  - MediaPipe FaceMesh (landmarks only)
- **Rendering**: HTML5 Canvas
- **Stabilization**: One Euro Filter
- **Language**: JavaScript

## 🚀 Steps to Run:

### 1️⃣ Install dependencies

```
cd client
npm install
```
### 2️⃣ Start development server
```
npm run dev
```
### 3️⃣ Open browser
http://localhost:5173

