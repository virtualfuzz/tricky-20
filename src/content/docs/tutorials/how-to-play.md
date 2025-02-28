---
title: How to Play
description: An detailed explanation of how to play tricky-20.
---

tricky-20 is not an ordinary game, it's more like a bunch of CTF puzzles, where
one twist is that you can only access them through the tricky-20 API, which
makes it a bit more hacker-ish (which is fun).

It is recommanded to read/have the [API reference](/reference/api/).

## Tools you will need

Pretty much a Linux system should be good enough, but if you need a more
detailed guideline, please note that every puzzle has a list of tools required
if you want to know.

## Example gameplay

1. First, get every puzzle at `/api/v1/puzzles/`

```json
{
	"init_1/hashy_hashy": {
		"puzzle_url": "/api/v1/puzzles/init_1/hashy_hashy",
		"puzzle_id": "init_1/hashy_hashy",
		"you_will_learn": "learn how to use sha256/sha512 to solve puzzles"
	},
	"init_1/intro": {
		"puzzle_url": "/api/v1/puzzles/init_1/intro",
		"puzzle_id": "init_1/intro",
		"you_will_learn": "learn how to play this game and interact with an API"
	},
	...
}
```

2. Since I'm starting out, let's do the intro puzzle, I see that the URL for it
   is `/api/v1/puzzles/init_1/intro`, so I go there:

```json
{
  "puzzle_id": "init_1/intro",
  "slug": "init_1/intro",
  "difficulty": "tutorial",
  "requirements": "linux terminal (recommanded) with curl command (or anything to interact with the API!), and a PDF viewer.",
  "you_will_learn": "learn how to play this game and interact with an API",
  "description": "Just open the PDF that you downloaded and follow instructions!",
  "vocabulary": [
    {
      "api": "Application Programming Interface"
    },
    {
      "linux terminal": "A way to interact with a linux system using the terminal"
    },
    {
      "PDF": "Portable Document Format"
    }
  ],
  "hints": [
    "Hints are encrypted using a caesar cipher: zpv dbo bmxbzt tfbsdi vq pomjof xibu epft KTPO nfbo gps fybnqmf, j tfnj-joufoujpobmmz epo'u fyqmbjo fwfszuijoh tp zpv mfbso ipx up tfbsdi uijoht po uif joufsxfct!",
    "Jo dvsm, zpv dbo tfoe ebub vtjoh QPTU xjui uif -e '{variable: value}' pqujpo!"
  ],
  "goal": "Instructions on the poster.",
  "download": "/club/potential-minimal-poster.md",
  "USED_INTERNALLY_salt_of_solution": "im_prepared_im_prepared",
  "USED_INTERNALLY_sha512_of_solution": "02b0f477340ad3ba84f50c3899acb2feb695a9c7d0dcf48be7b1a00768e9309a3c015c2ea7a3df068935d25113d423f4d368ad081863dd3694abe84f603c99fa",
  "how_to_submit": "Submit a solution as a POST request with the same URL your using to get this puzzle.",
  "example_submission": {
    "solution": "I just wish I could see another perspective, one-"
  }
}
```

Okay wow, this is a lot of text, let's just read them one by one, I see some
text with USED_INTERNALLY that I don't really understand, but since it's used
internally, I don't need to understand them.

I notice the description, goal, and download section, these are the most
interesting since they explain how to do it.

I need to download a poster from `/club/potential-minimal-poster.pdf`, I
download the file and open it.

The instructions are literally written in front of me, so I do them and succeed:

```json
{
  "valid_solution": true,
  "message": "You got yourself a valid solution, congrats!"
}
```
