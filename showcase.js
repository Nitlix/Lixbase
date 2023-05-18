import Lixbase from "./src/index.js"


async function main() {
    let client = new Lixbase.Client

    client.objectOrientation.account = {
        id: null,
        type: null,
        data: null,
        created: null
    }

    client.objectOrientation.session = {
        id: null,
        type: null,
        data: null
    }

    client.dir = 'custom_dir_name'

    await client.init("N1")

    client.addObject('account', {data: 'test', created: Date.now()}) 
    client.addObject('session', {data: 'test2'}, 5)

    client.save()


}


main()