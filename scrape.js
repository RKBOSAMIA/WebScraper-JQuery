const request = require('request');
const cheerio = require('cheerio');
var fs = require('fs');

const url = 'https://en.wikipedia.org/wiki/2019%E2%80%9320_coronavirus_pandemic';
request( url ,function(error,response,html)
{
     if(!error && response.statusCode==200)
     {
         const $ = cheerio.load(html);
         var region = new Array();
         var cases = new Array();
         var deaths = new Array();
         var recovered = new Array();

         const total_confirmed = $('tbody tr .covid-total-row span b').eq(1).text();
         const total_deaths = $('tbody tr .covid-total-row span b').eq(2).text();
         const total_recovered = $('tbody tr .covid-total-row span b').eq(3).text();

         const tbody = $('tbody').eq(4);

         region.push("Total");
         cases.push(total_confirmed);
         deaths.push(total_deaths);
         recovered.push(total_recovered);

         myJSON = [];
         for(var i=2;i<226;i++)
         {
            region.push(tbody.find('tr').eq(i).find('th').eq(1).find('a').html());
         }
         for(var i=2;i<226;i++)
         {
            cases.push(tbody.find('tr').eq(i).find('td').eq(0).text());
            deaths.push(tbody.find('tr').eq(i).find('td').eq(1).text())
            recovered.push(tbody.find('tr').eq(i).find('td').eq(2).text())
         }
         for(let i=0;i<region.length;i++)
         {
             var temp = {Region:region[i],Cases:cases[i],Deaths:deaths[i],Recovered:recovered[i]};
             myJSON.push(temp);
         }

        fs.writeFile("./ScrapedData.json",JSON.stringify(myJSON,null,4),(err)=>{
             if(err)
             {
                 console.error(err);
                 return;
             }
         });
         console.log("Done");
     }
     else
     {
         console.log(request.statusCode);
     }

});