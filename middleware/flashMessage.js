exports.errorMessage = (req) => {
    let message = req.flash('error');
    if (message.length > 0) {
        return message = message[0]
    } else {
        return message = null
    }
}

exports.successMessage = (req) => {
    let message = req.flash('success');
    if (message.length > 0) {
        return message = message[0]
    } else {
        return message = null
    }
}