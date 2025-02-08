---
title: API Reference
description: A reference page in my new Starlight docs site.
---

v1.0.0

Access it though /api/v1/

You can use `curl` to interact with this API though the terminal.

## /api/v1/users

### GET request

Lists every single profile/account

Optional parameters (as GET parameters):

- username: search for a username, case insensitive
- provider: only show accounts with a specific provider, case insensitive
- export: set it to true for it to also include the solved puzzles, doesn't
  really export the whole database, but the interesting things

## /api/v1/users/{USER_ID_HERE}

### GET request

Lists one specific complete user profile, including it's completed puzzles

### POST request

Requires authentification using an [API key](/account).

Used to save completed puzzles inside of your user account/verify if it is a
valid solution.

Required parameters (as JSON):

- puzzleId: the id of the puzzle you solved
- solution: a solution to the puzzle

## /api/v1/puzzles

### GET request

Lists every single puzzles.

Optional parameters (as GET parameters):

- search: search for a puzzle/group of puzzles, case insensitive

## /api/v1/puzzles/{PUZZLE_ID_HERE}

### GET request

Lists one complete puzzle.

### POST request

Verify if your solution to that puzzle is valid.

Required parameters (as JSON):

- solution: a solution to the puzzle
