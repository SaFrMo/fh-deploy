// Main function
module.exports.default = async function (sftp, config, queue) {
    const connection = await sftp.connect(config.settings).catch(err => new Error(err))

    if( connection instanceof Error ){
        console.log(connection)
        await sftp.end()
        return
    }
    console.log('in!')
    sftp.end()
    return

    // Each item is a string containing the path
    for( let item of queue ){
        console.log(`Uploading ${ item }...`)

        // Does the item include a directory? If so, we'll need to create the directory
        if( item.includes('/') ){
            // Strip out the filename from the string
            const dirPath = item.replace(/(?<=\/)[^\/]*$/, '')
            // create the desired path
            await sftp.mkdir(`${ deployTarget }${ dirPath }`, true)
        }

        // upload the file
        await sftp.put(path.resolve(config.cwd, item), `${ deployTarget }${ item }`)
    }

    console.log('Files uploaded successfully!')

    // close the connection
    await sftp.end()
}