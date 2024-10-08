




// This is based upon doubletap's answer, 
// this one handles any length of random required characters (lower only),
// and keeps generating random numbers until enough characters have been collected.
const  randomChars =  (len) => {
    let chars = '';
    while (chars.length < len) {
        chars += Math.random().toString(36).substring(2);
    }
    // Remove unnecessary additional characters.
    return chars.substring(0, len);
}
  
module.exports = { randomChars };
