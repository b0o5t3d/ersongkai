# Er Song Kai — Personal Portfolio

Personal portfolio website built with pure HTML, CSS, and vanilla JavaScript. Hosted on GitHub Pages.

## Tech Stack

- HTML5, CSS3, JavaScript (no frameworks or build tools)
- GitHub Pages for static hosting

## Features

- Light / dark mode with system preference detection
- Scroll-reveal animations via IntersectionObserver
- Hero section with blur-on-scroll background
- Frosted glass navigation that adapts between transparent (hero) and opaque (scrolled)
- Click-to-expand modals for all project and leadership cards
- Certificate lightbox viewer for awards and certifications
- Fully responsive layout including mobile-optimised card modals

## Structure

```
index.html      Main page
style.css       All styles and responsive rules
script.js       Scroll behaviour, modals, lightbox, theme toggle
images/         Hero, project, leadership, award, and certificate images
```

## Images

Images are not tracked in this repository. Add the following files to the `images/` folder before deploying:

**Hero**
- `hero-bg.png`

**Projects**
- `project-phishless.jpg`
- `project-ctf.jpg`

**Leadership**
- `leadership-obelus.png`
- `leadership-sp-computing.png`
- `leadership-spsu1.jpg`

**Awards**
- `award-cddc.png`
- `award-lagncrash.jpg`
- `award-aisp.jpg`

**Certifications**
- `cert-oscp.jpg`
- `cert-ewpt.png`
- `cert-ejpt.png`
- `cert-ossa.png`
- `cert-aws.jpg`

## Local Development

No build step required. Open `index.html` directly in a browser, or use any static file server:

```bash
npx serve .
```
