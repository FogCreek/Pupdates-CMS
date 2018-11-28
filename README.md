# Parcel + React

Parcel + React + Glitch = **`BEST.THING.EVER.`**

This is a very simple starter project that uses [Parcel](https://parceljs.org/) to build the client bundle, [Material UI](https://material-ui.com/) as the main React Component library, and [Express](https://expressjs.com/) in the backend.


## How to use this?

You can add more npm libraries in package.json, and use them in both the backend and the frontend. The frontend bundle is built on the fly by Parcel, and it already supports React, JSX, Less, Stylus, CSS etc., so you can focus on writing code instead of configuring your bundler (gone are the days of tweaking webpack.config.js).

If you have the site open on another tab (for example by clicking the `Show` button), you will see that every change you make to the frontend code (files in `frontend/`) is applied immediately on the live site, very quickly. This is possible thanks to the the fact that Parcel integrates Hot Module Reload, which is a shadow websocket server that communicates bundle updates to all the connected browsers.

On the other hand, changes to the backend code (files in `backend/`) require that you refresh the preview manually.


## Some example...?

Sure! This simple demo shows a custom "circular progress indicator". Click the `Show` button to see it. You might want to make it bigger. Let's change it!

1) Remix this project
2) Click `Show` to see the app "preview".
3) Open the file `frontend/index.js`
4) On line 8, change the size parameter to 400.

Here you go! You should now see a bigger indicator in the preview.


## How does it work?

### Parcel

Parcel is doing the heavylifting here. If you don't know what it is, it's probably good that you check out its [website](https://parceljs.org/), but I'll try to describe it quickly here. Parcel is a "bundler", that is: it takes as input a bunch of JS, CSS, HTML files (and more!), and figures out how to create a set of output files (a "bundle") that browsers know how to use.

Parcel begins building its bundle from `frontend/index.html`. There, it sees that a script called `index.js` is required. So it adds `index.js` to its input files, and starts parsing it. In `index.js`, it sees more `require` and/or `import` statements, so it keeps adding those to its "input" files. At a certain point, it will have collected all the inputs: it does a few advanced transformations ("traspiles") of the source code, puts it all together, and creates a big `bundle.js` file (it's not exactly called like that, I just made up a name), and a new `index.html` file that now references `bundle.js` instead of `index.js`, and places them both in the `dist/` directory (not shown because it is in `.gitignore`, but you can see it using the Console).

If you check out `backend/server.js`, you'll see that it's indeed `dist/index.html` that is being served :)

### Parcel watcher

Parcel also has a very cool feature, which is a "watcher": it is a process that runs in the background and updates the bundle when an input file is changed. This allows updates to be applied very quickly! If you check the Logs (in the `Status` pane) after you make a change, you'll notice that Parcel says "Built in 24ms." Or something like that. It is able to update the whole bundle in just a few milliseconds!

Another thing that Parcel watch does for us is telling all the connected browsers when the bundle is changed. It does so by using a Hot Module Reload (HMR) system: it sends bundle updates through a websocket. In order to make this specific thing work on Glitch, we need a special "HMR proxy": it is defined in `backend/utils.js` and used in `backend/server.js`.

### watch.json

By default, Glitch restarts _the entire_ user app when a js file is changed (also json files and a few other file types). This means that the Parcel watcher and HMR would be restarted too :( this would slow down bundle updates quite a bit, and require the developer to manually refresh the preview after every change.

Gladly, this behavior can be customised with a file called `watch.json`. If you look at it in this project, this is exactly what it is doing: it is telling Glitch to only restart the user app when a _backend_ files are changed, or `.env` (the file where you can store your secrets without showing them to the world, even if your project is public).

Additionally, it is telling Glitch to run the install step (npm install) when you change package.json (since you want to get new dependencies if you add them there!).

There is also another setting: `noSavedEvents: true`. By default, Glitch refreshes the preview when a change happens, even if it doesn't trigger a restart or an install. But we don't want that, because the HMR is updating the page for us. That's why we disable the "saved" events, which are the events that cause the preview to be refreshed. You are right... we might probably rename the setting to `autoRefresh: false` ;)

### The `prestart` scripts in package.json

You're very curious! You noticed that we have a strange `prestart` command in `package.json`. What is it? I don't even see it in the editor!

First, the easy part: you don't see it because it is inside a directory that starts with a dot, and that's a Unix/Linux convention to indicate an "hidden" directory. The editor doesn't show hidden directories. This is due to the fact that you don't really need to see or change that file to use this project. But you can still see (and change!) it using the Console.

The `prestart` script runs... before the `start` script. If you check the file that it invokes, `.tools/watch.sh`, you'll see that this file is used to start the Parcel watcher! Here you go: before we start the server (the backend), we start the Parcel watcher :) The script also does some Glitch-specific things to make the HMR work on Glitch, and to make Parcel use less memory, because Glitch only provides 512MB of RAM.

You might have also noticed that the `prestart` script ends with a `&`: it means "run this command in the background": yes, because we don't want the Parcel watcher to "finish" before we start the server! We want the watcher to run in the background, _while_ the server is running.
