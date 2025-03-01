---
title: Play with saves
description: How to play tricky-20 while saving your progress.
---

If you want to have a public profile/save your progress,
[create an account](/account). Solving the puzzle/getting the puzzle is the same
process, and doesn't require authentication (in fact, authentication attempts
will be ignored if you do it on an API route that doesn't require one).

1. In order to save your progress, once you finished a puzzle, find your user
   profile URL [in your accounts page](/account). (You can also
   [search it using the API and your username](/reference/api/#get-request))

2. Do a [authenticated](/tutorials/api-key) POST request to your user profile
   URL, with the following JSON body:

```json
{
  "puzzleId": "PUZZLE_ID_HERE",
  "solution": "SOLUTION_HERE"
}
```

Your solution will be verified and if valid, will be saved to your profile.
