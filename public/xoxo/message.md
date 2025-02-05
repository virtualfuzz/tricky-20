# hiyaaaaaa!!!

this is my way to say hi to you forest!

more seriously though, let me tell you about hashing!

## problem of not using hashing

so what is hashing you may ask, let me tell you a story:

"this is the story of a banking company, the banking company wants to create
accounts for it's users. question is, how can the banking company store the
accounts?

they decide to simply store the accounts by storing a username and password in
plain text

everything goes well and runs smoothly until a few years later, when they get
hacked and the hackers release every username and password they had. this
destroys the reputation of the company and they lose lots of money."

## problem with hashing and how do we fix it!

now see the problem? the problem is since they stored the password in plain text
(which means by simply storing it like that), anyone with access to the database
(place where the info is stored) can easily see the password of everyone!

lets see how they fix it!

"the company, not wanting to lose reputation again, decides it needs to find a
reliable way to store passwords without having the risk of the plain text
password being leaked.

they decide to now store passwords by **hashing** them, every password will now
be hashed, this way, anyone with the hash of the password will not be able to
guess the password from it (not really, but lets keep this simple).

the company can still check if the user put the right password by hashing the
password the user gave and checking it if its the same as the one saved"

## more explicit explanation of hashing

alright you might have been a tiny bit lost during the hashing part, let me
explain it more

a hashing function is basically some fancy math that takes some input and turns
it into a mess (it hashes it, no it's not a pun, that's what it does). for
example `verysafepassword` would turn into
`294fb81e9f6f1bd91cb77749c7bbfa679ddbd1e7d848426d05595d36d0c87875`

another important part of a hashing function is that if the original input
changes a tiny bit, the output string should change drastically too.
`verysafePassword` would turn into
`d8c05827ecf28942acbce133e566dd7d079640b761159d8c47a2c705524b7d70`

in order for a hashing function to be "cryptographically secure", as in, secure
enough to store a password, it also has to not be reversable, as in, we should
not be able to guess that the
`659903aee7959754c07e1f76f9fbb45ecbee1fce09ae12b163fb94845e3b60c9` came from the
text `verysecretmessagefrommyself`. Otherise, we'll be able to just reverse the
passwords from their hash and we would be back at square one!

## small info

just so you know, the hashing algorithm that i used in the example was `sha256`,
though if you want to actually store passwords securely you should use another
one like `yescrypt` or `argon2`, there are others too, just search it up.

## omg i just nerded out

haha yeah yipee, you told me you wanted to learn computers im teaching you
computers!

sorry if its too long or anything like that but hey i love talking about that,
your also i think the only one who ever talked to me about learning that so it's
amazing talking about that to you forest!

okay let's keep this short, i'll try to make the next one shorter i swear!
