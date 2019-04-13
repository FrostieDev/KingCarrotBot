const mysql = require( 'mysql' );

let config = {
    host: 'localhost',
    user: 'test',
    password: '?????',
    database: '?????',
    insecureAuth: true
}

class Database {
    constructor( config ) {
        this.connection = mysql.createConnection( {
            host: 'localhost',
            user: 'test',
            password: '?????',
            database: '?????',
            insecureAuth: true
        } );
    }
    query( sql, args ) {
        return new Promise( ( resolve, reject ) => {
            this.connection.query( sql, args, ( err, rows ) => {
                if ( err )
                    return reject( err );
                resolve( rows );
            } );
        } );
    }
    close() {
        return new Promise( ( resolve, reject ) => {
            this.connection.end( err => {
                if ( err )
                    return reject( err );
                resolve();
            } );
        } );
    }
};

module.exports = Database;