const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const rootPath = '/usr/share/nginx/html/files';

router.get('/', function(req, res) {
    try {
        const rm_path = path.join(rootPath, req.query.rm);
        if (rm_path) {
            if (fs.existsSync(rm_path)) {
                if (isDir(rm_path)) {
                    res.json({status: false, data: {'isDir' : true}});
                } else {
                    fs.unlink(rm_path, function(err) {
                        if (err) {
                            return res.status(400).json({status: false});
                        } else {
                            console.log(`[${getTime()}][${req.socket.remoteAddress}][Deleted] - ${rm_path}`);
                        }
                    });
                    res.json({status: true, data: {'isDir' : false}});
                }
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(400).json({status: false});
    }
});

function isDir(path) {
    try {
        var stat = fs.lstatSync(path);
        return stat.isDirectory();
    } catch (e) {
        return false;
    }
}

function getTime() {
    let ts = Date.now();
    let date_ob = new Date(ts);
    let day     = date_ob.getDate();
    let month   = date_ob.getMonth() + 1;
    let year    = date_ob.getFullYear();
    let hours   = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

module.exports = router;