module.exports = function(input){
    if (input.toString().length == 2){
        return input.toString()
    }
    else{
        return "0" + input.toString()
    }
}