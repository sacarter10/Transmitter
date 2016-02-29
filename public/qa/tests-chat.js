// not really sure if there's a difference between chat tests and global tests at this point,
// just splitting them up in case I add more pages some day
suite('Messages', function () {
	test('sent messages should appear on the page', function () {
		sendMessage("hello 123");
		assert(document.body.textContent.indexOf("hello 123") >= 0);
	})
})