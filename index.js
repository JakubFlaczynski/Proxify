var fs = require("fs");
var proxyChecker = require("proxy-checker");
const axios = require("axios");
const cheerio = require("cheerio");

let url = "https://free-proxy-list.net/";

axios
  .get(url)
  .then((response) => {
    const $ = cheerio.load(response.data);

    $("table.table-striped tbody tr").each((index, element) => {
      const td1 = $(element).find("td").eq(0).text().trim();
      const td2 = $(element).find("td").eq(1).text().trim();
      const formattedData = `${td1}:${td2}\n`;

      fs.appendFile("list.txt", formattedData, (err) => {
        if (err) throw err;
        console.log("Data saved to list.txt");
      });
    });
  })
  .catch((error) => {
    console.error(`Error fetching data from ${url}: ${error}`);
  });
url = "https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt";

axios
  .get(url)
  .then((response) => {
    fs.writeFile("list.txt", response.data, (err) => {
      if (err) throw err;
      console.log("Data saved to list.txt");
    });
  })
  .catch((error) => {
    console.error(`Error fetching data from ${url}: ${error}`);
  });
setTimeout(checkProxy, 5000);

function checkProxy() {
  proxyChecker.checkProxiesFromFile(
    "list.txt",
    {
      url: "http://www.google.com",
    },
    function (host, port, ok, statusCode, err) {
      if (statusCode === 200 && ok) {
        var data = host + ":" + port + "\n";
        fs.appendFile("results.txt", data, function (err) {
          if (err) throw err;
          console.log("Google verified:", data);
        });
      } else {
        console.log(
          "Verification failed for:",
          host + ":" + port,
          "Status code:",
          statusCode
        );
      }
    }
  );
}
