# Lixbase @1.0.5 [![Node.JS](https://img.shields.io/badge/NODE.JS-blueviolet?style=for-the-badge)](http://modejs.org/) [![MIT License](https://img.shields.io/badge/LICENSE-MIT-brightgreen?style=for-the-badge)]

[![Banner](https://i.imgur.com/s9HwcMr.png)](http://modejs.org/)

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
import Lixbase from "lixbase";


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
    client.format.id = '[SHARD]-look-at-this-sick-format-[TIME]-[RANDOM]'

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







## This library is still being developed. It may have some bugs!

More docs coming later.
