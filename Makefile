test:
	@NODE_ENV=test ./node_modules/.bin/mocha --require should test/app.test.js test/db.test.js test/geo.test.js test/model.test.js test/post.test.js test/get.test.js test/put.test.js

.PHONY: test
