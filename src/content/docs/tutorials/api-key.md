---
title: API keys
description: An detailed explanation of how to obtain/use your API keys.
---

Generate an API key [at your accounts page](/account).

To authenticate using your API key, add this header to your API requests:

```
Authorization: Bearer YOUR_API_KEY
```

Right now, your API key is only used on routes that require authentication,
otherise it is completely ignored.
