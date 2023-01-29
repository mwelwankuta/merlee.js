<h1 align="center">Merlee.js</h1>
<p align="center"> a lighweight api framework for Node.js</p>

![npm](https://img.shields.io/snyk/vulnerabilities/github/mwelwankuta/merlee.js)
![npm](https://img.shields.io/npm/v/merlee.js)
![npm](https://img.shields.io/npm/dt/start-repo)
![npm](https://img.shields.io/github/license/mwelwankuta/merlee.js)

## Basic Example

```js
const merlee = require('merlee.js');
const app = merlee({ port: 8080, views: 'src/views' });

app.set('static', 'public');

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

app.listen(port => console.log(`listening on port ${port}`));
```

would like to learn more about ejs ? click this [link](https://ejs.co/)

# Installation

This is a Node.js module available on [npmjs](http://npmjs.com/package/merlee.js)
You can install the module with the `npm install` command or the `yarn add` command.

using npm

```sh
$ npm install merlee.js
```

using yarn

```sh
$ yarn add merlee.js
```

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

the above options can also be set like in the example below

```js
app.set('views', 'src/ejs');
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
const Merlee = require('merlee.js');
const { router } = require('./routes/room');
const app = new Merlee();


app.handler(router);
```

# File Structure

| file                            | description                             |
| ------------------------------- | --------------------------------------- |
| [body](./lib/body.js)           | handles request body                    |
| [static](./lib/static.js)       | handles static files                    |
| [fileTypes](./lib/fileTypes.js) | handles content types for static files  |
| [merlee](./lib/merlee.js)       | main file, connectes all above together |

# License

[MIT License](./LICENSE)

# Documentation

[More Detailed Documentaion](./DOCUMENTATION.md)
