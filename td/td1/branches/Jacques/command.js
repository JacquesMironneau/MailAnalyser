const Command = {
	check: function() {
		console.log("Command ready")
		console.log("Blue level checked".blue)
		console.log("Magenta level checked".magenta)
		console.log("Cyan level checked".cyan)
		return true
	} 
}
module.exports = Command
