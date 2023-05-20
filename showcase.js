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

    //Custom backups directory
    client.backups.dir = 'custom_backups_dir_name'

    //Custom Dynamic ID Generation
    client.format.id = 'look-here-[SHARD]-[RANDOM]-[NEXT]'

    //No autosave
    client.autosave = -1

    //Autosaving every 10 seconds
    client.autosave = 10


    
    //Initialise our client after the configuration
    await client.init("shard_name")

    //Create new account object in the database
    client.addObject('account', {data: 'test', created: Date.now()}) 

    //Create new session object in the database
    client.addObject('session', {data: 'test2'}, 50)

    //Create another session object in the database, just for show
    client.addObject('session', {data: 'test3'}, 50)

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

    //Create a backup
    client.backup()



    // After all of this
    // check out /custom_dir_name/shard_name.json!
    // Good luck developing!
}


main()