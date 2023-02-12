# YouJitsuBR :: backend

This is the repo that powers the backend of YouJitsuBR, written
using [Next.js][1].

[1]: https://nextjs.org/

## Setting up

The project uses [Yarn Classic][2] to manage its dependencies, so go get it if
you haven't yet. You're also going to need [Node.js][3], since Yarn uses it.

[2]: https://classic.yarnpkg.com/
[3]: https://nodejs.org/

Then, run `yarn install` to fetch all the dependencies.

Also, don't forget to set up the environment: copy `.env.example` to
`.env.local` and start filling it with suitable values. You may wish to contact
a fellow developer for production values.

Once you set up your environment, run `yarn dev` and work your magic.

## Deploying to production

Run `yarn prod` and the server will be ready.

## Other things you should know

- This project makes use of `lint-staged`, which will check for and try to fix
  linting errors before committing code. While it's possible to temporarily
  disable this behavior, it's not recommended.

- I haven't tried yet to run the project on a Windows machine, i.e., outside of
  WSL, so you may want to install it if problems arise.
