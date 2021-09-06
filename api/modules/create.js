module.exports = function(server, db) {
	server.post('/create-post', (req, res) => {
		console.log(req.body)
		res.send('Hello')
	});
};
