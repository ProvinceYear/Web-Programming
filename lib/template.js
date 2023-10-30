const template = {
	HTML: function (name, list, body) {
		return `<!DOCTYPE html>
	<html lang="ko">
		<head>
			<title>${name}</title>
		</head>
		<body>
			<h1><a href="/">선린인터넷고등학교</a></h1>
			<ol>
				${list}
                <a href="create">Create</a>
				${body}
			</ol>
		</body>
	</html>`
	},
	list: function (name, list, body) {
		let list = '<ol>';
		for (i = 0; i < files.length; i++) {
			list = list + `<li><a href='?name=${files[i]}'>${files[i]}</a></li>`;
		}
		list = list + '</ol>'

		return list
	}, create:function(){
        return `
        <form action="/create_process" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p><textarea name="description" placeholder="description"></textarea></p>
        <p><button type="submit">send</button></p>
        </form>
    `
    }
}