# HH Goa 2026 Frame & ID Card Generator 🌴

## About the Project
A web tool where someone uploads a photo and instantly gets back a branded HH Goa 2026 graphic, ready to download and share on X[cite: 2]. Built entirely client-side for maximum speed and user privacy, this application operates in one pass, start to finish, with no login wall or signup gate[cite: 2].

## Features
*   **Format A (PFP Frame/Overlay):** A frame that sits around the uploaded photo, turning it into a ready-to-use X profile picture[cite: 2].
*   **Format B (Builder ID Card):** A card with the uploaded photo, name, stack/role, and a generated "builder title" laid out like an event badge[cite: 2].
*   **Instant Generation:** Upload to finished result is fast (a few seconds, not a loading screen)[cite: 2].
*   **Smart Image Handling:** Supports common formats like jpg, png, and HEIC from iPhones[cite: 2]. It automatically handles portrait, landscape, different aspect ratios, and off-center crops[cite: 2].
*   **Seamless Sharing:** Features a working share flow to X with a pre-filled caption and the `#FrameInGoa` hashtag[cite: 2]. Generated graphics are temporarily hosted to ensure link previews (OG images) display the actual generated image rather than a blank thumbnail[cite: 2].
*   **Mobile-Friendly:** Fully responsive UI designed for users accessing the tool from their phones[cite: 2].

## Tech Stack
*   **Frontend UI:** HTML5, CSS3, Vanilla JavaScript, Bootstrap
*   **Image Compositing:** HTML5 Canvas API
*   **Format Conversion:** `heic2any` (for seamless iOS photo support)
*   **Temporary Hosting (Link Previews):** Cloudinary API (Unsigned Client-Side Uploads)

## How to Run Locally
Because this project relies entirely on client-side technologies, running it locally is completely frictionless:
1. Clone this repository:
   ```bash
   git clone <your-github-repo-url>
