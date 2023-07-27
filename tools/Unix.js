const toTwo = require("./toTwo")

module.exports = {
    int: () => {
        return parseInt((new Date()).getTime() / 1000)
    },
    format: (inputFormat) => {
        const date = new Date();
        const hours = toTwo(date.getHours());
        const minutes = toTwo(date.getMinutes());
        const seconds = toTwo(date.getSeconds());
        const days = toTwo(date.getDate());
        const months = toTwo(date.getMonth() + 1);
        const years = date.getFullYear();
        
        inputFormat = inputFormat.replace("hh", hours);
        inputFormat = inputFormat.replace("mm", minutes);
        inputFormat = inputFormat.replace("ss", seconds);
        inputFormat = inputFormat.replace("dd", days);
        inputFormat = inputFormat.replace("MM", months);
        inputFormat = inputFormat.replace("YYYY", years);
        inputFormat = inputFormat.replace("yy", years.toString().slice(-2));

        return inputFormat;
    }
}