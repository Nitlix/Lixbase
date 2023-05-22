# Lixbase @1.0.8 [![Node.JS](https://img.shields.io/badge/NODE.JS-blueviolet?style=for-the-badge)](http://modejs.org/) [![MIT License](https://img.shields.io/badge/LICENSE-MIT-brightgreen?style=for-the-badge)]

[![Banner](https://i.imgur.com/lM0hHM9.png)](http://modejs.org/)

A manual sharded and managed NoSQL object-focused database made for the cool kids.
## Built with 💛 by Nitlix

* [Nitlix](https://github.com/nitlix) - The creator of this project


## Installation
Using NPM:
``` 
$ npm i lixbase --save
```
or 
```
$ npm install lixbase --save
```


## Features

<img src="https://i.imgur.com/SdDyQJU.png" width="300" style="border-radius: 1rem"/>
<img src="https://i.imgur.com/RGGp1BR.png" width="300" style="border-radius: 1rem"/>
<img src="https://i.imgur.com/1HYhjXQ.png" width="300" style="border-radius: 1rem"/>
<img src="https://i.imgur.com/1mRk6Mz.png" width="300" style="border-radius: 1rem"/>
<img src="https://i.imgur.com/efEuoHe.png" width="300" style="border-radius: 1rem"/>
<img src="https://i.imgur.com/h6ZHcGD.png" width="300" style="border-radius: 1rem"/>




More added soon.

## Quickstart showcase 
```🥳 showcase.js```

Here is our initial starting file, where we use Lixbase to manage our database files.

```js
import Lixbase from "./src/index.js"


async function main() {
    let client = new Lixbase.Client


    //Custom object - Account
    client.objects.account = {
        id: null,
        type: null,
        data: null,
        created: null
    }

    //Custom object - Session
    client.objects.session = {
        id: null,
        type: null,
        data: null
    }

    //Custom saving directory
    client.dir = 'custom_dir_name'

    //Custom Dynamic ID Generation
    client.format.id = '[SHARD]-[TIME]-[RANDOM]'

    //No autosave
    client.autosave = -1

    //Autosaving every 10 seconds
    client.autosave = 10


    
    //Initialise our client after the configuration
    await client.init("shard_name")

    //Create new account object in the database
    client.addObject('account', {data: 'test', created: Date.now()}) 

    //Create new session object in the database
    client.addObject('session', {data: 'test2'}, 5)

    //Create another session object in the database, just for show
    client.addObject('session', {data: 'test3'}, 5)

    //Brand new query function, like SQL, but on steroids.
    //Returns a dict with objects that match the query function.
    //(Which is matching the data key 'data' to the string 'test')
    //Check out the output!
    console.log(
        client.query(['*'], (data)=>{
            if (data.data == 'test') {
                return true
            }
            return false
        }, ['data', 'created'])
    ) 


    //Save the database file
    client.save()



    // After all of this
    // check out /custom_dir_name/shard_name.json!
    // Good luck developing!
}


main()
```

<!-- <img src="https://i.imgur.com/w1yBrgr.png" width="400" style="border-radius: 1rem" /> -->

<br /> 

```✅ The output JSON```

The file used to store and manage our database's object located at **(custom_dir_name/shard_name.json).**



<img src="https://i.imgur.com/jq2HbjE.png" width="600" style="border-radius: 1rem"/>




# 😎 Documentation
Lixbase is assumed to be imported as "Lixbase" using
```js
import Lixbase from "lixbase"
```



## Client
Initialise using:
```js
let client = new Lixbase.Client
```


## Client Properties

<br />

### Data
```js
client.data
// The raw JSON data of your database.
// Can be edited:
client.data.id['hello'] = 'world'
```

<br />

### Shard
```js
client.shard
// The shard of your database
// Initially set with:
client.init("Shard goes here")
```

<br />

### Autosave
```js
client.autosave
// The period of autosave in your database (in seconds)
// At init(), if it is lower than 0:
// then autosaving won't happen.

// Change it before init()
```

<br />

### Object types
```js
client.objects
// The storage for all batch object types of your database.
// Stored in a dict.
// Create a new object structure using:

client.objects.account = {
    id: null,
    type: null,
    name: null,
    data: null
}

// WARNING!
// Each object type registry must have an 'id' and 'type'.
```
<br />

### Directory
```js
client.dir
// The directory where the database filed will be saved in.
// Change the variable before init()
```

<br />

### Database Orientation
```js
client.databaseOrientation
// When creating a database file 
// Lixbase will use this default structure.
// Do not edit out the existing modules unless
// you are planning to build a custom
// database using Lixbase.

// Use before init()

// Example usage:
client.databaseOrientation = {
    'id': {},
    'batch': {},
    'pets': {
        'cats': [],
        'dogs': []
    }
}
```

<br />

### Formats
```js
client.format.id
// The format for dynamically generating IDs on the go.
// The variables are:
// [SHARD], [TIME], [RANDOM], [NEXT]

// Example:
client.format.id = '[SHARD]-[TIME]-[RANDOM]'



// The [NEXT] Variable must go at the end
// it handles the going up of IDs in order.
// For example: 
client.shard = 'N1'
client.format.id = '[SHARD]-[NEXT]'

//The first object will have an ID of:
'N1-0'
//The next one will be:
'N1-1'
//And so on. 
```
<br />

### Backups

```js
client.backups.enabled
// Bool
// Used at init() to trigger the backups thread.

client.backups.interval
// Integer interval in MINUTES.

client.backups.dir
// Custom directory name for backups

client.backups.format
// The format for backup file saves
// The variables are:
// [SHARD], [TIME], [RANDOM]
// Example:
client.backups.format = '[SHARD]-[TIME]'
```

## ⚒️ Functions

### .init()
```js
await client.init(shard)

// Initialises the database using the provided shard.
// Default shard name: "N1"
// Creates any new files needed
// Starts out any background processes
// like autosave and backups.

// Use await for client.init(shard) to wait for it to finish.

```

















## This library is still being developed. It may have some bugs!

More docs coming later!
