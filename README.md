# Nginx fancy-index templates

nginx fancy-index custom templates with api server(node express)

---

## Nginx config

```js
server {
    listen       80;
    server_name  localhost;

    charset utf-8;
    #access_log  /var/log/nginx/host.access.log  main;

    error_page 404 /.fancyindex/404.html;
    root /usr/share/nginx/html;
    try_files $uri.html $uri $uri/ =404;

    location / {
        root   /usr/share/nginx/html/files;
        fancyindex on;
        fancyindex_exact_size off;
        fancyindex_localtime on;
        fancyindex_footer   /.fancyindex/footer.html;
        fancyindex_header   /.fancyindex/header.html;
        fancyindex_css_href /.fancyindex/style.css;
        fancyindex_time_format "%Y-%m-%d %H:%M:%S";
    }

    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
}
```

## Demo

- Search 

<p align="center">
    <img src="/img/img1.PNG">
</p>

- File Upload (Multi file support)

<img width="400px" src="/img/img2.png">

- Edit

<img src="/img/img3.PNG">

