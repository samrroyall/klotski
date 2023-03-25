# README

### Description

Klostki is a React app that allows users to create, solve, and view solutions for [Klotski](https://en.wikipedia.org/wiki/Klotski) puzzles. This app started out as a simple front end - deployed [here](https://samrroyall.github.io/klotski-solver) - for a [C++ CLI program](https://github.com/samrroyall/klotski-cpp) I wrote that finds optimal solutions for Klotski puzzles. In this first attempt at a front end, the user could build puzzles and watch them be solved. In this new iteration, I allow the user to have the option to solve the puzzles him or herself. I have also streamlined the user experience and included other quality of life improvements, including the addition of board randomization.

### Useful information

The algorithm that finds optimal solutions to the puzzles can be found in `src/models/Solver.ts`. The models used by the algorithm and the front end can be found in the other files in `src/models/global.ts`.

Front end components can be found in `src/components/`. The state (Redux) used by these components can be found in the `src/state/` directory.
