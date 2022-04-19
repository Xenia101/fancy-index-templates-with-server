const express = require('express');
const router = express.Router();
const directoryTree = require('directory-tree');

const rootPath = '/usr/share/nginx/html/files';

router.get('/', function(req, res) {
    const tree = directoryTree(`${rootPath}`, {
        attributes: ['size', 'type', 'mtime'],
        exclude: /.fancyindex/
    });

    //res.render('../views/index.html', {data: tree});

    res.setHeader('Content-Type', 'application/json')
    res.json(`${JSON.stringify(tree)}`);
});

module.exports = router;