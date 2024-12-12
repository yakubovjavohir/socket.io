function id(){
    const randomId = Math.trunc(Math.random() * 1000000)
    const sliceId = String(randomId)
    if (sliceId.length === 5 ||sliceId.length === 7) {
        id()
    }

    return randomId
}
module.exports = {id}