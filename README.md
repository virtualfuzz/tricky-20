# tricky-20

Work in progress...

## making_an_account

get username from platform oauth is the best option overall github / codeberg
(not inside of auth.js) gitlab / google / ask for other options (on simpleX)
api key

- currently making soem kind of api key system

maybe we use the email and platform  for auth???


## user routes

/api/v1/profiles (get every user_id/platform) /api/v1/profiles/platform/ (get
every user_id from platform) /api/v1/profiles/platform

## user_database

platform: github/gitlab/codeberg/etc user_id: user id of the user from the oauth
platform username? update other things then solutions { { puzzle_id,
sha512sum_of_his_solution (append his user_id to the solution) } }

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
