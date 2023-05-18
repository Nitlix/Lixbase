import Lixbase from "./lixbase.js"


async function main() {
    let client = new Lixbase.Client

    console.log(client.init)

    await client.init("N1")

    console.log(client.data)




}


main()