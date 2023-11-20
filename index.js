const fs = require('fs');
const http = require('http');
const url = require('url');
 

// const textInput = fs.readFileSync(`./final/txt/input.txt`,'utf-8');

// console.log(textInput);

// const textWrite = ` Avacado is very tasty and here is the information about it: ${textInput}. \nCreated on ${Date.now()} `;

// fs.writeFileSync('./final/txt/output.txt',textWrite);
// console.log('File written!!!!');

/* To read file asynchronously, we use fs.readFile
and not fs.readFileSync . In fs.readFile, we first have to give path of our file and then file encoding and then a call-back funtion which will take two parameters: error and a variable containing data of the file. The first parameter is usually error. */

// 

//Server

const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);  // By putting the placeholders between / and / and using g we are actually replacing all the placeholders and not just the first one it finds!!!!!!

    output = output.replace(/{%IMAGE%}/g, product.image); // in the starting we created variable output because it's not good practice to directly manipulate the arguments that we directly pass into the function !!!!!!

    output = output.replace(/{%IMAGE%}/g, product.image); 
    output = output.replace(/{%QUANTITY%}/g, product.quantity); 
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%ID%}/g, product.id);
    output = output.replace(/{%IMAGE%}/g, product.from); 
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    if(!product.organic){
        output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    }
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    
    return output;
}

const tempOverview = fs.readFileSync(`${__dirname}/starter/templates/template-overview.html`,'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/starter/templates/template-card.html`,'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/starter/templates/template-product.html`,'utf-8');


const data = fs.readFileSync(`${__dirname}/starter/dev-data/data.json`,'utf-8');
const dataObj = JSON.parse(data);   //before using map, you need to parse the JSON data using JSON.parse, as the readFileSync method reads the file content as a string.



const server = http.createServer((req,res)=>{
    
    const {query, pathname} = url.parse(req.url, true);


    if (pathname=='/' || pathname=='/overview') {
        res.writeHead(200, {'Content-type' : 'text/html'});
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output);
    }
    else if (pathname=='/product') {
        res.writeHead(200, {'Content-type' : 'text/html'});
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct,product);


        res.end(output);
    }
    else if(pathName=='/api'){
        res.writeHead(200, {'Content-type' : 'application/json'});
        res.end(data);

    }
    else{
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-header' : 'Its my costum error !!!'
        });
        res.end('<h1>This is it !!!</h1>');
    }
})

server.listen(8000, '127.0.0.1', ()=>{
    console.log('Listening to requests on port 8000')
})

