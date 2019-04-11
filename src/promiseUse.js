let { ES5Promise } = require("./Promise");

let res = new ES5Promise((resolve, reject) => {
    resolve(111);
})
    .then(data => {
        console.log("TCL: data", data);
        return data + 333;
    })
    

console.log(3)