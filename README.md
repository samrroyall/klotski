# README

### Description

Klostki is a very simple SPA. There are no routes. This app started out as a [simple front end](https://github.com/samrroyall/klotski-solver) - deployed [here](https://samrroyall.github.io/klotski-solver) - for a [C++ CLI program](https://github.com/samrroyall/klotski-cpp) I wrote that solves Klotski puzzles. The user could build puzzles and watch them be solved. I decided to take a second stab at this and allow the user to have the option to solve the puzzle him or herself.

### Useful information

The algorithm that underlies all of this can be found in `src/models/Solver.ts`. The models that this algorithm uses can be found in the other files in `src/models/`.

Front end components can be found in `src/components/`. The state (Redux) used by these comonents can be found in the `src/state/`.
