const express=require('express');
const template = require('./lib/kbo.js')
const fs = require('fs');
const qs = require('querystring')
const app = express();
const port = 3000;

app.get("/", (req, res)=>{

    let {name} = req.query; 
    fs.readdir('page', (err, files)=>{
        let list=template.list(files);
        
        fs.readFile(`page/${name}`, 'utf-8', (err, data)=>{
            let control = `<a href='/create'>create</a> <a href="/update?name=${name}">update</a> 
            <form action="delete_process" method="post">
                <input type="hidden" name="id" value="${name}">
                <button type="submit">delete</button>
            </form>
            `
            if(name==undefined){
                name = 'KBO';
                data='Korea Baseball Organization';
                control=`<a href='/create'>create</a>`
            }
            const html=template.HTML(name, list, `<h2>${name}한국프로야구</h2><p>${data}</p>`, control);
            res.send(html);
        });
    });
});

app.get('/create', (req, res)=>{
    fs.readdir('page', (err, files)=>{
        const name='create';
        const list = template.list(files);
        const data = template.create();
        const html = template.HTML(name, list, data, '');
        res.send(html);
    });
});

app.get('/update', (req, res)=>{
    let {name}=req.query;
    fs.readdir('page', (err, files)=>{
        let list=template.list(files);
        fs.readFile(`page/${name}`, 'utf-8', (err, content)=>{
            let control = `<a href='/create'>create</a> <a href="/update?name=${name}">update</a> 
            <form action="delete_process" method="post">
                <input type="hidden" name="id" value="${name}">
                <button type="submit">delete</button>
            </form>
            `
            const data=template.update(name, content);
            const html=template.HTML(name, list, `<h2>${name} 페이지</h2><p>${data}</p>`, control);
            res.send(html);
        });
    });
});


app.post('/create_process', (req, res)=>{
    let body = ''
    req.on('data', (data)=>{
        body=body+data;
    });
    req.on('end', ()=>{
        const post = qs.parse(body);
        const {title} = post;
        const {description} = post;
        fs.writeFile(`page/${title}`, description, 'utf-8', (err)=>{
            res.redirect(302, `/?name=${title}`);
        });
    });
});

app.post('/update_process', (req, res)=>{
    let body = ''
    req.on('data', (data)=>{
        body=body+data;
    });
    req.on('end', ()=>{
        const post = qs.parse(body);
        const {id} = post; 
        const {title} = post;
        const {description} = post;
        fs.rename(`page/${id}`, `page/${title}`, err => {
            fs.writeFile(`page/${title}`, description, 'utf-8', (err)=>{
                res.redirect(302, `/?name=${title}`);
            });
        });
    });
})

app.post('/delete_process', (req, res)=>{
    let body = ''
    req.on('data', (data)=>{
        body=body+data;
    });
    req.on('end', ()=>{
        const post = qs.parse(body);
        const {id} = post;
        fs.unlink(`page/${id}`, (err)=>{
            res.redirect(302, `/`);
        });
    });
});

app.listen(port, ()=>{
    console.log(`server running on port ${port}`);
});