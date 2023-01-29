# Welcome to merlee.js!
merlee.js is a backend nodejs rest api framework that lets you focus on the backend web fundamentals to deliver a simple and resilient apis that deploy to any Node.js server environments

This repository contains the merlee.js source code. This repo is a work in progress. and more features are being implemented such as 

- TypeScript support
- Middleware support

# Table of Contents
- [Dislaimer](https://github.com/mwelwankuta/merlee.js/blob/main/DOCUMENTATION.md#disclaimer)
- [Prerequisites](https://github.com/mwelwankuta/merlee.js/blob/main/DOCUMENTATION.md#prerequisites)
- [Installation](https://github.com/mwelwankuta/merlee.js/blob/main/DOCUMENTATION.md#installation)
- [Hello World Example](https://github.com/mwelwankuta/merlee.js/blob/main/DOCUMENTATION.md#hello-world-example)
- [Basic Routing](https://github.com/mwelwankuta/merlee.js/blob/main/DOCUMENTATION.md#basic-routing)
- [App Options](https://github.com/mwelwankuta/merlee.js/blob/main/DOCUMENTATION.md#app-options)
- [Serving Static Files](https://github.com/mwelwankuta/merlee.js/blob/main/DOCUMENTATION.md#serving-static-files)
- [About the Author](https://github.com/mwelwankuta/merlee.js/blob/main/DOCUMENTATION.md#author)


# Disclaimer
- This is a work in progress and should not be used in production

# Prerequisites
- [Nodejs](https://nodejs.dev/) a free, open-sourced, cross-platform JavaScript run-time environment that lets developers write command line tools and server-side scripts outside of a browser.

# Installation 
Assuming your already have [Nodejs](https://nodejs.dev/) installed on your machine. create a directory to hold your application. and change directory into the newly created directory

```
$ mkdir my-app
$ cd my-app
```
Use the `npm init` command to create a `package.json` file for your project
```
$ npm init
```

Now install merlee.js into the directory you just. For Example
```
$ npm install merlee.js
```

# Hello world example
```js
const merlee = require('merlee.js');
const app = merlee();

app.set('port', 3000)

app.handler({method:'GET', path:'/'}, (req, res) => {
    res.send('Hello World')
})

app.listen(port => console.log('listening on port:', port))

```

currently undefined routes juts hang, and do not send backend a response.
The example above is a fully working server and when http://localhost:3000 is visited the server send backend a 200 response with `Hello World`

both thr `req` and `res` objects are the same objects that nodejs http provides but with a few modifications.   

# Basic Routing
The following examples illustrate how defining endpoints in merlee.js work

`app` is an instance of the Merlee Class
```js
app.handler({method:'GET', path:'/'}, (req, res) => {
    // code goes here...
})
```
Real world projects often have different routes in different directories because of this merlee.js has an inbuilt routing system. to use the merlee.js router
- create a new javascript file that has a function that returns an objects of objects that have router configuration. For example
```js
// routes.js
function routes(){
    return {
        get:{
            path:'/users/friends',
            callback(req, res) {
                // do something
            }
        },
        post:{
            path:'/users/friends',
            callback(req, res) {
                // do something
            }
        }

    }
}
```
the method used on the endpoint is defined by the name of the key. 

# App Options
to pass app options use the `set()` method. the Merlee object has a set method which you could use to set global options for your apps. some inbuilt options `port`, `static`, `views`


| option | description |
|-|-|
| port| sets a port that the server runs on|
| views| sets a path to the ejs files directory|
| static| serves files in the directory as static|


Below is an example of how to pass app options
```js
const app = merlee()
app.set('port', 3000)
```

app options can be set by passing them directly to the Merlee class. For example
```js
const app = merlee({port: 3000})
```

# Serving Static Files
To serve static files such as css, images or other types of files. set the app option static to the directory you would like to be served by the server. Below is an example of how to set the static method
```js
const app = merlee({static: './public'})

// or

app.set('static', './public')
```
now all the files in the `public` directory are served as static files.
now the files can be access:
```
http://localhost:3000/public/style.css
http://localhost:3000/public/app.js
http://localhost:3000/public/cat.png
```

# Contributing
feel free to contribute and make merlee.js a better package.

# License
this project is [MIT Licensed](./LICENSE)

# Author

- Twitter [@mwelwankuta](https://twitter.com/mwelwankuta)
- Instagram [@mwelwa_nkuta](https://instagram.com/mwelwa_nkuta)
- Facebook [mwerwa](https://facebook.com/mwerwa)
- LinkedIn [in/mwelwa](https://linkedin.com/in/mwelwa)
