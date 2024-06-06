# Klotski Solver UI

## Overview

This repository hosts the frontend for a Klotski puzzle solver, part of a series of projects evolving from a simple CLI tool to a fully interactive web application.

### Background

During the pandemic, I developed a keen interest in [Klotski puzzles](https://en.wikipedia.org/wiki/Klotski), a type of sliding block puzzle. My journey started with crafting a C++ program to find optimal solutions, which I later transformed into a CLI tool. You can explore the CLI version [here](https://github.com/samrroyall/klotski-cpp).

### Evolution of the Frontend

#### Version 1: Initial Web App
Initially, the frontend was a React application, porting my original solver from C++ to TypeScript. This version allowed users to generate puzzles and visualize automated solutions. Check out this version [live](https://samrroyall.github.io/klotski-solver) or view the [source code](https://github.com/samrroyall/klotski-solver).

#### Version 2: Enhanced Interactivity
To improve user engagement, I added features enabling users to manually attempt puzzle solutions. Enhancements included a streamlined user experience and board randomization. Explore this iteration [live](https://samrroyall.github.io/klotski/) or visit the [release page](https://github.com/samrroyall/klotski/releases/tag/v0.2.5) for source details.

#### Version 3: Backend Integration
The latest version offloads much of the app’s logic to an API developed using Rust's Axum framework, focusing on improving performance and scalability. The API's code is available [here](https://github.com/samrroyall/klotski-api).

## Repository Structure

- `src/components/`: Contains React components for the user interface.
- `src/features/`: Manages application state, categorized into:
    - **Board**: Manages state related to the game board.
    - **Algo Solve**: Manages state for the algorithmic solution process provided by the backend API.
    - **Manual Solve**: Manages state for user-driven puzzle solving.
- `src/models/`: Defines data models used across the application.
- `src/services/api.ts`: Includes methods for API interactions, facilitating communication with the backend.

## Usage

In order to run the frontend locally, you must first follow the instructions to run the backend API locally. Those instructions can be found [here](https://github.com/samrroyall/klotski-api/blob/main/README.md).

Once the backend is successfully running, navigate to the root of the frontend repo's directory and run `cp .env.template .env` and minimally fill in the address to the backend API (e.g. `http://localhost:8081`).

Then run `docker compose up --build` and the frontend will be accessible at `http://localhost`.
