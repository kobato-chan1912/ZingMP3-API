setInterval((function() {  
    console.log('Hello stackjava.com');
}), 1000);
// tắt chương trình sau 3s
setTimeout((function() {  
    return process.exit(10);
}), 3000);
process.on('exit', function(code) {  
    return console.log(`App exit with code ${code}`);
});
