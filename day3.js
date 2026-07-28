//promises for asynchronous
//js single threaded programming language
let msg=true;
const promiseOne = new Promise((resolve,reject) =>{
    if(!msg == true){
        console.log("message using promises failde");
        reject("Error");
    }
    else{
        console.log("error.......");
        setTimeout(()=>{
            resolve("promise resolved successfully");
        },2000);
    }
});
promiseOne.then((result) =>{
    console.log(result);
});