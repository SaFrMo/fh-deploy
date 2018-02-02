const prompt = require('prompt-sync')()
const colors = require('colors')
const fs = require('fs')
const path = require('path')

module.exports = () => {
    console.log('Deploy config file missing or broken! Creating a new file...'.yellow)

    const host = prompt('SFTP host: ')
    const port = prompt('Port ' + '(default: 22)'.gray + ': ', '22')
    const username = prompt('Username: ')
    const password = prompt('Password: ', { echo: '*' })
    const target = prompt('Target directory ' + '(default: /fh-deploy)'.gray + ': ', '/fh-deploy')

    const output = {
        settings: {
            host,
            port,
            username,
            password
        },
        queue: [],
        target
    }

    fs.writeFileSync('.deployrc.json', JSON.stringify(output, null, 2))

    console.log('Config created!'.green)
    console.log('fh-deploy will check your config file\'s queue first, then fall back to package.json\'s "files" property if no queue is found.')

    const gitignorePath = path.resolve('./', '.gitignore')

    if( fs.existsSync(gitignorePath) ){

        console.log('We highly recommend that you add the new config file to your .gitignore so you don\'t accidentally commit your login credentials.'.yellow)
        const addToGitignore = prompt('Add .deployrc.json to .gitignore now? (y/N): ', 'n')
        if( addToGitignore.toLowerCase() === 'y' ){
            // check if it already contains .deployrc.json
            const content = fs.readFileSync(gitignorePath, { encoding: 'utf8' })
            if( !content.includes('.deployrc.json') ){
                // write to end of .gitignore
                fs.appendFileSync(gitignorePath, '\n.deployrc.json')
            }
            console.log('.deployrc.json added to .gitignore!'.green)
        }

    }

    console.log('Config file repaired! Continuing...'.green)

}