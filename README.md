<h1 align="center">Merlee.js</h1>
<p align="center"> a lighweight api framework for Node.js</p>

```js
const Merlee = require("merlee.js");
const app = new Merlee({ port: 3000 });

app.handler({ path: "/", method: "GET" }, function (req, res) {
  res.send({ message: "Hello World!", status: 200 });
});

app.listen((port) => console.log(`listening on port ${port}`));
```

# Installation

This is a Node.js module available on [npmjs](http://npmjs.com)
You can install the module with the `npm install` command or the `yarn add` command.

```sh
$ npm install merlee.js
```

# License

[Mit License]()
