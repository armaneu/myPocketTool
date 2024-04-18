/**
 * This file contents all functionalities and definitions related to SQL DDL to PlantUML conversion
 */

// CARDINALITY notation definition
const _0_1_ = {uml: '0..1', barker: '|o',};  // ZERO or ONE
const _1_1_ = {uml: '   1', barker: '||',};  // Exactly ONE
const _0_M_ = {uml: '0..*', barker: '}o',};  // ZERO or MANY
const _1_M_ = {uml: '1..*', barker: '}|',};  // ONE or MANY


/**
 * TConnection object to store the connections parameters and credentials
 */
const TConnection = {
    host: '',          // hostname or IP address of the database
    port: '',          // port number to stablish the connection
    service_name: '',  // database service name
    database: '',      // the name of the database
    schema: '',        // the schema of the database
    username: '',      // user with access to the database
    password: '',      // the password of the user
};

const CONNECTION = Object.create(TConnection);


const TKeyMasterSlave = {
    key_master: '',  // the key name of the master entity
    key_slave: '',   // the key name of the slave entity
};

/**
 * TRelation object for the relationships between entities
 */
const TRelation = {
    master_entity_name: '',  // the name of the entity from which it takes the keys
    cardinality: '',         // cardinality between the master entity and the current entity
    keys_master_slave_array: new Array(),  // stores all master-slave key pairs of the entity
};

/**
 * TColumn object to store name, data type and if is it mandatory or not
 */
const TColumn = {
    name: '',          // column name
    data_type: '',     // data type
    mandatory: false,  // if column is mandatory then {true}
};

/**
 * TEntity object to represent an entity
 */
const TEntity = {
    name: '',                     // entity name
    description: '',              // brief description of the entity
    columns_array: new Array(),   // stores all the entity's column
    pk_array: new Array(),        // stores the primary key(s)
    pf_array: new Array(),        // stores the primary foreign key(s)
    fk_array: new Array(),        // stores the foreign key(s)
    sql_array: new Array(),       // stores CREATE TABLE, ALTER TABLE sql instructions related to the entity
    relation_array: new Array(),  // list of names of the master entities it is related to
};





UtilsSQL = {

    getColumnData: function (str) {
        let column = Object.create(TColumn);  // creating the object of type TColumn

        let str_aux = str.split(' ').filter(word => word !== '').join(' ');  // ensuring that words are separated only by one whitespace
        let indexFirstBlankSpace = str_aux.indexOf(' ');                     // index of the first whitespace { }
        let indexNOTNULL = str_aux.toUpperCase().indexOf('NOT NULL');        // index of the {NOL NULL}
        if (indexFirstBlankSpace > 0) {
            // name: from the zero-index to the index of the first whitespace { }
            column.name = str_aux.toUpperCase().substring(0, indexFirstBlankSpace).trim();
        }
        if (indexFirstBlankSpace < indexNOTNULL) {
            // data type: from the index of the first whitespace to the index of {NOL NULL}
            column.data_type = str_aux.toUpperCase().substring(indexFirstBlankSpace, indexNOTNULL).trim();
            // mandatory: then is {true}
            column.mandatory = true;
        } else {
            // data type: from the index of the first whitespace to the index of {NOL NULL}
            column.data_type = str_aux.toUpperCase().substring(indexFirstBlankSpace, str_aux.length).trim();
            // mandatory: then is {false}
            column.mandatory = false;
        }

        return column;
    },

    
    getColumnArray: function (str) {
        let result = new Array();

        if (str != null && str.length > 0 && str.toUpperCase().indexOf('CREATE TABLE') > -1) {
            let str_aux = str.split(' ').filter(word => word !== '').join(' ');  // ensuring that words are separated only by one whitespace
            str_aux = str_aux.replace(/\n|\r|\t/g, ' ').substring(str_aux.indexOf('(') + 1, str_aux.length - 1).trim();  // no including of opening 'and closing parenthesis
            
            let str_search = '';
            let indexStart = 0, indexEnd = 0;
            let separator = false;
            for (let index = 0; index < str_aux.length; index++) {
                if (str_aux.charAt(index) == ',') {                                       // loking for the comma used as separator
                    str_search = str_aux.substring(indexStart, index).trim();             // taking a portion of the string {str_aux} to analize it
                    if (str_search.includes('(') && str_search.includes(')')) {           // if there are opening and closing parenthesis
                        const column = UtilsSQL.getColumnData(str_search);  // getting the object of type TColumn
                        result.push(column);
                        index++;
                        indexStart = index;
                    } else if (!str_search.includes('(') && !str_search.includes(')')) {  // if there are no opening and closing parenthesis
                        const column = UtilsSQL.getColumnData(str_search);  // getting the object of type TColumn
                        result.push(column);
                        index++;
                        indexStart = index;
                    }
                } else if ((index + 1) == str_aux.length && str_search.includes('(') && str_search.includes(')')) {
                    str_search = str_aux.substring(indexStart, index + 1).trim();         // taking the last portion of the string {str_aux}
                    const column = UtilsSQL.getColumnData(str_search);      // getting the object of type TColumn
                    result.push(column);
                }
            }
        }

        return result;
    },

    /**
     * This method allows to know if certain column is mandatory or not
     * @param {*} column_name name of the column to find
     * @param {*} columns_array array of data type TColumn to search for
     * @returns true if the column is mandatory otherwise an false
     */
    isMandatory: function (column_name, columns_array) {
        let result = false;

        if (column_name != null && column_name.length > 0 && Array.isArray(columns_array)) {
            for (let index = 0; index < columns_array.length; index++) {
                if (columns_array[index].name == column_name && columns_array[index].mandatory == true) {
                    result = true;
                    break;
                }
            }
        }

        return result;
    },


    /**
     * This method resolves the cardinalities among the entities
     * @param {*} entity_full_list List of TEntity objects which contains data of the tables of interest
     * @returns 
     */
    getCardinalities: function (entity_full_list) {
        let result_array = entity_full_list;
        
        if (Array.isArray(result_array)) {
            result_array.forEach(entity => {
                if (entity.relation_array.length > 0) {  // asking if this entity has a relationship with another entity (the master one)
                    // CASE Relation  { 1 -- 1 }    { 0..1 -- 0..1 }  -  (master's PK is PF in this entity)
                    if (entity.pk_array.length == 0 && entity.pf_array.length > 0 && entity.fk_array.length == 0) {
                        // Ensuring if the PF is from the master entity
                        entity.pf_array.forEach(key_slave => {
                            entity.relation_array.forEach(relation => {
                                relation.keys_master_slave_array.forEach(key_master_slave_pair => {
                                    if (key_slave == key_master_slave_pair.key_slave) {  //  <== ensuring if the PF is from master entity
                                        if (UtilsSQL.isMandatory(key_slave, entity.columns_array)) {
                                            relation.cardinality = `"${_1_1_.uml}" -- "${_1_1_.uml}"`;
                                        } else {
                                            relation.cardinality = `"${_0_1_.uml}" -- "${_0_1_.uml}"`;
                                        }
                                    }
                                });
                            });
                        });
                    } if (entity.pk_array.length > 0 && entity.pf_array.length > 0 && entity.fk_array.length == 0) {
                        // Ensuring if the PF is from the master entity
                        entity.pf_array.forEach(key_slave => {
                            entity.relation_array.forEach(relation => {
                                relation.keys_master_slave_array.forEach(key_master_slave_pair => {
                                    if (key_slave == key_master_slave_pair.key_slave) {  //  <== ensuring if the PF is from master entity
                                        if (UtilsSQL.isMandatory(key_slave, entity.columns_array)) {
                                            relation.cardinality = `"${_1_M_.uml}" -- "${_1_1_.uml}"`;
                                        } else {
                                            relation.cardinality = `"${_0_M_.uml}" -- "${_0_1_.uml}"`;
                                        }
                                    }
                                });
                            });
                        });
                    } else if (entity.pk_array.length == 0 && entity.pf_array.length == 0 && entity.fk_array.length > 0) {
                        // Ensuring if the FK is from the master entity
                        entity.fk_array.forEach(key_slave => {
                            entity.relation_array.forEach(relation => {
                                relation.keys_master_slave_array.forEach(key_master_slave_pair => {
                                    if (key_slave == key_master_slave_pair.key_slave) {  //  <== ensuring if the FK is from master entity
                                        if (UtilsSQL.isMandatory(key_slave, entity.columns_array)) {
                                            relation.cardinality = `"${_1_M_.uml}" -- "${_1_1_.uml}"`;
                                        } else {
                                            relation.cardinality = `"${_0_M_.uml}" -- "${_0_1_.uml}"`;
                                        }
                                    }
                                });
                            });
                        });
                    } else if (entity.pk_array.length > 0 && entity.pf_array.length == 0 && entity.fk_array.length > 0) {
                        // Ensuring if the FK is from the master entity
                        entity.fk_array.forEach(key_slave => {
                            entity.relation_array.forEach(relation => {
                                relation.keys_master_slave_array.forEach(key_master_slave_pair => {
                                    if (key_slave == key_master_slave_pair.key_slave) {  //  <== ensuring if the FK is from master entity
                                        if (UtilsSQL.isMandatory(key_slave, entity.columns_array)) {
                                            relation.cardinality = `"${_0_M_.uml}" -- "${_1_1_.uml}"`;
                                        } else {
                                            relation.cardinality = `"${_0_M_.uml}" -- "${_0_1_.uml}"`;
                                        }
                                    }
                                });
                            });
                        });
                    }
                }
                
                
            });
        }

        return result_array;
    },


    /**
     * This method retrieves the table name from the given parameter in case it contains the name of the schema too
     * @param {*} schema_table {schema}.{table}, example: schemaX.TableA, then table name is 'TableA'
     * @returns The name of the table
     */
    getTableNameFromSchema: function (schema_table) {
        let result = '';

        if (schema_table != null && schema_table.length > 0) {
            if (schema_table.includes('.')) {
                let index_last_dot = schema_table.length - schema_table.split('.').reverse().join('.').indexOf('.');
                result = schema_table.substring(index_last_dot, schema_table.length);
            } else {
                result = schema_table;
            }
        }

        return result;
    },
};




/*  ||        KEYS        ||        RELATIONSHIP & CARDINALITY         ||  */
/*  ||------|------|------||---------------------|---------------------||  */
/*  ||  PK  |  PF  |  FK  ||                  MANDATORY                ||  */
/*  ||======|======|======||=====================|=====================||  */
/*  ||  0   |  *   |  0   ||         YES         |          NO         ||  */
/*  ----------------------||---------------------|---------------------||  */
/*                        ||  slave  --  master  |  slave  --  master  ||  */
/*                        ||=====================|=====================||  */
/*                        ||  _1_1_  --  _1_1_   |  _0_1_  --  _0_1_   ||  */
/*                        -----------------------------------------------  */


/*  ||        KEYS        ||        RELATIONSHIP & CARDINALITY         ||  */
/*  ||------|------|------||---------------------|---------------------||  */
/*  ||  PK  |  PF  |  FK  ||                  MANDATORY                ||  */
/*  ||======|======|======||=====================|=====================||  */
/*  ||  0   |  0   |  *   ||         YES         |          NO         ||  */
/*  ----------------------||---------------------|---------------------||  */
/*                        ||  slave  --  master  |  slave  --  master  ||  */
/*                        ||=====================|=====================||  */
/*                        ||  _1_M_  --  _1_1_   |  _0_M_  --  _0_1_   ||  */
/*                        -----------------------------------------------  */


/*  ||        KEYS        ||        RELATIONSHIP & CARDINALITY         ||  */
/*  ||------|------|------||---------------------|---------------------||  */
/*  ||  PK  |  PF  |  FK  ||                  MANDATORY                ||  */
/*  ||======|======|======||=====================|=====================||  */
/*  ||  *   |  0   |  *   ||         YES         |          NO         ||  */
/*  ----------------------||---------------------|---------------------||  */
/*                        ||  slave  --  master  |  slave  --  master  ||  */
/*                        ||=====================|=====================||  */
/*                        ||  _0_M_  --  _1_1_   |  _0_M_  --  _0_1_   ||  */
/*                        -----------------------------------------------  */


/*  ||        KEYS        ||        RELATIONSHIP & CARDINALITY         ||  */
/*  ||------|------|------||---------------------|---------------------||  */
/*  ||  PK  |  PF  |  FK  ||                  MANDATORY                ||  */
/*  ||======|======|======||=====================|=====================||  */
/*  ||  *   |  *   |  0   ||         YES         |          NO         ||  */
/*  ----------------------||---------------------|---------------------||  */
/*                        ||  slave  --  master  |  slave  --  master  ||  */
/*                        ||=====================|=====================||  */
/*                        ||  _1_M_  --  _1_1_   |  _0_M_  --  _0_1_   ||  */
/*                        -----------------------------------------------  */