import Lixbase from "./src/index.js"


async function main() {
    let client = new Lixbase.Client


    //Custom object - Account
    client.objectOrientation.account = {
        id: null,
        type: null,
        data: null,
        created: null
    }

    //Custom object - Session
    client.objectOrientation.session = {
        id: null,
        type: null,
        data: null
    }

    //Custom saving directory
    client.dir = 'custom_dir_name'

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

    //Save the database file
    client.save()



    // After all of this
    // check out /custom_dir_name/shard_name.json!
    // Good luck developing!
}


main()