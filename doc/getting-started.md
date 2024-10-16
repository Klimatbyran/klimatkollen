# Getting started

Klimatkollen is for the most part a self-contained web application. This means you can run it on your own computer and see your own copy in your web brower. This page will outline how to do that from scratch. If you haven't done some of these things before, it might feel like a long process before you get to launch the page. Almost all of it is one-time setup, meaning once you get through it, contributing in the future is much easier.

If you're looking to contribute code, some basic knowledge of HTML, CSS and JS is recommended. [freeCodeCamp](https://www.freecodecamp.org/) is a great place to learn these fundamentals.

The steps will be as follows:

 * Installing Node.js
 * Getting the source code
 * Installing other dependencies
 * Our frontend technologies
 * Running Klimatkollen

If you get stuck at any point, don't hesitate to ask on the Discord which is linked in the main README. Really - we want to help!

## Installing Node.js

Klimatkollen is written mostly in JavaScript. To execute JavaScript directly on your computer, you need [Node.js](https://nodejs.org/en). Just press the big "download" button and follow the instructions. After the installation, start a new terminal or command prompt to verify that it went well. You should be able to run the commands "node" and "npm" successfully. Just remember to start a *new* terminal.

## Getting the source code

Klimatkollen is open source and the source code is hosted on [GitHub](https://github.com/Klimatbyran/klimatkollen). The absolute easiest way to get it is to just press the big green "Code" button on that page and select "Download ZIP". If you don't plan on making any of your own contributions, this is enough and you can skip to the next section.

If you do want to contribute code, or even check out other people's work-in-progress, you will need to use [git](https://git-scm.com/), which is a system that manages source code history and enables collaboration. If you're not familiar with git, here are some links that can get you started. Don't feel like you have to spend a lot of time learning git. A basic understanding is enough to get by in most cases.

 * https://docs.github.com/en/get-started/using-git/about-git
 * https://www.w3schools.com/git/git_intro.asp?remote=github
 * https://git-scm.com/

There are many ways to use git and everyone has their favorites. One suggestion is to use [GitHub Desktop](https://docs.github.com/en/desktop) which is a quick and simple way to get started. The following guide shows you how to "clone" a "repository" with GitHub Desktop. The term "clone" means to download a copy that is managed by git, and a "repository" is what we call that copy, both locally and on GitHub.

 * https://docs.github.com/en/desktop/adding-and-cloning-repositories/cloning-a-repository-from-github-to-github-desktop

No matter if you use the Desktop app, ZIP, or some other method, you need to have a copy of the code somewhere on your computer in the end. The rest of the instructions assume you have located that directory and moved inside it using a terminal. 

## Installing other dependencies

To build and run Klimatkollen, some dependencies are required apart from Node.js itself. The main ones are as follows: 

 * [React](https://react.dev/)
 * [Next.js](https://nextjs.org/)
 * [Chart.js](https://www.chartjs.org/)

The full list is in "package.json" which is a file that npm can understand. To have it install all of the dependencies at the right versions, run `npm ci`.

## Running the Klimatkollen webapp. 

If all the dependencies were installed without issues, you should be able to run `npm run dev`. This will de a little slow the first time, but if everything goes well it will tell you it is serving the app from "localhost:3000". Type that address in your browser and you should see your local copy of Klimatkollen in its full glory!