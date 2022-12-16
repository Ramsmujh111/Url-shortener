// handle the unexceptional error
function handleFailure(){
    process.on("uncaughtException" , (err) =>{
        console.log(`Unhandled Rejection! Server Shutting down....`);
        console.log(`Please fix the bug now`);
        console.log(err.message);
        process.exit(-1);
    })

    process.on("unhandledRejection" , (err) =>{
        console.log(`Unhandled Rejection! Server Shutting down....`);
        console.log(`Please fix the bug now`);
        console.log(err.message);
        process.exit(-1);
    })
}

module.exports = handleFailure;