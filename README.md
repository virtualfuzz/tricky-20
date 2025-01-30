# tricky-20

This project is still under the demo/showcase phase, and
[I still have some things planned for it](TODO.md).

Tricky 20 is my attempt at making some kind of game that is playable though the
command line.

## Screenshots

These aren't much, since this game is mostly played though the command line.

## Development/Running it

First, you need to have a .env file (that you must **KEEP PRIVATE**), or these
variables defined in your environment.

```env
AUTH_SECRET= # from auth.js create a bunch of random characters and that's it
GITHUB_CLIENT_ID= # github client id for your oauth
GITHUB_CLIENT_SECRET= # github client secret from your github oauth
DATABASE_URL= # the database url, postgresql is recommanded
```

For development, simply run `deno task dev`.

## Security

Please send an email to `skewed-fade-deluxe@duck.com` if you found any security
issues, I will try my best to fix them.

Emails can be encrypted using my
[gpg key](https://keys.openpgp.org/search?q=skewed-fade-deluxe%40duck.com) if
wanted.

Other contact info is availible down in
[my website](https://jayden295.codeberg.page/).

## License

This project is licensed under the [GPL-3.0-or-later](LICENSE.md) .

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with
this program. If not, see <https://www.gnu.org/licenses/>.
