export default {
    tables: [{
        name: 'user',
        columns: [{
                name: 'id',
                type: 'INTEGER',
                primaryKey: true,
                autoIncrement: true
            },
            {
                name: 'name',
                type: 'TEXT'
            },
            {
                name: 'email',
                type: 'TEXT'
            },
            {
                name: 'dateCreated',
                type: 'DATE',
                default: new Date()
            }
        ]
    }]
}