var mysql = require("../mysqlCon");

exports.run = function (bot, message, args) {
    var permission = message.member.hasPermission("ADMINISTRATOR");
    if (permission === true) {
        console.log(`King of the day command just activated. ${new Date()}`);
        // Get guildID which the message was written in.
        var guildID = message.guild.id;

        mysql.con.query(`SELECT * FROM kingsinfo WHERE guildID = ${guildID}`, function (err, result, fields) {
            if (err) {
                throw err;
            }
            // If guildID exist in database, it will be true.
            else if (result.length > 0) {
                console.log(`King of the day service for ${guildID}`);
                message.channel.send("King command is set up and ready to go.");
                setInterval(function () {
                    var d = new Date();
                    let userToAdd;

                    mysql.con.query(`SELECT * FROM kingsinfo WHERE guildID = ${guildID}`, function (err, result, fields) {
                        if (err) {
                            throw err;
                        } else {
                            var NOTIFY_HOUR = result[0].hour;
                            var NOTIFY_MINUTE = result[0].minute;
                        }

                        // Overordnet statement
                        if (d.getMinutes() === NOTIFY_MINUTE && d.getHours() === NOTIFY_HOUR) {


                            // Get user and check if bot, current king or banned --------------------------------------------------------
                            let randomResult = message.guild.members.random();
                            let isBot = randomResult.user['bot'];
                            let findID = randomResult['id'];
                            var bannedMember;
                            //Get the boolean banned from database
                            mysql.con.query(`SELECT * FROM kings WHERE guildID = ` + guildID + ` AND discID = ${findID}`, function (err, resultForBan, fields) {
                                if (err) {
                                    throw err;
                                } else {

                                    console.log(resultForBan);
                                    console.log("I got past this point xDDD");
                                    bannedMember = resultForBan[0].banned;
                                    console.log("Ban true or false: " + bannedMember);
                                }
                                // Get the ID of the current king, and compare to the previous king
                                mysql.con.query(`SELECT * FROM kingsinfo WHERE guildID = ${guildID}`, function (err, result, fields) {
                                    if (err) {
                                        throw err;
                                    } else {
                                        var currentKing = `${result[0].currentKing}`;
                                        var increment = 0;
                                        var newKing;

                                        while (isBot == true || currentKing === findID || bannedMember === 1) {
                                            // Get a new random guild member who will be king.
                                            randomResult = message.guild.members.random();
                                            // Determine if new king is a bot.
                                            isBot = randomResult.user['bot'];
                                            if (isBot !== true) {
                                                // Find ID of new king.
                                                findID = randomResult['id'];
                                                // Query database. Find user in kings table by using guildID and discID.
                                                mysql.con.query(`SELECT * FROM kings WHERE guildID = ` + guildID + ` AND discID = ${findID}`, function (err, resultForBan2, fields) {
                                                    setTimeout(function() {
                                                    
                                                    if (err) throw err;
                                                    console.log(resultForBan2);
                                                    newKing = resultForBan2;
                                                    // Get boolean banned from king.
                                                    bannedMember = newKing[0].banned;
                                                    console.log("Banned Member in query: " + bannedMember);
                                                    console.log("In da query");

                                                }, 1000);
                                                });
                                                setTimeout(function() {
                                                console.log("In da while loop" + randomResult.nickname);
                                                if (increment === 10) { //test statement
                                                    break;
                                                }
                                                increment++;
                                                console.log("Increment: " + increment);
                                            }, 2000);
                                            }
                                        }
                                    }

                                    var sql = `UPDATE kingsinfo SET currentKing = ` + findID + ` WHERE guildID = ` + guildID;
                                    mysql.con.query(sql, function (err, result) {
                                        if (err) throw err;
                                    });
                                    // Get user and check if bot (END) --------------------------------------------------------


                                    mysql.con.query(`SELECT * FROM kingsinfo WHERE guildID = ${guildID}`, function (err, result, fields) {
                                        if (err) {
                                            throw err;
                                        } else {
                                            var roleIDD = `${result[0].roleID}`;
                                            var validRole = message.guild.roles.get(roleIDD);
                                            let membersInRole = validRole.members;

                                            // Remove previous king --------------------------------------------------------
                                            let memberList = membersInRole.last();
                                            if (memberList !== undefined) {
                                                let userRemoveID = memberList["id"];
                                                let userToRemove = message.guild.members.get(userRemoveID);

                                                //console.log("-----------------");
                                                //console.log(userRemoveID);


                                                if (userToRemove !== undefined) {
                                                    userToRemove.removeRole(validRole);
                                                    message.channel.send(`${userToRemove} has been dethroned and is now a pleb!`);
                                                }
                                            } else {
                                                message.channel.send(`There is no current king.`);
                                            }
                                            // Remove previous king (END) --------------------------------------------------------

                                            var delayInMilliseconds = 300; //Delay for role change. Fails otherwise.
                                            setTimeout(function () {
                                                userToAdd = message.guild.members.get(findID);
                                                userToAdd.addRole(validRole);
                                                console.log(`King of the day command just fired. ${new Date()}`);
                                            }, delayInMilliseconds);

                                            // Database - Message how many times a king has been dethroned.

                                            // king is id....
                                            var modifiedFindID = `"'${findID}'"`; // Change to "''" somehow
                                            var kingAmount;
                                            var amountData;
                                            // Se om king er i objekt, og hvis ikke lav nyt document


                                            mysql.con.query(`SELECT * FROM kings WHERE guildID = ` + guildID + ` AND discID = ${findID}`, function (err, result, fields) {
                                                if (err) {
                                                    throw err;
                                                }
                                                else if (result.length > 0) {
                                                    var delayInMilliseconds = 1000; //1 second
                                                    setTimeout(function () {
                                                        //console.log("User does exist")

                                                        let fetchsql = "SELECT * FROM kings WHERE guildID = " + guildID + " AND discID = " + findID;
                                                        mysql.con.query(fetchsql, (error, results, fields) => {
                                                            if (error) {
                                                                return console.error(error.message);
                                                            }
                                                            amountData = results[0].amount;

                                                            kingAmount = amountData;
                                                            kingAmount++;
                                                            message.channel.send(`The new king is <@${findID}> and has been a king ${kingAmount} times.`);
                                                            var sql = "UPDATE kings SET amount = " + kingAmount + " WHERE guildID = " + guildID + ` AND discID = ` + findID;
                                                            mysql.con.query(sql, function (err, result) {
                                                                if (err) throw err;
                                                                console.log(`${kingAmount}`);
                                                            }, delayInMilliseconds);
                                                        });
                                                    });

                                                } else {
                                                    var delayInMilliseconds = 3000; //1 second
                                                    setTimeout(function () {
                                                        console.log("User does not exist");
                                                        message.channel.send(`It is <@${findID}>'s first time as a king!`);




                                                        userToAdd = message.guild.members.get(findID);
                                                        var userName = `"'${userToAdd.user.username}'"`;  // change to "''"

                                                        var sql = `INSERT INTO kings (guildID, discID, name, amount) VALUES ( ` + guildID + `, ` + findID + `, ` + userName + `, 1)`;
                                                        mysql.con.query(sql, function (err, result) {
                                                            if (err) throw err;
                                                            console.log("1 record inserted");
                                                        }, delayInMilliseconds);
                                                    });
                                                }
                                            });
                                        }
                                    });
                                });
                            });
                        } else {
                            //message.channel.send(`It is not ${NOTIFY_HOUR}:${NOTIFY_MINUTE} but ${d.getHours()}:${d.getMinutes()}`);
                        }
                    });
                }, 60 * 1000); // Checks every minute
            } else {
                message.channel.send("Need to setup client");
            }
        });
    } else {
        message.channel.send("You do not have permisson for this.");
    }
};