const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const rootPath = '/usr/share/nginx/html/files';

router.get('/', function(req, res) {
    try {
        const base_path = req.query.base;
        const org_fn = path.join(rootPath, req.query.org);
        const new_fn = path.join(rootPath, base_path, req.query.new);

        if (org_fn && new_fn) {
            if (fs.existsSync(org_fn)) {
                fs.rename(org_fn, new_fn, function(err) {
                    if (err) {
                        return res.status(400).json({status: false});
                    } else {
                        console.log(`[${getTime()}][${req.socket.remoteAddress}][Rename] - ${org_fn} -> ${new_fn}`);
                    }
                    res.json({status: true});
                })
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(400).json({status: false});
    }
});

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