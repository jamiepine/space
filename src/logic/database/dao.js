const sqlite3 = require('sqlite3')
const Promise = require('bluebird')

// import models
const Core = require('./models/core.model').default

class database {

    constructor(dbname, memory = false) {

        // definitions
        this.memory = memory
        this.dbname = dbname
        this.dbFolderPath = ''
        this.models = {
            Core,
        }
        // if the folder path does not contain a trailing slash, add it.    
        if (this.dbFolderPath.slice(this.dbFolderPath.length - 1, this.dbFolderPath.length) !== '/') {
            this.dbFolderPath = this.dbFolderPath + '/'
        }
        // combine the name with the path and call the connect method
        this.dbPath = this.dbFolderPath + this.dbname
    }

    connect() {
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(this.memory ? ':memory:' : this.dbPath, (err) => {
                if (err) {
                    console.log('Could not connect to database', err)
                    // if no database found, create using model
                    this.createDB().then(resolve).catch(err => reject(err))
                } else {
                    console.log('Connected to database')
                    if (this.memory) this.createDB()
                    resolve()
                }

            })
        })
    }

    createDB() {
        return new Promise((resolve, reject) => {
            // create the database using model
            let model = this.models[this.dbname]
            if (!model) return reject('model_not_found');
            if (!model.tables) return reject('tabels_not_found');

            for (let table of model.tables) {
                let query = `CREATE TABLE IF NOT EXISTS ${table.name} (`
                let parameters = []
                for (let column of table.columns) {
                    // define the name & type
                    let param = `${column.name} ${column.type} `
                    // append any additional options
                    if (column.primaryKey) param = param + `PRIMARY KEY `
                    if (column.autoIncrement) param = param + `AUTOINCREMENT `
                    // remove last space
                    if (param.slice(param.length - 1, param.length) === ' ') param = param.substring(0, param.length - 1);
                    parameters.push(param)
                }
                query = query + parameters.join(', ') + `)`
                console.log(query)
                this.db.serialize(() => {
                    this.db.run(query)
                })
            }
            // this.db.close()
            resolve()
        })
    }

    newRow(table, template) {
        console.log('creating new row')
        return new Promise((resolve, reject) => {
            let model = this.models[this.dbname].tables.find(model => model.name === table)

            // VALIDATION: iterate over the columns in the model
            for (let column of model.columns) {
                // apply defaults
                if (column.hasOwnProperty('default') && !template.hasOwnProperty(column.name)) template[column.name] = column.default
            }

            // VALIDATION: iterate over the properties in the template
            let keys = Object.keys(template)
            for (let key of keys) {
                // verify the key exists in the model
                let column = model.columns.find(column => column.name === key)
                if (!column) return reject(`${key} was not found on model ${model.name}`)
                // fail if trying to assign primary key
                if (column.primaryKey) return reject(`Can not assign primary key on model ${model.name}`)
            }

            // parse the template
            let parsedTemplate = keys.join(', ');
            // add a question mark for the values in the query
            let values = Array.from('?'.repeat(keys.length)).join(',');

            console.log(`INSERT INTO ${table} (${parsedTemplate}) VALUES (${values})`)

            this.db.serialize(() => {
                let query = this.db.prepare(`INSERT INTO ${table} (${parsedTemplate}) VALUES (${values})`);
                console.log(...Object.values(template))
                query.run(...Object.values(template));

                query.finalize();
            });
            resolve()
        })
    }
}

export default database