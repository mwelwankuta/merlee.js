<h1 align="center">merlee.js</h1>
<p align="center"> a lighweight api framework for Node.js</p>

![npm](https://img.shields.io/snyk/vulnerabilities/github/mwelwankuta/merlee.js)
![npm](https://img.shields.io/npm/v/merlee.js)
![npm](https://img.shields.io/npm/dt/start-repo)
![npm](https://img.shields.io/github/license/mwelwankuta/merlee.js)

# Welcome to merlee.js!

merlee.js is a backend nodejs rest api framework that lets you focus on the backend web fundamentals to deliver a simple and resilient apis that deploy to any Node.js server environments

# Table of Contents

- [Dislaimer](https://github.com/mwelwankuta/merlee.js/blob/main/DOCUMENTATION.md#disclaimer)
- [Prerequisites](https://github.com/mwelwankuta/merlee.js/blob/main/DOCUMENTATION.md#prerequisites)
- [Installation](https://github.com/mwelwankuta/merlee.js/blob/main/DOCUMENTATION.md#installation)
- [Hello World Example](https://github.com/mwelwankuta/merlee.js/blob/main/DOCUMENTATION.md#hello-world-example)
- [Basic Routing](https://github.com/mwelwankuta/merlee.js/blob/main/DOCUMENTATION.md#basic-routing)
- [Middleware](#middleware)
- [App Options](https://github.com/mwelwankuta/merlee.js/blob/main/DOCUMENTATION.md#app-options)
- [Serving Static Files](https://github.com/mwelwankuta/merlee.js/blob/main/DOCUMENTATION.md#serving-static-files)
- [Contributing](#contributing)
- [File Structure](#file-structure)
- [About the Author](https://github.com/mwelwankuta/merlee.js/blob/main/DOCUMENTATION.md#author)

## Disclaimer

**merlee.js** is provided as-is, without any warranty or guarantee of fitness for any particular purpose. While efforts have been made to ensure the reliability and accuracy of the software, the developers cannot be held responsible for any damages or liabilities arising from the use of this software.

Please use **merlee.js** responsibly and ensure that you understand its capabilities and limitations before integrating it into your projects. Additionally, keep in mind that **merlee.js** may be subject to changes and updates, so it's recommended to stay informed about the latest developments and updates.

By using **merlee.js**, you agree to the terms and conditions outlined in the [MIT License](./LICENSE). If you have any questions or concerns, please don't hesitate to reach out to the developers or consult the documentation.


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
import merlee from 'merlee.js';
const app = merlee({
  port: 3000,
});

app.handler({ method: 'GET', path: '/' }, (req, res) => {
  res.send('Hello World');
});

app.listen((port) => console.log('listening on port:', port));
```

currently undefined routes juts hang, and do not send backend a response.
The example above is a fully working server and when http://localhost:3000 is visited the server send backend a 200 response with `Hello World`

both thr `req` and `res` objects are the same objects that nodejs http provides but with a few modifications.

# Basic Routing

The following examples illustrate how defining endpoints in merlee.js work

`app` is an instance of the Merlee Class

```js
app.handler({ method: 'GET', path: '/' }, (req, res) => {
  // code goes here...
});
```

Real world projects often have different routes in different directories because of this merlee.js has an inbuilt routing system. to use the merlee.js router

- create a new javascript file that has a function that returns an objects of objects that have router configuration. For example

```js
// routes.js
function routes() {
  return {
    get: {
      path: '/users/friends',
      callback(req, res) {
        // do something
      },
    },
    post: {
      path: '/users/friends',
      callback(req, res) {
        // do something
      },
    },
  };
}
```

# Middleware

The following examples illustrate how middleware can be used

```js
const app = merlee({
  port: 3000,
  middleware: [checkAuth, checkSubscription],
});

app.handler({ method: 'GET', path: '/', middleware: [isAdmin] }, (req, res) => {
  // code goes here...
});
```

the method used on the endpoint is defined by the name of the key.

# App Options

to pass app options use the `set()` method. the Merlee object has a set method which you could use to set global options for your apps. some inbuilt options `port`, `static`, `views`

| option | description                             |
| ------ | --------------------------------------- |
| port   | sets a port that the server runs on     |
| views  | sets a path to the ejs files directory  |
| static | serves files in the directory as static |

Below is an example of how to pass app options

```js
const app = merlee({ port: 3000 });
```

app options can be set by passing them directly to the Merlee class. For example

```js
const app = merlee({ port: 3000 });
```

# Serving Static Files

To serve static files such as css, images or other types of files. set the app option static to the directory you would like to be served by the server. Below is an example of how to set the static method

```js
const app = merlee({ static: './public' });
```

now all the files in the `public` directory are served as static files.
now the files can be access:

```
http://localhost:3000/public/style.css
http://localhost:3000/public/app.js
http://localhost:3000/public/cat.png
```

## Basic Example

```js
import merlee from 'merlee.js';
const app = merlee({ port: 8080, views: 'src/views', static: 'public' });

//  get request
app.handler({ path: '/', method: 'get' }, (req, res) => {
  res.send('Hello World!');
});

app.handler({ path: '/home', method: 'get' }, async (req, res) => {
  const posts = await Posts.find({});

  // supports ejs out of the box;
  res.render('home', { posts });
});

// post request
app.handler({ path: '/', method: 'post' }, (req, res) => {
  res.send({ ...req.body }, 201);
});

app.listen((port) => console.log(`listening on port ${port}`));
```

would like to learn more about ejs ? click this [link](https://ejs.co/)

# Creating an app

to initialize a new app

```js
const app = merlee({ port: 8080 });
```

the following methods can be passed to the app object
|method|description |
|------|------------------------------|
|`port` | sets port for server to run on |
|`views` | sets path to ejs views folder |
|`static` | sets directory for static files |

## giving the app options

```js
const app = merlee({
  port: 8080,
  views: 'src/ejs',
  static: 'public',
});
```

# handling requests

```js
app.handler({ path: '/', method: 'get' }, (req, res) => {
  // req object - get data from client
  // res object - sends data to client
});
```

| req      | description                    |
| -------- | ------------------------------ |
| `body`   | contains form or json data     |
| `params` | contains url search parameters |

# handling responses

responses (`send`, `sendFile`, `render`)
| res | description |
| ---------- | ---------------------------------- |
| `send` | responds with json data |
| `render` | sends processed ejs file to client |
| `sendFile` | sends file to client |

# routing

creating a router

```js
// # routes/room.js
module.exports = const router = () => {
  return {
    get:{
      path:'/room',
      callback(req, res){
        res.send('hello from the router')
      }
    },
    post:{
      path:'/room',
      callback(req, res){
        res.send(req.body)
      }
    }
  }
}

// # server.js
import Merlee from 'merlee.js'
import {router} from './routes/room'
const app = new Merlee();


app.handler(router);
```

# Contributing

feel free to contribute and make merlee.js a better package.

# File Structure

| file                            | description                             |
| ------------------------------- | --------------------------------------- |
| [body](./lib/body.js)           | handles request body                    |
| [static](./lib/static.js)       | handles static files                    |
| [fileTypes](./lib/fileTypes.js) | handles content types for static files  |
| [merlee](./lib/merlee.js)       | main file, connectes all above together |

# License

[MIT License](./LICENSE)

# License

this project is [MIT Licensed](./LICENSE)

# Author

- Twitter [@mwelwankuta](https://twitter.com/mwelwankuta)
- Instagram [@mwlnka](https://instagram.com/mwlnka)
- LinkedIn [in/mwelwa](https://linkedin.com/in/mwelwa)
