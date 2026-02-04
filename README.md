
# ClipVault: Your Personal Video Storage and Sharing App

## Overview

ClipVault is a simple, client-side web application designed to help you store, organize, and quickly share your favorite video links. Whether it's a tutorial, a funny clip, or a family memory, ClipVault allows you to save video URLs, categorize them, add notes, and instantly generate a shareable QR code for easy access on the fly.

This app runs directly in your browser, using your browser's local storage to save all your videos and collections. This means your data stays on your device, and no internet connection is required to view your stored clips once the app is loaded.

## Features

*   **Store Video Links:** Easily save video URLs (YouTube, Vimeo, or any link), titles, and optional notes.
*   **Organize with Collections:** Create custom categories (e.g., "Work," "Family," "Events") to keep your videos neatly organized.
*   **Search and Filter:** Quickly find videos by searching titles and notes, or by filtering through your collections.
*   **Integrated Video Viewer:** Watch embedded YouTube and Vimeo videos directly within the app. Other links are displayed as external links.
*   **Instant QR Code Sharing:** Generate a unique QR-like code for any selected video, allowing others to scan and view the video on their own device instantly.
*   **Copy Link Functionality:** Easily copy the video's URL to your clipboard for sharing via message, email, or social media.
*   **Accent Colors:** Assign a unique accent color to your videos for better visual organization.

## How to Use ClipVault

### 1. Adding and Organizing Videos

1.  **Open the App:** Navigate to your ClipVault app in your web browser.
2.  **Fill the "Add New Clip" Form:**
    *   **Title:** Enter a descriptive title for your video.
    *   **URL:** Paste the link to your video (e.g., from YouTube, Vimeo, or any other source).
    *   **Notes (Optional):** Add any personal notes or descriptions for the video.
    *   **Select Collection:** Choose an existing collection from the dropdown menu (e.g., "Work," "Family," "Events").
    *   **New Collection:** If you need a new category, click the **`+ New Collection`** button next to the dropdown, enter a name, and it will be added.
    *   **Accent Color:** Select a color that will visually tag your video.
3.  **Add Clip:** Click the **`Add Clip`** button. Your video will appear in the main list.

### 2. Viewing and Sharing Videos

1.  **Select a Video:** In the main video list on the left, click on any video title.
2.  **View Details:** The right-hand panel ("Now Playing") will update to show:
    *   An embedded video player (for YouTube/Vimeo links).
    *   The video title, notes, collection, and save date.
3.  **Generate QR Code:** Below the video viewer, a unique QR-like code will be generated based on the video's URL.
    *   To share, simply have someone **scan this code** with their phone's camera or a QR code scanner app. It will open the video directly in their browser or YouTube/Vimeo app.
4.  **Copy Link:** Click the **`Copy Video Link`** button to quickly copy the video's URL to your clipboard, so you can paste it anywhere.

### 3. Browsing and Searching Your Library

1.  **Filter by Collection:**
    *   On the left sidebar, click on the **collection pills** (e.g., "All," "Work," "Family").
    *   The video list will instantly update to show only videos belonging to that collection.
2.  **Search Videos:**
    *   Use the **`Search`** input field at the top of the video list.
    *   Type keywords from the video's title or notes to filter the list. The search updates as you type.

## Browser Compatibility

ClipVault is built using standard web technologies (HTML, CSS, JavaScript) and relies on your browser's `localStorage` for data persistence. It should work well in:

*   **Modern Desktop Browsers:** Google Chrome, Mozilla Firefox, Microsoft Edge, Apple Safari.
*   **Modern Mobile Browsers:** Chrome means:

*   **Your data stays on your device.** Nothing is sent to a server.
*   **Offline Access:** Once the app is loaded, you can view your stored videos even without an internet connection.
*   **Device-Specific:** Data is stored *per device* and *per browser*. Videos saved on your laptop will not automatically appear on your phone unless you manually add them to your phone's browser, or if you deploy the app to a public URL and access it from multiple devices.

## Running the App

### Running Locally (on your computer)

1.  Save `index.html`, `style.css`, and `script.js` into the same folder on your computer.
2.  Open `index.html` directly in your web browser.

### Running Online (Public URL)

For a public URL that you can access from any device, you can host these three static files using services like:

*   **GitHub Pages:** Ideal for public repositories, integrates directly with your GitHub account.
*   **Netlify:** Offers simple drag-and-drop deployment for static sites.
*   **Vercel:** Another popular platform for static site deployment, with good GitHub integration.

---

Enjoy organizing and sharing your videos with ClipVault!

