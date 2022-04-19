const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const rootPath = '/usr/share/nginx/html/files/';

router.post('/', multer().single('file'), async function(req, res) {
    if (!fs.existsSync(rootPath)) {
        fs.mkdirSync(rootPath, {recursive: true});
    }

    try {
        var filename = req.file['originalname'];
        var buffer = req.file['buffer'];
        
        if (req.file) {
            var dst_path = '';

            if (!('dst' in req.query)) {
                dst_path = rootPath;
            } else {
                dst_path = path.join(rootPath, req.query.dst);
                if (!fs.existsSync(path.join(rootPath, req.query.dst))) {
                    return res.status(400).json({status: false});
                }
            }
            dst_path = path.join(dst_path, filename);

            fs.writeFile(dst_path, buffer, function(err) {
                if(err) {
                    res.status(400).json({status: false});
                }
                console.log(`[${getTime()}][${req.socket.remoteAddress}][Upload] - ${filename}`);
                res.json({status: true});
            });
        }
    } catch (err) {
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